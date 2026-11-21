# Atlas data

Run `python3 scripts/build-atlas-data.py /path/to/input-directory` from the project root to regenerate the display snapshots.

| Local input | Upstream dataset |
| --- | --- |
| `bathy-A_10000`, `bathy-C_8000`, `bathy-E_6000`, `bathy-G_4000`, `bathy-I_2000`, `bathy-J_1000`, `bathy-K_200` | [Natural Earth 1:10m bathymetry](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-bathymetry/). GeoJSON files are available from [the Natural Earth vector repository](https://github.com/nvkelso/natural-earth-vector/tree/master/geojson). |
| `places.geojson` | [Natural Earth 1:10m populated places](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_populated_places_simple.geojson) |
| `countries.geojson` | [Natural Earth 1:110m administrative countries](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson) |
| `temperature.csv` | [DataHub annual GISTEMP mirror](https://github.com/datasets/global-temp/blob/master/data/annual.csv) and [NASA GISTEMP v4 methods](https://data.giss.nasa.gov/gistemp/) |
| `co2.csv` | [Our World in Data CO₂ dataset](https://github.com/owid/co2-data), including Global Carbon Budget estimates |

Bathymetry is a generalized contour display and cannot be used for navigation. The coastline overlay is based on the existing Natural Earth 1:110m land asset. Tectonic boundaries are Peter Bird’s PB2002 compilation. The city points use Natural Earth’s mixed-date POP_MAX estimates and show selected coastal or delta settlements. These values describe settlement size and cannot estimate local flood exposure. CO₂ points show territorial fossil and industrial emissions in million tonnes for five years between 1990 and 2023. Point locations are label positions. GISTEMP values are annual global temperature anomalies relative to 1951–1980 for 1880–2025. Marine biodiversity pins are selected habitat examples with reference links.
