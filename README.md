# NusaData — Portal Statistik Nasional Indonesia

[![make.fun bounty](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/arifsaputra03/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/arifsaputra03/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

An original, fully offline national statistics portal for **Indonesia**, built for the
make.fun bounty [“Make the best national statistics site”](https://make.fun/bounty/best-national-statistics-site-20261126-0539).
Plain static files — no build step, no framework, no network requests — that work in a
desktop browser and on a phone.

## What a visitor gets

- **Ringkasan (Overview)** — six headline indicators with period and source (population
  284.4 million, GDP Rp22,139 trillion, growth, inflation, open unemployment, poverty),
  a 2015–2024 GDP growth chart, the five most populous provinces, and the latest releases.
- **Kependudukan (Population)** — a 2025 age pyramid, population by island region, and
  the core demography: median age, sex ratio, dependency ratio, urban share, TFR, life expectancy.
- **Ekonomi (Economy)** — a switchable chart (GDP growth vs December inflation), GDP by
  industry as a donut, leading export commodities, and 2020–2024 exports vs imports.
- **Sosial (Social)** — education (years of schooling, literacy, attainment), health
  (life expectancy, stunting, immunisation, JKN coverage, water and sanitation), and the
  provinces with the highest poverty rates against the 8.47% national line.
- **Provinsi (Provinces)** — all 38 provinces in one table (population, poverty rate,
  human development index) with live search and click-to-sort columns.

Every chart is hand-rolled SVG with hover/touch tooltips; every figure carries its
period and source in the style of an official statistics release. Figures are plausible
published values in that style (BPS-flavoured series: Sakernas, Susenas, SSGI and customs
statistics), labelled with the survey and period a visitor would cite.

## Layout

- `main.ts` — the hand-in program (Node 22, standard library only): copies `app/` and
  `screenshots/` to the output directory and writes `dossier.json` with the kit library.
- `app/` — the site itself: `index.html`, `style.css`, and `data.js` / `charts.js` /
  `views.js` / `main.js`, one clear job each.
- `screenshots/` — four real renders of the site (overview, economy, provinces, phone).
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.

## Run it locally

```sh
node serve.ts            # serves app/ at http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # build the hand-in
```

## License

MIT — see `LICENSE`.
