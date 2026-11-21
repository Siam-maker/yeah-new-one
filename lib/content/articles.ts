import type { SourceKey } from "./publication";

export type DiagramKind = "depth" | "migration" | "strata" | "ice" | "light" | "plates";
type Article = {
  slug: string;
  title: string;
  topic: string;
  image: string;
  imageDescription: string;
  deck: string;
  diagram: DiagramKind;
  experiment?: string;
  sources: SourceKey[];
  sections: { title: string; paragraphs: string[] }[];
};

function section(title: string, text: string) {
  return { title, paragraphs: text.trim().split("\n\n") };
}

export const articles: Article[] = [
  {
    slug: "life-below-the-light", title: "Life below the light", topic: "ocean-life",
    image: "/images/ocean-column.webp", imageDescription: "Editorial illustration of a luminous jellyfish suspended in dark water.",
    deck: "Below the reach of sunlight, light becomes something animals can make, hide, or aim.",
    diagram: "depth", experiment: "ocean-depth", sources: ["light", "bio", "pressure"],
    sections: [
      section("Where daylight ends", `
The colour blue is often the last trace of daylight in clear seawater. Water absorbs different wavelengths at different rates, and suspended material scatters light as it passes. Near the surface, the remaining light can power photosynthesis. Deeper down, the light may still be visible to an adapted eye even though it is too weak for most photosynthetic life. There is no switch at a single depth: the angle of the sun, the amount of plankton, and the clarity of the water all change what can be seen.

Oceanographers often describe the upper 200 metres as the sunlit zone and the interval from around 200 to 1,000 metres as the twilight zone. Those are useful divisions for comparing habitats, but a depth label is not a measurement of local brightness. Below the twilight zone, sunlight no longer provides a useful light source. In that setting, a tiny flash can stand out more clearly than a bright beacon in shallow water.
`),
      section("How a flash is made", `
Bioluminescence is light produced by chemistry within a living system. In many familiar examples, an enzyme helps oxidize a light-emitting molecule and energy is released as light. The specific molecules and mechanisms vary across organisms. Some animals make light themselves, while others have organs that house luminous bacteria. A glowing animal, therefore, may be using a partnership between species as well as specialized anatomy.

The glow is distinct from fluorescence. Fluorescent material absorbs incoming light and emits light at another wavelength. Bioluminescence can occur in complete darkness because the energy comes from a chemical reaction. Underwater, blue and green emissions can be especially effective because those wavelengths often travel farther through seawater. The colours seen in an aquarium or camera image also depend on sensors and illumination, so photographs should not be read as a full account of what an animal perceives.
`),
      section("A light that conceals", `
Think of looking up at a fish from below in the twilight zone. Even when its skin is dark, the fish can become a silhouette against brighter water above. Some species solve this problem with organs along their undersides. By emitting light downward, an animal can reduce contrast against the background. This strategy is called counterillumination. To work well, the brightness and direction of the glow need to fit conditions that change with depth and time of day.

Other uses reverse that logic. A pulse can draw attention to a lure, interrupt a predator’s attack, or mark a target. A characteristic pattern of flashes may help some animals communicate. The same basic ability can do different jobs depending on where the light comes from, how long it lasts, and which other animals can see it. That makes a light organ more like a set of adjustable signals than a single-purpose lamp.
`),
      section("How to watch the dark", `
Studying deep-sea light is difficult because observation changes the scene. A remotely operated vehicle may reveal an animal’s anatomy while its lamps drown out a faint flash or change the animal’s behaviour. A low-light camera can record emissions in darkness but often sacrifices colour, sharpness, or context. Nets gather specimens that can be examined closely, yet they remove animals from the conditions in which their behaviour makes sense.

To separate a natural signal from an artefact, researchers compare observations across methods. They can combine imagery, depth and environmental measurements, laboratory chemistry, and experiments on how animals respond. Even then, a recorded flash does not automatically disclose its purpose. A careful observation describes what happened first and proposes a function only where the evidence supports it. The light provides a clue. The dark water around it is part of the evidence.
`),
      section("The cost of making light", `
Light has to be useful enough to pay for its chemistry and for the organs that produce or control it. An emission that conceals a fish from one angle might expose it from another. A signal that reaches a potential mate can also reach an animal looking for food. The balance changes across clear water, particle-rich plumes, shadowed terrain, and open ocean.

That trade-off explains why the deep sea does not glow uniformly. Its signals are usually local and intermittent. They have an audience, a distance, and an environment. To understand a point of light, begin by asking who is looking, from where, and against what background.
`),
    ],
  },
  {
    slug: "a-night-shift-in-the-ocean", title: "A night shift in the ocean", topic: "ocean-life",
    image: "/images/deep-sea.webp", imageDescription: "Editorial illustration of an animal in the dark water column.",
    deck: "After sunset, many animals rise to feed. Their daily commute connects the surface to the deep sea.",
    diagram: "migration", experiment: "ocean-depth", sources: ["migration", "light", "pressure"],
    sections: [
      section("A layer that moves", `
An acoustic instrument sends a pulse into the ocean and listens for the echo. Some returns come from the bottom. Others form broad bands in the water itself. When a band becomes shallower around dusk and deeper around dawn, it is often evidence of a community moving together, even when the individual animals are too small or too far away to see. The moving band is known as a deep scattering layer.

Many fish, crustaceans, and other animals spend daylight hours in dimmer water and move toward the surface at night. Scientists call this pattern diel vertical migration. Diel means it follows a day–night cycle. There is substantial variation among species and places. Some animals make shorter trips, some stay put, and some migrate in the other direction. The apparent coherence of the acoustic layer contains many separate decisions.
`),
      section("A bargain between food and safety", `
Near-surface waters often have more readily available food because sunlight supports photosynthesis there. They can also make feeding animals more visible to predators that hunt by sight. Feeding at night can reduce that exposure. Remaining deeper during the day can offer cover, although deeper water can be colder, lower in oxygen, or less rich in food. The trip makes sense only when the benefits outweigh the costs of moving and of spending time on either side of the journey.

Sunset and sunrise supply cues, but the timing is not always fixed. Cloud, moonlight, water clarity, and local predators can alter the light level that matters to an animal. Migration is also shaped by physiology. An animal that tolerates low oxygen can use a depth range that excludes competitors or predators. A population made up of different sizes or life stages may show multiple migration patterns at the same site.
`),
      section("How an echo becomes evidence", `
A sound pulse can travel farther underwater than visible light. By tracking returns through time, scientists can observe movement without having to illuminate the whole layer. The strength of a return depends on the animal’s size and material properties. Gas-filled structures can produce strong echoes, which means the most acoustically conspicuous organisms do not necessarily account for the largest number of animals.

To find out who is moving, researchers compare sound at more than one frequency and use observations from nets, cameras, or other instruments. Sampling at different depths and times helps distinguish an actual migration from a change in the population passing underneath a ship. Even the act of measuring can matter: avoidance of gear and the effect of artificial light can bias a sample. It takes several lines of evidence to translate a bright band into a credible story about animals.
`),
      section("Moving carbon down", `
Animals that feed near the surface and return deeper move organic carbon with them. Some of that material leaves the animals through respiration, excretion, fecal pellets, or mortality at depth. This active transport works alongside the passive sinking of organic particles sometimes called marine snow. The two pathways are connected because moving animals consume, break up, or repackage material as they feed.

The significance of the transport depends on how much material reaches depth and what happens after it arrives. Carbon released deeper is generally less immediately exposed to exchange with the atmosphere, but timescales differ with currents, chemistry, and depth. The direction of travel is easier to establish than the total budget. Estimating how much carbon is moved requires knowing which animals migrate, how far they travel, what they consume, and where they release material.
`),
      section("The ocean’s local clocks", `
Imagine repeating the same acoustic survey in an estuary, a clear subtropical gyre, and a polar sea. The day length differs, the water absorbs light differently, and the predators are different. There may be several scattering layers, with distinct populations moving at distinct times. At high latitudes seasonal changes in light can complicate the familiar dusk-to-dawn schedule.

The most useful question is often local: how does a moving population respond to conditions here? Repeated observations across weather, seasons, and sites reveal how general a pattern really is. The large-scale image of animals rising at sunset is accurate as a starting point. Its scientific value grows when we can explain the exceptions as well as the pattern.

The evidence is especially useful when it includes intervals in which no migration occurs. Those observations help separate the effect of light from changes in food, oxygen, or predators. A long record can contain several useful comparisons without requiring the ocean to be held constant.
`),
    ],
  },
  {
    slug: "the-memory-of-rock", title: "The memory of rock", topic: "earth-geology",
    image: "/images/strata-wall.webp", imageDescription: "Editorial illustration of layered sediment in a canyon exposure.",
    deck: "A cliff can hold evidence of rivers, seas, droughts, and long intervals missing from the record.",
    diagram: "strata", experiment: "geologic-time", sources: ["rocks", "time", "plates"],
    sections: [
      section("What a cliff preserves", `
Facing a cliff of sedimentary rock is like looking at the edge of a stack of pages. The analogy helps with orientation, but rock layers are not a continuous written account. Sediment is deposited in some places and removed in others. A flood may leave a conspicuous layer within hours while a long interval of stability contributes little or nothing visible. Thickness cannot be converted into time without additional evidence.

Before interpreting a layer, geologists describe it. They take note of grain size, sorting, mineral composition, and boundaries. They look for pebbles that align with flow, mud cracks that indicate drying, and fossils that place limits on possible environments. The aim is to build a chain from visible observations to a credible past process. An unusual colour might help identify a unit, but by itself it rarely tells you how that unit formed.
`),
      section("The geometry of a former landscape", `
Sand carried by wind or water can form ripples and dunes. When some sediment is eventually buried, sloping surfaces within the deposit can be preserved as cross-bedding. The orientation and geometry of those surfaces give clues about the direction and behaviour of the flow. Layers formed under very different conditions can look superficially similar, so the interpretation becomes stronger when several features agree.

Geologists distinguish the age of grains from the age at which they were deposited. A sand grain may have eroded from a much older rock before being transported and buried. Minerals in the same bed can therefore record a history that predates the sedimentary environment itself. One key skill is deciding which part of the history each measurement actually constrains. A grain can say something about where sediment came from without providing the age of the bed on its own.
`),
      section("A gap you can touch", `
When deposition stops or erosion strips away earlier deposits, the next layer may rest against a surface that cuts across older material. This boundary is an unconformity. An especially clear example occurs when younger beds lie above eroded, tilted beds. Deposition, tilting, uplift, and erosion all had to happen before the new sediments accumulated. The contact can be thin enough to trace with a finger even though it represents a large interval of time.

An unconformity is a gap in the local record. During the same interval, sediment may have accumulated elsewhere. Comparing sections across a region helps researchers distinguish local erosion from a more widespread change. The missing time is therefore not automatically unrecoverable. It may have to be reconstructed from another place, from dating, or from evidence carried into the layers on either side of the gap.
`),
      section("Putting numbers on the order", `
In an undisturbed stack, lower sedimentary beds were generally deposited before higher beds. Faults, intrusions, and erosional surfaces that cut a sequence are younger than the rocks they cut. These relationships establish an order without providing numerical ages. Fossils can relate beds where organisms with well-understood times of appearance and disappearance are preserved, but reworking or gaps can complicate comparisons.

Radioactive decay in suitable minerals provides an independent means of estimating numerical ages. A volcanic ash bed within a sedimentary sequence can be especially useful if it contains dateable minerals that formed with the eruption. A laboratory age always needs a geological interpretation and an uncertainty. The international time scale combines many kinds of evidence and uses defined boundaries to make comparisons between regions precise.
`),
      section("Read outward from the outcrop", `
One cliff face gives a section through a world that once extended far beyond it. A river channel may pinch out within a few hundred metres, while a marine deposit may be traceable over great distances. Measurements along several outcrops or cores help establish whether a feature is local, regional, or a result of the viewing angle.

Start with a small question when looking at an exposure: which surface separates two different histories? Then establish what crosses it, what rests on it, and which observations independently limit the timing. The value of the record is not that it is complete. It is that incomplete traces can still constrain a sequence of events. The gaps make that careful reading indispensable.

A hand lens, a sketch of the contacts, and a record of where each observation came from can be as important as an impressive view. Together they let another observer return to the same exposure and test whether the proposed sequence follows from what is visible.
`),
    ],
  },
  {
    slug: "what-the-ice-keeps", title: "What the ice keeps", topic: "systems-signals",
    image: "/images/glacier.webp", imageDescription: "Editorial illustration of fractured glacial ice and mountain rock.",
    deck: "An ice core keeps several calendars at once. The snow, dust, and air in one sample can tell different stories.",
    diagram: "ice", sources: ["ice", "iceData"],
    sections: [
      section("Snow becomes an archive", `
On an ice sheet, some snow survives the following summer and is buried by later snow. Weight from above compacts the older material. In the intermediate stage, called firn, the grains are pressed together but air can still travel through interconnected spaces. Deeper down, some of those paths close. Air becomes isolated in bubbles while the surrounding ice continues to compress and move.

A core drilled through such a layer therefore contains more than frozen water. It can hold dust, sea salt, volcanic material, and gas. Different measurements point to different processes. Dust can record transport from distant dry regions or changes in winds, while sulfur compounds may mark the fallout from an eruption. An air sample can reveal the composition of the atmosphere when pores closed. A single slice is a collection of records with their own origins and clocks.
`),
      section("Why the clocks disagree", `
Snow begins its history as it falls, but air in firn can mix with the atmosphere for some time afterward. The gas in a bubble is generally younger than the ice that surrounds it. The size of the age difference depends on conditions such as temperature and the rate at which fresh snow accumulates. The gas enclosed at a particular depth may also contain a spread of ages because air does not stop moving everywhere at once.

That distinction matters when comparing a greenhouse gas measurement with a temperature proxy. Lining up samples taken at the same depth does not automatically line up the events in time. Researchers estimate separate ice and gas chronologies and report their uncertainty. Dating improves when known events can be identified in multiple records or when observations of firn help constrain how air was enclosed.
`),
      section("What can be measured directly", `
Scientists can extract gas from ice and measure concentrations of gases such as carbon dioxide and methane. Those concentrations are measurements of trapped air, although extraction, contamination, diffusion, and the timing of enclosure still have to be assessed. Other properties of the ice serve as proxies. For example, the ratios of certain isotopes in water respond to temperature and to the history of the moisture that became snow.

A proxy is most useful when the relationship between the measured quantity and the quantity of interest is understood. The isotope composition of snow can depend on where the moisture came from, how it travelled, and which seasons produced the snowfall. Researchers can use models and present-day observations to help interpret those influences. A curve from one core needs a context before it can be used to represent regional or global climate.
`),
      section("Comparing archives", `
Sites with high snowfall can offer relatively fine time resolution because an individual year leaves more material to sample. Sites with much less snowfall may extend the archive further back, although individual layers can be thin or hard to distinguish. Flow also stretches and thins layers with depth. Near the bottom, some ice can be deformed or disturbed, making chronology especially demanding.

Independent cores provide a way to check the signals. A volcanic layer can link two sequences if it is securely identified in both. A change in a well-mixed atmospheric gas may appear in distant records, though the local processes of enclosure can shift or smooth its expression. When several records agree, researchers can ask whether they register a shared atmospheric change. When they differ, the difference is evidence about how the archive formed.
`),
      section("A practical way to read an ice-core figure", `
Start by reading the labels. The horizontal axis might give depth, ice age, or gas age. The vertical axis might give a concentration, an isotope ratio, or a reconstruction that uses several measurements. Examine the location named in the caption and the period covered before comparing the figure with another record. A visible offset may result from dating uncertainty rather than a meaningful delay in the climate system.

Finally, distinguish a single site from a global reconstruction. The strength of an ice core is that it preserves physical samples and several independent signals in the same material. The scientific challenge is to put those signals on the right timescales, with their uncertainties intact. When that work is done, a narrow cylinder of ice can tell us things about the atmosphere that no human observer recorded.

The most informative comparison often includes uncertainty bands and an account of how the samples were dated. Small details of the reconstruction may change as new cores are measured, even when the broad sequence of atmospheric changes is already clear.
`),
    ],
  },
  {
    slug: "the-light-that-took-its-time", title: "The light that took its time", topic: "space-time",
    image: "/images/starlight.webp", imageDescription: "Editorial illustration of a deep star field.",
    deck: "Every telescope sees into the past. What it can tell us depends on wavelength and on how far the light travelled.",
    diagram: "light", sources: ["lightSpeed", "hubble", "webb"],
    sections: [
      section("Distance makes a delay", `
If a distant star changes brightness, the news travels at the speed of light. What arrives at a telescope is evidence about the star when the light left it. The travel time can be trivial at human scales and decisive at astronomical scales. Looking at a distant object is a way of observing a moment that has already passed for the emitter, with the time lag set by how the signal moved from there to here.

A light-year is a unit of distance, not a unit of time. It describes how far light travels in vacuum in one Julian year. In nearby astronomical settings, a distance in light-years is a useful approximation to the number of years the light spent in transit. On cosmological scales, the expansion of the universe complicates the relationship between travel time and distance. A numerical distance should say which convention is being used.
`),
      section("How a telescope selects its evidence", `
A telescope gathers radiation and directs it onto a detector. The design determines which wavelengths the instrument can register and what it can distinguish. Visible light, infrared radiation, and radio waves can report on the same object in different ways. Dust can obscure some visible light while allowing longer wavelengths to pass more easily. Cool material can emit strongly at wavelengths the human eye cannot see.

Published astronomical images often assign visible colours to measurements made at several wavelengths. That assignment can make physical differences legible as long as the caption explains the mapping. A bright spot in an infrared composite need not look bright to an observer using only visible light. The image is best understood as a visualized measurement, with choices about filters, exposure, and display that belong to the scientific story.
`),
      section("Why old light changes colour", `
As the universe expands, light travelling across very large distances can be stretched to longer wavelengths. The resulting cosmological redshift can move features that were emitted in visible or ultraviolet light into the infrared. Astronomers identify redshift by comparing recognizable patterns, such as spectral lines, against measurements made in the laboratory, or estimate it from measurements in several bands when a detailed spectrum is unavailable.

Redshift is not a universal synonym for distance. A source moving relative to an observer can also shift wavelengths, as can gravity. At cosmological distances, interpreting redshift in terms of the age of the universe or a particular distance measure requires a model of expansion. A reported value carries more meaning when you know the assumptions, how it was measured, and whether a second method corroborates it.
`),
      section("Deep fields and their blind spots", `
A deep field is obtained by gathering light for a long time from a comparatively small direction in the sky. Faint objects that would fall below the noise in a short exposure can emerge. Hubble’s deep fields revealed large numbers of galaxies in small areas. With infrared observations, Webb can look for distant systems whose light has shifted to longer wavelengths and can examine some regions hidden by dust at visible wavelengths.

A deep field does not contain everything that exists along that line of sight. The image is limited by the sensitivity and resolution of the instruments, the choice of filters, and the foreground between us and the sources. Objects with very diffuse light may be difficult to detect. To compare populations, astronomers account for which kinds of galaxies an observation could have detected at a given distance.
`),
      section("Reading the time in an image", `
Objects that appear adjacent in a sky image can be separated by enormous distances. The light from one may have travelled millions of years longer than the light from another. It helps to ask which measurements identify the sources and whether their distances are comparable. A projected arrangement on a flat image does not by itself establish a physical grouping.

This is the promise and the limit of seeing through light. Astronomy makes earlier stages of the universe accessible without permitting us to observe every past moment in the same place. We assemble a history from signals arriving now, each selected by a particular instrument and travel path. The photograph becomes far more expressive once its delays and filters are part of what we see.

That reading can begin without specialist equipment. Compare the captions of visible and infrared views of one region. Look for which features persist across wavelengths, which emerge only in one image, and which differences the caption attributes to the instrument.
`),
    ],
  },
  {
    slug: "tectonic-plates-in-motion", title: "Tectonic plates in motion", topic: "earth-geology",
    image: "/images/canyon.webp", imageDescription: "Editorial illustration of eroded rock in plan view.",
    deck: "Mountain belts, deep trenches, and strips of new ocean floor record the movement of Earth’s outer shell.",
    diagram: "plates", experiment: "plate-tectonics", sources: ["plates", "boundaries"],
    sections: [
      section("A solid surface that moves", `
The continents and ocean floors belong to rigid sections of Earth’s outer shell called tectonic plates. A plate comprises crust and part of the uppermost mantle. The material below can deform over geological time, allowing the plates to move relative to one another. Their travel is slow enough to escape ordinary observation, but repeated position measurements, earthquake patterns, and the geometry of the seafloor provide evidence of motion.

A map of boundaries shows where relative motion is concentrated. The boundaries are usually drawn as lines, though some occupy broad belts with more than one active fault. The line is a model of where particular plates meet. Where it crosses a continent or an ocean floor, the structure around it can be more complicated than the symbol suggests. A scientifically useful map makes the abstraction clear.
`),
      section("Divergence makes new ocean floor", `
At an oceanic spreading ridge, plates move away from one another. Hot mantle rises in response and may partially melt as pressure falls. Melt can reach the surface and cool, adding material to the oceanic crust. Older ocean floor moves away from the ridge, carrying with it a record of the conditions when it formed. Researchers compare ages and other properties across the ridge to reconstruct earlier rates and directions of spreading.

Certain magnetic minerals can align with Earth’s magnetic field as rock cools. Because the field has reversed repeatedly, stripes of differently magnetized rock may occur on either side of the ridge. The stripes help support the interpretation that new floor formed at the ridge and was carried outward. Magnetic observations work together with rock dating, maps of seafloor relief, and earthquake records.
`),
      section("Convergence recycles and raises rock", `
When plates converge, one can descend into the mantle beneath another. This process is called subduction. A trench often marks the bend where the descending plate begins to dip. Earthquakes can occur along the plate interface and within the descending slab. Fluids released by the slab can promote partial melting in the mantle above it, helping to form arcs of volcanoes at some convergent margins.

When continents collide, the result can be a wide mountain belt. Continental material is relatively buoyant, so much of the convergence may be accommodated by shortening and thickening rather than by straightforward recycling of all crust into the mantle. The detailed geometry depends on earlier oceans, faults, rocks, and direction of motion. That is why two convergent margins can share principles without presenting the same landscape.
`),
      section("Transform motion and locked faults", `
At a transform boundary, neighbouring plates move past each other. Over long times the motion can be steady even though a fault is locked for decades or longer at a particular place. Strain accumulates in surrounding rock until slipping releases some of it. The resulting earthquake sends waves through the ground. Some faults creep, and different segments of the same boundary can behave differently.

Underwater, transform faults can connect segments of a spreading ridge. The active part sits between the offset ridge segments, where the young plates move past each other. Farther away, the scar can continue as a fracture zone with a different motion history. An aerial view or bathymetric map helps explain this distinction, while a geological cross-section is better at showing the dipping geometry of a subduction zone.
`),
      section("What a model can show", `
An animated cross-section lets us isolate directions of motion. Move the plates apart and focus on the gap between them. Move one beneath the other and watch for the relationship between a trench, a dipping slab, and a volcanic arc. Slide two plates horizontally and look for the offset rather than a slice of new crust. These comparisons clarify the vocabulary underlying a more complex map.

The same animation cannot predict the time or size of an earthquake, the shape of a particular mountain range, or the mechanics of a real fault. Those questions require material properties, measurements, a spatial scale, and careful treatment of uncertainty. Use the visualization as a guide for interpreting the evidence. The landscape is shaped by many changes that the teaching model deliberately leaves out.

Use the Atlas to compare a clear spreading ridge with a boundary across a continent. In the first case, symmetrical bands of ocean floor can make the direction of motion legible. In the second, faulting may spread across a broad zone, and the same simple line represents quite different evidence.
`),
    ],
  },
];

export function readingMinutes(article: Article) {
  const words = article.sections.flatMap(({ paragraphs }) => paragraphs).join(" ").trim().split(/\s+/).length;
  return Math.ceil(words / 220);
}

export function articleSectionId(index: number) {
  return `section-${index + 1}`;
}
