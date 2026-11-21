# Under the Surface

An independent digital knowledge magazine about hidden worlds. Phase 1 includes the homepage, an interactive ocean-depth lab, and previews for Explore, Topics, Stories, Lab, and About.

## Local development

Use Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

Next.js serves the app on port 3000 by default. Artwork and fonts are local assets. The visuals are editorial illustrations. The app requires no credentials or external services at runtime.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

The production server uses the output of the preceding build.

## Structure

- `app/` contains routes, metadata, and global styles.
- `components/layout/` contains site navigation, footer, and the section preview.
- `components/home/` contains the hero, editorial sections, and ocean-depth lab.
- `lib/editorial.ts` contains the homepage editorial content and navigation.
- `public/images/` contains the generated editorial artwork.
