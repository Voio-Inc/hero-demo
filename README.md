# Voio Hero Demo

A small Vite + React site for the Voio chest CT viewer demo.

The current build uses:
- chest CT WebP slices from `public/images`
- chest findings metadata from `data/segmed_chest_129659981449`
- Voio logo assets in `public/`

Raw DICOMs and chunk files are intentionally not tracked in git. The committed site is meant to stay runnable using the included WebP assets.

## Requirements

- Node.js 18+ recommended
- npm

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production build

```bash
npm run build
npm run preview
```

## Repo structure

```text
src/        React app code
public/     WebP slices and logo assets
data/       Study metadata and findings JSON
scripts/    Helper scripts
```

## Notes

- `public/images/` is the active chest CT image stack used by the demo.
- `public/images_spine_mr/` is an older image set kept in the repo but not used by the current UI.
- If you add raw medical imaging files locally, they are ignored by `.gitignore`.
