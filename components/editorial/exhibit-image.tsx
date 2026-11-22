import Image, { type ImageProps } from "next/image";

const grades: Readonly<Record<string, string>> = {
  "basalt-inlet.webp":"basalt-inlet", "weathered-section.webp":"weathered-section",
  "cavern-threshold.webp":"limestone", "rift.webp":"limestone", "strata-wall.webp":"mineral", "canyon.webp":"mineral",
  "obsidian.webp":"basalt", "plunge.webp":"pelagic", "ocean-column.webp":"pelagic", "deep-sea.webp":"midnight",
  "ice-margin.webp":"glacial", "glacier.webp":"glacial", "harbor.webp":"harbor", "fossil.webp":"organic",
  "starlight.webp":"cosmic", "observatory.webp":"cosmic",
};

/** Map tiles, scientific photography and original images in the viewer retain their source colors. */
export function ExhibitImage({ src, alt, ...props }: ImageProps) {
  const grade = typeof src === "string" ? grades[src.split("/").at(-1) ?? ""] : undefined;
  return <Image {...props} alt={alt} src={src} data-grade={grade} />;
}
