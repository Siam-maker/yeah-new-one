"""Build the versioned snapshot. See public/data/DEMOGRAPHICS.md for upstream inputs."""
from collections import defaultdict
import csv
import json
from pathlib import Path
import sys

inputs, atlas_inputs = map(Path, sys.argv[1:3])
destination = Path("public/data")
ages_dir = inputs / "wpp2024-main" / "data-raw"
gap_dir = inputs / "ddf--gapminder--systema_globalis-master" / "countries-etc-datapoints"
snapshot_years = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2015, 2020, 2023, 2030, 2040, 2050]
annual_years = list(range(1950, 2051))
iso_overrides = {"-99": ""}
name_codes = {"France": ("FRA", 250), "Norway": ("NOR", 578), "Kosovo": ("XKX", 412), "Taiwan": ("TWN", 158)}

def write(name, value):
    (destination / name).write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n")

def shape_path(geometry):
    polygons = [geometry["coordinates"]] if geometry["type"] == "Polygon" else geometry["coordinates"]
    parts = []
    for polygon in polygons:
        for ring in polygon:
            points = [(round(lon+180, 1), round(90-lat, 1)) for lon, lat in ring]
            parts.append("M" + "L".join(f"{x:g},{y:g}" for x,y in points) + "Z")
    return "".join(parts)

countries = {}
shapes = {}
centers = {}
for feature in json.loads((inputs / "natural").read_text())["features"]:
    p = feature["properties"]
    alpha, numeric = name_codes.get(p["ADMIN"], (p["ISO_A3_EH"], p["ISO_N3_EH"]))
    if not alpha or alpha in iso_overrides or not str(numeric).isdigit() or p["CONTINENT"] in ["Antarctica", "Seven seas (open ocean)"]:
        continue
    code = int(numeric)
    countries[code] = [alpha, p["NAME_LONG"], p["CONTINENT"]]
    centers[alpha] = [p["LABEL_Y"], p["LABEL_X"]]
    shapes[alpha] = shape_path(feature["geometry"])

totals = defaultdict(lambda: defaultdict(float))
ages = defaultdict(lambda: defaultdict(lambda: [[0.0,0.0] for _ in range(101)]))
for sex, gender in [("M", 0), ("F", 1)]:
    for filename in [f"pop{sex}.txt", f"pop{sex}projMed.txt"]:
        with (ages_dir / filename).open() as handle:
            reader = csv.reader(handle, delimiter="\t")
            header = next(reader)
            columns = [(int(label), col) for col,label in enumerate(header) if label.isdigit() and 1950 <= int(label) <= 2050]
            for row in reader:
                code = int(row[0])
                if code not in countries and code != 900:
                    continue
                age = int(row[2].rstrip("+"))
                for year,col in columns:
                    value = float(row[col]) * 1000
                    totals[code][year] += value
                    if year in snapshot_years:
                        ages[code][year][min(100,age)][gender] += value

indicators = {}
for key in ["population_density_per_square_km", "urban_population_percent_of_total", "urban_population_growth_annual_percent"]:
    with (gap_dir / f"ddf--datapoints--{key}--by--geo--time.csv").open() as handle:
        indicators[key] = {(row["geo"].upper(), int(row["time"])): round(float(row[key]), 2)
                           for row in csv.DictReader(handle) if row[key]}

def snapshot(table, code, iso, year):
    pop = sum(sum(row) for row in table)
    if not pop: return None
    male = sum(row[0] for row in table)
    running = 0
    median = 0
    for age,row in enumerate(table):
        n = sum(row)
        if n and running + n >= pop / 2:
            median = age + (pop / 2 - running) / n
            break
        running += n
    bins = [[round(sum(row[column] for row in table[start:start+5])) for column in range(2)] for start in range(0,101,5)]
    previous = totals[code].get(year-1)
    return {
        "population":round(pop), "male":round(male), "female":round(pop-male), "median":round(median,1),
        "young":round(sum(sum(row) for row in table[:15])*100/pop,1),
        "older":round(sum(sum(row) for row in table[65:])*100/pop,1),
        "growth":round((pop / previous - 1) * 100,2) if previous else None,
        "density":indicators["population_density_per_square_km"].get((iso,year)) if year <= 2023 else None,
        "urban":indicators["urban_population_percent_of_total"].get((iso,year)) if year <= 2023 else None,
        "urbanGrowth":indicators["urban_population_growth_annual_percent"].get((iso,year)) if year <= 2023 else None,
        "ages":bins,
    }

places = defaultdict(list)
places_path = atlas_inputs / "places.geojson"
if places_path.exists():
    for feature in json.loads(places_path.read_text())["features"]:
        p = feature["properties"]
        if p["pop_max"] >= 2_000_000:
            places[p["adm0_a3"]].append([p["name"],p["pop_max"]])

result = []
for code, (iso,name,region) in sorted(countries.items(), key=lambda item:item[1][1]):
    if not ages[code]: continue
    values = {year:snapshot(table,code,iso,year) for year,table in ages[code].items()}
    result.append({"id":iso,"name":name,"region":region,"records":{year:x for year,x in values.items() if x},
                   "trend":[round(totals[code][year]) for year in annual_years],
                   "cities":sorted(places[iso],key=lambda item:item[1],reverse=True)[:4]})
write("demographics.json", {"years":snapshot_years,"countries":result,"world":[round(totals[900][year]) for year in annual_years]})
write("country-directory.json", [{key:country[key] for key in ["id","name","region"]} for country in result])
write("country-centers.json", {country["id"]:centers[country["id"]] for country in result})
write("country-paths.json", {country["id"]:shapes[country["id"]] for country in result})

with (inputs / "sea.csv").open() as file:
    series = [[int(row["Year"]), round(float(row["CSIRO Adjusted Sea Level"])*2.54,3),
               round(float(row["Lower Error Bound"])*2.54,3), round(float(row["Upper Error Bound"])*2.54,3)]
              for row in csv.DictReader(file) if row["CSIRO Adjusted Sea Level"]]
write("sea-level.json", series)
print("Converted",len(result),"areas,",len(snapshot_years),"snapshot years,",len(series),"sea level observations")
