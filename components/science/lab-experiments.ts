import { OceanLab } from "./ocean-lab";
import { TimeLab } from "./time-lab";
import { PlateLab } from "./plate-lab";
import { BiodiversityLab, CarbonLab, ClimateChangeLab, CrossSectionLab, GrowthLab, LightTravelLab, PressureLab, SeismicLab, TemperatureLab } from "./extended-labs";

export const experiments = {
  "ocean-depth": OceanLab,
  "geologic-time": TimeLab,
  "plate-tectonics": PlateLab,
  "ocean-pressure": PressureLab,
  "earthquake-waves": SeismicLab,
  "climate-change": ClimateChangeLab,
  "global-temperature": TemperatureLab,
  "carbon-emissions": CarbonLab,
  "population-growth": GrowthLab,
  "biodiversity-distribution": BiodiversityLab,
  "light-travel-time": LightTravelLab,
  "geological-cross-section": CrossSectionLab,
};
