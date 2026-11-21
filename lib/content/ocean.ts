export const zones = [
  { id: "sunlight", name: "Sunlight zone", min: 0, max: 200, sample: 25, color: "#2b7889", fog: "#174b68", light: "Some sunlight supports photosynthesis.", life: "Phytoplankton grow where light and nutrients permit, feeding much of the marine food web.", organism: "Phytoplankton and schooling fish" },
  { id: "twilight", name: "Twilight zone", min: 200, max: 1000, sample: 500, color: "#273a76", fog: "#192651", light: "Dim sunlight remains, usually too little for photosynthesis.", life: "Some lanternfish rise to feed after dusk. Other animals use downward light to conceal their silhouettes.", organism: "Lanternfish and squid" },
  { id: "midnight", name: "Midnight zone", min: 1000, max: 4000, sample: 2400, color: "#20264b", fog: "#14172f", light: "Sunlight is effectively absent.", life: "Some animals make light to attract prey or communicate. Food also arrives as sinking particles.", organism: "Deep-sea fish and gelatinous animals" },
  { id: "abyssal", name: "Abyssal zone", min: 4000, max: 6000, sample: 5000, color: "#202d3b", fog: "#15242d", light: "Sunlight does not reach this zone.", life: "Sea cucumbers and other animals process organic material deposited on abyssal plains.", organism: "Sea cucumbers and amphipods" },
  { id: "hadal", name: "Hadal zone", min: 6000, max: 11000, sample: 8500, color: "#1c2631", fog: "#111921", light: "The trench is permanently dark.", life: "Amphipods and other trench-adapted animals use food focused by the trench’s steep slopes.", organism: "Trench amphipods and some snailfish" },
] as const;

export function zoneAt(depth: number) {
  return zones.find(({ max }) => depth < max) ?? zones[zones.length - 1];
}
