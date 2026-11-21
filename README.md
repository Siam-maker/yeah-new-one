# Under the Surface

A Next.js science publication with long-form stories, topic guides, three interactive labs, a globe and reference map, a glossary, and site-wide search.

## Development

Use Node.js 20.9 or newer.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
```

Routes, metadata, and layouts live in `app/`. The publication’s content and source links are in `lib/content/`. Client-side models, illustration fallbacks, and lab controls are in `components/science/`, with the homepage cave in `components/home/abyss/`.

The Atlas uses Natural Earth land polygons and Peter Bird’s PB2002 boundary model. The Atlas page links to the sources and globe texture. The starlight feature contains a contrast-stretched infrared observation with its FITS source and instrument credit. Images identified as editorial illustrations depict the subject without serving as observational evidence.
