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

The Atlas sources and regeneration steps are in [public/data/README.md](public/data/README.md). The data generator uses Python with Pillow.

To enable subscriptions, set `NEWSLETTER_ENDPOINT` to a trusted HTTPS provider adapter when building and running the site. The adapter receives a JSON POST with an `email` field and must return a successful HTTP response only when it accepts the subscription request. Set `NEWSLETTER_TOKEN` if the adapter expects bearer authentication. Apply the provider’s consent and abuse controls at the adapter. With no configured endpoint, the interface shows a closed state.
