export const navigation = [
  { label: "Explore", href: "/explore" },
  { label: "Topics", href: "/topics" },
  { label: "Stories", href: "/stories" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
] as const;

export const discoveries = [
  {
    category: "Deep waters",
    title: "Life below the light",
    description: "In the deep ocean, some animals make their own light to hunt, hide, and communicate.",
    image: "/images/deep-sea.webp",
    alt: "Illustration of a luminous blue jellyfish",
    position: "50% 43%",
  },
  {
    category: "Deep time",
    title: "The memory of rock",
    description: "Layers of sediment preserve traces of landscapes that disappeared millions of years ago.",
    image: "/images/canyon.webp",
    alt: "Illustration of red canyon ridges from above",
    position: "50% 49%",
  },
  {
    category: "Frozen worlds",
    title: "What the ice keeps",
    description: "Bubbles trapped in glacial ice preserve samples of the air from centuries past.",
    image: "/images/glacier.webp",
    alt: "Illustration of a steep glaciated mountain",
    position: "50% 37%",
  },
] as const;

export const topics = [
  { name: "Earth & Geology", summary: "Read the layers of a restless planet.", icon: "earth" },
  { name: "Ocean & Life", summary: "Follow life into the dark.", icon: "waves" },
  { name: "Space & Time", summary: "Look back through the light we see.", icon: "orbit" },
  { name: "Systems & Signals", summary: "Find the patterns that shape what we notice.", icon: "signal" },
] as const;

export const stories = [
  { title: "A night shift in the ocean", category: "Ocean & Life", synopsis: "After sunset, many ocean animals swim toward the surface to feed and return to deeper water before dawn." },
  { title: "How a mountain comes apart", category: "Earth & Geology", synopsis: "Water, ice, and gravity break down mountains and carry their fragments into rivers and valleys." },
  { title: "The light that took its time", category: "Space & Time", synopsis: "Because light travels at a finite speed, astronomers see distant objects as they appeared in the past." },
] as const;
