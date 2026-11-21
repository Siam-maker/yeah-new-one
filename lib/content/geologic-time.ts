export type TimeUnit = { name: string; from: number; to: number; event: string; children?: TimeUnit[] };

const interval = (name: string, from: number, to: number, event: string, children?: TimeUnit[]): TimeUnit => ({ name, from, to, event, children });

export const eons = [
  interval("Hadean", 4567, 4031, "Earth assembled from material in the early Solar System. Zircon crystals preserve some of the oldest evidence of crust."),
  interval("Archean", 4031, 2500, "Early continental cores grew, and the rock record contains evidence of microbial life.", [
    interval("Eoarchean", 4031, 3600, "Some of the oldest surviving rock bodies formed."),
    interval("Paleoarchean", 3600, 3200, "Ancient sedimentary deposits preserve evidence interpreted as microbial communities."),
    interval("Mesoarchean", 3200, 2800, "Long-lived continental fragments developed."),
    interval("Neoarchean", 2800, 2500, "Large portions of early continental crust were assembled."),
  ]),
  interval("Proterozoic", 2500, 539, "Oxygen rose in the atmosphere, and complex cells and multicellular organisms diversified.", [
    interval("Paleoproterozoic", 2500, 1600, "Atmospheric oxygen increased significantly during the Great Oxidation Event.", [
      interval("Siderian", 2500, 2300, "Banded iron formations record changes in the chemistry of ancient oceans."),
      interval("Rhyacian", 2300, 2050, "The rock record contains evidence of major changes in surface oxygenation."),
      interval("Orosirian", 2050, 1800, "Ancient mountain belts preserve evidence of continental collisions."),
      interval("Statherian", 1800, 1600, "Large stable parts of continental crust persisted."),
    ]),
    interval("Mesoproterozoic", 1600, 1000, "Fossils record increasingly complex eukaryotic life.", [
      interval("Calymmian", 1600, 1400, "Sedimentary covers expanded across some relatively stable continents."),
      interval("Ectasian", 1400, 1200, "Rifting and sedimentation deposited new successions over older crust."),
      interval("Stenian", 1200, 1000, "Grenville-age mountain building records continental assembly."),
    ]),
    interval("Neoproterozoic", 1000, 539, "Global climate underwent major glaciations before the rise of diverse macroscopic organisms.", [
      interval("Tonian", 1000, 720, "Rifting accompanied the breakup of the supercontinent Rodinia."),
      interval("Cryogenian", 720, 635, "Extensive ice sheets reached low latitudes during major glaciations."),
      interval("Ediacaran", 635, 539, "Distinctive soft-bodied organisms left impressions in seafloor sediments."),
    ]),
  ]),
  interval("Phanerozoic", 539, 0, "Abundant fossils record the diversification of animals, plants, and ecosystems.", [
    interval("Paleozoic", 539, 252, "Marine animals diversified, life colonized land, and the era ended with a major extinction.", [
      interval("Cambrian", 539, 485, "Many animal groups diversified in the oceans."),
      interval("Ordovician", 485, 444, "Marine biodiversity expanded before an extinction near the end of the period."),
      interval("Silurian", 444, 419, "Early vascular land plants became established."),
      interval("Devonian", 419, 359, "Fish diversified and the first forests and early tetrapods appeared."),
      interval("Carboniferous", 359, 299, "Extensive wetland forests contributed to large coal deposits."),
      interval("Permian", 299, 252, "Pangaea was assembled. A severe mass extinction closed the period."),
    ]),
    interval("Mesozoic", 252, 66, "Dinosaurs diversified on land, and birds and flowering plants appeared.", [
      interval("Triassic", 252, 201, "The first dinosaurs and early mammals evolved."),
      interval("Jurassic", 201, 145, "Dinosaurs diversified and early birds evolved."),
      interval("Cretaceous", 145, 66, "Flowering plants diversified. The period ended with the extinction of non-avian dinosaurs."),
    ]),
    interval("Cenozoic", 66, 0, "Mammals and birds expanded into many ecological roles after the end-Cretaceous extinction.", [
      interval("Paleogene", 66, 23, "Mammals and birds diversified; global climate cooled over the longer term."),
      interval("Neogene", 23, 2.58, "Grasslands spread in many regions. Early hominins appeared in Africa."),
      interval("Quaternary", 2.58, 0, "Glacial cycles reshaped landscapes, and Homo sapiens emerged during the Pleistocene."),
    ]),
  ]),
];
