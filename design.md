# Design reference: new.computer / Dot

Style reference pulled from two live/archived pages, inspected directly (computed styles, not guessed):
- [new.computer/dot](https://new.computer/dot) — current landing page
- [new.computer/jason](https://web.archive.org/web/20250113120228/https://new.computer/jason) — "One Year with Dot: Jason's Story", via Wayback Machine (the live page has since changed/gone)

Short answer to "can you use their styles": **yes for the type pairing and layout language, adapted rather than copied — no for the exact typefaces or the gradient asset itself**, both of which are the studio's own licensed/original property. Details below.

## What's actually there (verified, not guessed)

Inspected via `getComputedStyle()` on the live/archived DOM:

| Role | What Dot uses | Notes |
|---|---|---|
| Display / headlines | **Tiempos Text**, weight 400, tight tracking (-1px at 36px) | A Klim Type Foundry serif — commercially licensed, self-hosted by them (`next/font/local`, not Google Fonts). This is what read as "a slab font" — it's not technically a slab serif, but it has noticeably heavier, blockier serifs than a classic text face like Garamond, which is an easy thing to mis-recall as "slab." |
| Body / UI / buttons | **Die Grotesk A**, weight 400–500 | Also commercially licensed and self-hosted, not free. A clean, restrained neo-grotesque — no personality quirks, just gets out of the way. |
| Color | Pure black text at varying opacity (100% headings, 76% essay body, 44% muted labels) on pure white | Same "hierarchy via opacity, not a gray-scale token" approach niia.design's own design.md already uses — not a coincidence, it's a common minimal-editorial pattern. |
| Primary button | `rgba(39, 13, 13, 0.88)` background (a near-black warm maroon), white text, fully pill-rounded (43px radius), 500 weight | |
| The "moving gradient" | A **video** (`landing.mp4`, poster `landing.png`), not a live CSS gradient or canvas | Confirmed by DOM inspection — zero `<canvas>`, zero gradient-bearing elements, one `<video>`. Sampled pixel colors from the poster directly: pale pink/white (`#ffeef0`) near the top of the wash, deepening to a dusty rose (`#f6cbc8`) at the bottom edge, sitting behind the chat compose bar. |
| Layout | Extremely minimal: one flat white canvas, generous whitespace, a small muted "Announcement." eyebrow line, no cards/borders anywhere | |

## What Taski adopted

**Typography pairing (adapted, not copied).** Tiempos Text and Die Grotesk A are both commercially licensed, self-hosted webfonts — not available for free use the way niia.design already flagged for ABC Diatype. Rather than license them, Taski uses free Google-Fonts equivalents that carry the same *role split* (a literary serif for the handful of real headline moments, a clean neutral grotesk for everything else):

- Display: **Source Serif 4** — `--font-serif`
- Body / UI: **Public Sans** — `--font-sans` (replaces the earlier `ui-rounded` system-font choice)

Applied narrowly, the way Dot itself uses Tiempos — only at real headline moments, not on every label: the "Taski" wordmark in the top bar, the Intro screen's title, and "How Taski works." Task text, buttons, and every other UI string stay in the sans — a serif on an editable task row would fight the inline-rename interaction.

**The moving gradient (homage, not the asset).** Their `landing.mp4` is their own file — not something to embed. Instead, `.intro-gradient` in `globals.css` is an original CSS `linear-gradient` animation using the same sampled color family (pale pink → dusty rose → cream), panning slowly over ~22s.

Scoped deliberately to the **Intro screen only**, not the working screens (Today/Calendar). That's not a licensing dodge, it's [RESEARCH.md](RESEARCH.md) §4 talking: ambient motion is fine for a once-per-install welcome moment, actively harmful on a screen someone needs to stay focused on. Respects `prefers-reduced-motion` (animation disabled, gradient still renders as a static wash).

## What Taski deliberately did *not* adopt

**The color system.** Dot's pure-white/near-black canvas is correct for a marketing site but isn't what's behind Taski's own palette choice — the warm cream "Paper" background, the muted sage accent, and the Clay/Sky/Dusk theme options are independently grounded in the ADHD research in `RESEARCH.md` (§1–2: soft/muted over stark, no red, and heterogeneity is the actual argument for offering theme choice at all). Adopting Dot's fonts doesn't mean adopting their palette — those were solving a different problem (a landing page selling a product) than this one (a task list someone has to look at for hours).

## Reference

Font-pairing precedent: [new.computer/dot](https://new.computer/dot), [new.computer/jason (archived)](https://web.archive.org/web/20250113120228/https://new.computer/jason). Color and layout precedent: `RESEARCH.md` in this repo.
