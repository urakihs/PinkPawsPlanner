# Pink Paws Planner

A local, single-page web app for tracking **Fons income and spend** in **NTE: Neverness to Everness**.

## Quick start

1. Download or clone this repo.
2. Open `index.html` in any modern browser.
3. No installation, no build step, no server, no internet connection required.

Your data saves automatically to your browser's local storage. Use **Export** to back it up or move it to another browser.

---

## What it does

- **Fons Management** — projects your Fons income and expenses from now until a target date or a target Fons balance, combining every recurring source (dailies, weeklies, monthly resets, patch-cycle buyouts) with whatever you're spending on gifts. Rows are drag-to-reorder and toggle on/off.
  - **Bond gift rows** — pick a **Character** and a **Bond amount** (200/400 — 100-bond items are excluded, they're a much worse Fons-per-bond rate), set **gifts/day**, and the row auto-fills the gift item's name and shop location from the Bond Guide data, then folds `gifts/day × Fons per gift` into your daily Fons burn. That's the only thing this app tracks about bond gifting — not level, not exp, just the cost.
  - **Custom rows** — add any other one-off or recurring income/expense on your own cadence.
- **Bond Guide** — a reference table of the cheapest 200-bond and 400-bond gift item per character, with cost and shop location.

## Bond mechanics (for context)

Bond is a 10-level meter per character, raised by giving gifts that cost Fons and grant a fixed bond amount. This app only deals in 200-bond and 400-bond gifts — 100-bond items are a worse Fons-per-bond rate and aren't worth using. It doesn't track level or exp progress toward that meter at all — it only cares about the Fons side: what your gifting plan costs per day, so you can see whether your farm rate covers it.

## Relationship to NTEelie

This app is a standalone fork of the Fons tracker originally built inside [NTEelie](https://github.com/urakihs/nteelie), a private level-up planner for the same game. It intentionally carries none of the planner's character roster, level/talent/arc-leveling system, or bond-progression tracking — just Fons Management and Bond Guide.

## Data & saving

- All data (Fons balance, target, and rows) auto-saves to `localStorage` under the key `pink-paws-planner-v2`.
- **Export** downloads your save as a dated JSON file.
- **Import** replaces your current save with a previously exported file.

## Data status

- `data/characters.js` is trimmed to just `{id, name}` — enough to label a bond gift row and look up Bond Guide entries.
- `data/affinity.js` is trimmed to just the bond EXP ladder constants (`BOND_NEEDED`/`BOND_CUM`/`BOND_MAX_LEVEL`), used only for Bond Guide's "Total Fons to max" column.
- `data/bondGuide.js` records the cheapest **200-bond and 400-bond** item per character — those are the only two tiers this app supports (100-bond gifts are intentionally left out as a bad rate).
