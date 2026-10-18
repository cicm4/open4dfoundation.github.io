# Open4D Website

Static website for [Open4D](https://github.com/open4dfoundation/Open4D) — an open platform for
time-varying 4D geometry data.

## Structure

```
├── index.html           # Home — hero, news, features, modules preview, quickstart, citation
├── modules.html         # Research modules (N4MC, TSMC, TVMC, Unity decoder, ARAP, editing)
├── documentation.html   # Existing docs plus sequence API, Gaussians, transport, runtimes, data
├── gallery.html         # Sample figures and diagrams
├── benchmarks.html      # Existing methodology plus measured RD and live transport results
├── about.html           # Mission, team, roadmap, contributing, citation
├── css/style.css        # Shared design system
├── js/main.js           # Accessible navigation, clipboard feedback, sidebar scrollspy
├── js/benchmarks.js     # Interactive measured rate–distortion plot and table
└── assets/              # Figures (ecosystem PNG from the repo + custom SVGs)
```

## Local preview

Any static server works:

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

## Deploying

The existing public site is https://open4dfoundation.github.io/. Its current
deployment serves `main` from this repository's root. Update this repository
through a reviewed pull request; no new Pages site, domain, or hosting project
is needed. The site remains plain HTML/CSS/JS without a build step.

## Notes

- The six original routes, figures, module descriptions, team details, and citation
  remain. Gallery charts are still labelled *illustrative*. The separate interactive
  benchmark uses actual measurements in `assets/validation/mesh-rd-2026-10-18.json`.
- The benchmark JSON contains aggregate measurements and artifact hashes, without
  captured geometry. It distinguishes full 300-frame baseline runs from learned
  experiments and online transport; metric definitions appear beside the results.
- New source-preview commands target `pr/october-proposal-plugins` (Open4D PR #63).
  Package publication and captured-data redistribution remain subject to the ledger.
- The native Qt wave recording is generated from `open4d.demo.mesh_sequence`:
  24-by-24 grid, 30 frames, 15 fps, +Z up. Its MIT license is in `assets/media`.
  Fonts are self-hosted with their license notices. Synthetic sample archives in
  `assets/samples` match the catalog SHA-256 values and include their own licenses.
- Earlier news entries retain the original site's placeholder planning dates;
  the October validation entry describes source-preview work, not a package release.
