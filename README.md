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

## Learning and language coverage

`lib/content/learning-index.ts` defines the course catalogue. `lib/content/learning-content.ts` holds 41 lessons, their investigation prompts, references, practice links and quiz explanations. Add new source keys in `lib/content/publication.ts`. Keep lesson IDs stable because they are anchor links and local progress keys. The teaching guide can be printed from `/learn/teaching`.

English keeps the original unprefixed URLs. Bengali, Spanish, French, German, Arabic, Hindi, Simplified Chinese, Japanese and Portuguese use localized entry pages, search controls and short course introductions. The interface identifies where the original article, full course or instrument is in English. Localized fallback pages point to the English canonical URL and carry a no-index directive. The language selector remembers a preference on the current device and preserves the resource path.

For translation contributions, start from the English source, preserve units and scientific names, and have a fluent reviewer with domain knowledge verify the wording against the cited sources. Edit the language dictionary in `lib/i18n/messages.ts` and the entry guides in `lib/i18n/introductions.ts`. Keep original-English links in place until corresponding translations complete that review. Translation and source coverage are tracked independently. The completion sprint below lists the current editions.

The emissions pathways lab uses an explicitly hypothetical annual index. The ice-core lab illustrates the archive process and links to the NOAA catalog for actual paleoclimate observations. The catalogue at `/explore#datasets` links to existing public snapshots, their methodology, and citation text.

## Completion sprint

- `/world` runs four interactive Three.js environments in place. Its Share exhibit button captures the current selection and camera. Each experiment has a non-WebGL view and keyboard controls. `/atlas?view=globe` remains the geographic 3D view. Automatic homepage cave activation waits for a visible tab, a fine pointer, available WebGL and an adequate device profile. The cave button also controls the manual view.
- English has 18 journal articles, including seven new case studies and explainers. Bengali has seven complete learning paths, 41 lesson translations, 11 journal adaptations, seven topic guides, and 15 laboratory guides. Ocean depth, the observatory, ice archive, and emissions pathways also have Bengali controls. The remaining lab instruments are available inside their Bengali guides with English controls. Other languages have navigation, entry pages and seven introductory subject guides. The new seven articles, most datasets and several specialist interfaces are currently English.
- `/learn/progress` and `/bn/learn/progress` share one local progress record. The reading desks support named local collections. Citation exports produce RIS and BibTeX. The infrared observation includes keyboard-accessible image annotations. Native read-aloud uses an English or Bengali voice provided by the device.
- The production service worker handles opt-in offline copies of English and Bengali stories. Readers save an article and open `/offline-reader.html`. One self-contained copy contains the text and references. Labs, maps, data and media require the online publication. Browser support, storage quotas, and clearing site data affect saved content.

### Translation review

Use English source IDs and paths as the canonical data. `lib/i18n/bengali-courses.ts` stores text keyed by stable lesson IDs; activities follow their source course order and quizzes use the source answer positions. `lib/i18n/bengali-stories.ts` and `bengali-guides.ts` store story and guide text by canonical slug. `lib/i18n/coverage.ts` records which paths have an edition so metadata, sitemap entries, and source-language notices reflect actual availability. Search indexes the translated text and marks English results.

For each new or revised edition, record the source commit and named reviewer in its translation pull request. A fluent scientific reviewer checks claims and uncertainty against the source, then checks terms, numerical values, symbols, unit notation, citation targets, quiz answer positions, and anchor IDs. Test the actual route with JavaScript disabled for document language and direction, then verify mobile layout, search, keyboard interaction and lang-marked English excerpts. The current Bengali text has been checked against the repository’s source content and browser-tested. Independent domain and language review is pending.
