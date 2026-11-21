"""Build the browser-sized Atlas snapshots from the upstream files in a local directory.

The input names and upstream URLs are documented in public/data/README.md.
"""
import csv
import json
import math
import sys
from pathlib import Path
from PIL import Image, ImageDraw

source = Path(sys.argv[1])
data = Path("public/data")
colors = {
    "K_200": "#1c5260", "J_1000": "#194756", "I_2000": "#163d51",
    "G_4000": "#112d47", "E_6000": "#14213e", "C_8000": "#211d45", "A_10000": "#34274e",
}

def polygons(features):
    for feature in features:
        geometry = feature["geometry"]
        yield from [geometry["coordinates"]] if geometry["type"] == "Polygon" else geometry["coordinates"]


size = (2160, 1080)
ocean = Image.new("RGB", size, "#236373")
for depth, color in colors.items():
    band = json.loads((source / f"bathy-{depth}").read_text())
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    for polygon in polygons(band["features"]):
        for index, ring in enumerate(polygon):
            points = [(round((lon + 180) * 6), round((90 - lat) * 6)) for lon, lat in ring]
            draw.polygon(points, fill=255 if index == 0 else 0)
    ocean.paste(color, mask=mask)
ocean.resize((1440, 720), Image.Resampling.LANCZOS).save(data / "bathymetry.webp", quality=84)

land = Path("public/images/world-land.svg").read_text()
(data / "atlas-land.svg").write_text(land[:land.index("<rect")] + land[land.index("<path"):])

with (source / "temperature.csv").open() as file:
    temperature = [[int(row["Year"]), float(row["Mean"])] for row in csv.DictReader(file)
                   if row["Source"] == "GISTEMP" and 1880 <= int(row["Year"]) <= 2025]

places = json.loads((source / "places.geojson").read_text())["features"]
cities = ["Tokyo", "Shanghai", "Mumbai", "New York", "Lagos", "Jakarta", "Alexandria", "Manila",
          "Dhaka", "Buenos Aires", "Rio de Janeiro", "Bangkok", "Lima", "Ho Chi Minh City",
          "Singapore", "Rotterdam", "Cape Town", "Sydney", "Miami", "San Francisco", "Kolkata"]
coasts = []
for name in cities:
    matched = [item for item in places if item["properties"]["nameascii"] == name]
    if not matched:
        continue
    point = max(matched, key=lambda item: item["properties"]["pop_max"])
    lon, lat = point["geometry"]["coordinates"]
    value = point["properties"]
    coasts.append([name, round(lat, 3), round(lon, 3), value["adm0name"], value["pop_max"]])

countries = json.loads((source / "countries.geojson").read_text())["features"]
country_names = {item["properties"]["ISO_A3"]: item["properties"] for item in countries
                 if item["properties"]["ISO_A3"] != "-99"}
for name, code in {"France": "FRA", "Norway": "NOR"}.items():
    match = next((item["properties"] for item in countries if item["properties"]["ADMIN"] == name), None)
    if match:
        country_names[code] = match
years = [1990, 2000, 2010, 2020, 2023]
emissions = {}
with (source / "co2.csv").open() as file:
    for row in csv.DictReader(file):
        code, year = row["iso_code"], int(row["year"])
        if code not in country_names or year not in years or not row["co2"]:
            continue
        country = country_names[code]
        lat, lon = country["LABEL_Y"], country["LABEL_X"]
        if not math.isfinite(lat + lon):
            continue
        entry = emissions.setdefault(code, [row["country"], lat, lon, {}])
        entry[3][year] = round(float(row["co2"]), 2)

(data / "atlas-observations.json").write_text(json.dumps({
    "temperature": temperature, "coasts": coasts, "emissions": list(emissions.values())
}, separators=(",", ":")) + "\n")
