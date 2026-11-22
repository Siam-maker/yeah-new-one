# Under the Surface

A Next.js science publication with long-form stories, topic guides, twelve interactive labs, a solar-system observatory, a map and globe with eleven data layers, a country-level demographics explorer, a glossary, and site-wide search.

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

See the [Atlas data notes](public/data/README.md) and the [demographics and sea-level data notes](public/data/DEMOGRAPHICS.md) for sources, coverage, and regeneration.

To enable subscriptions, set `NEWSLETTER_ENDPOINT` to a trusted HTTPS provider adapter when building and running the site. The adapter receives a JSON POST with an `email` field and must return a successful HTTP response only when it accepts the subscription request. Set `NEWSLETTER_TOKEN` if the adapter expects bearer authentication. Apply the provider’s consent and abuse controls at the adapter. With no configured endpoint, the interface shows a closed state.

The Journeys routes assemble expeditions from the publication’s stories, topics, Atlas locations and labs. Stops are marked on the current browser. The Connections graph derives edges from topic guides, citation lists, glossary links, and companion readings. Its node index and connection lists provide an alternative to the visual graph.

Scientific 3D scenes load near the viewport and share device profiles, demand rendering, and context-loss recovery through illustrated fallbacks. The Earth cutaway uses approximate depth boundaries. Its crust thickness is exaggerated. The observatory uses compressed circular orbits and illustrative surface textures.

The visual identity uses locally bundled Instrument Serif for display type, Manrope for body and interface text, and IBM Plex Mono for labels and measurements. Design tokens live in `app/globals.css`. Shared editorial styling and route transition treatments are in `app/cinema.css`.

The illustrated basalt inlet and weathered sedimentary section were created for the publication. They depict representative geology. The homepage cavern illustration is the initial image and the fallback for the demand-rendered procedural scene. The Population Observatory reuses the Atlas globe and preserves the chosen snapshot and comparison when sharing a globe view.

Animation respects the operating system’s reduced-motion preference. The Atlas and Population Observatory also support explicit 3D mode, horizontal drag, and button-based rotation.
