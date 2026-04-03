# Paris 2026 Map

Interactive Paris municipal election map with:

- 2026 bureau-level map
- arrondissement-level simplified mode
- historical election view
- demography charts
- bilingual FR/EN UI

## Local run

No package manager is required.

1. Double-click `open-map.command`
2. Or run:

```sh
./scripts/serve-local.sh
```

Then open `http://127.0.0.1:8123/index.html`.

## Build / deploy

The app is a static site.

- Source of truth: project root
- Deployment output: `docs/`
- GitHub Pages should publish from `docs/` on the default branch

To refresh the deployable output:

```sh
./scripts/build.sh
```

`build.sh` copies the app, local data bundle, and vendored Leaflet assets into `docs/`.
