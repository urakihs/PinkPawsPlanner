# Pink Paws Planner

A local, single-page web app for tracking **Fons income** and **Bond (Affinity) progress** in **NTE: Neverness to Everness**.

## Quick start

1. Download or clone this repo.
2. Open `index.html` in any modern browser.
3. No installation, no build step, no server, no internet connection required.

Your data saves automatically to your browser's local storage. Use **Export** to back it up or move it to another browser.

---

## What it does

- **Characters** — a lightweight bond roster. Add any character, click their card to open the Bond editor: current level/exp, gift items (Fons cost, bond value, owned count), gifts-per-day, the daily "date" bonus, and a live projection of days/Fons needed to reach bond level 10. Toggling a character out of the roster excludes them from the Fons calculation below without losing their saved plan.
- **Fons Management** — projects your Fons income and expenses from now until a target date or a target Fons balance, combining every recurring source (dailies, weeklies, monthly resets, patch-cycle buyouts) with your active bond-gifting plan. Rows are drag-to-reorder and toggle on/off; add your own custom income/expense rows on any cadence.
- **Bond Guide** — a reference table of the cheapest 200-bond and 400-bond gift item per character, with cost and shop location.

## Bond mechanics (for context)

Bond is a 10-level meter per character. Each level requires a fixed amount of bond exp to clear (see `data/affinity.js`); gifts spend Fons and grant a fixed bond amount (typically 100/200/400 depending on the item). This app doesn't track *how* you spend Fons on anything else — it only projects the Fons income side and the bond-gifting expense side, so you can see whether your current farm rate covers your gifting plan by a given date.

## Relationship to NTEelie

This app is a standalone fork of the Fons/Bond tracker originally built inside [NTEelie](https://github.com/urakihs/nteelie), a private level-up planner for the same game. The character roster here is intentionally lightweight — just identity (name/portrait) and bond state, with none of the level/talent/arc-leveling material-cost system from the full planner.

## Data & saving

- All data (roster, bond plans, Fons settings) auto-saves to `localStorage` under the key `pink-paws-planner-v1`.
- **Export** downloads your save as a dated JSON file.
- **Import** replaces your current save with a previously exported file.

## Data status

`data/characters.js` is currently a full unfiltered carry-over from the source planner (it includes level/talent/console fields this app never reads) — safe but somewhat bloated; a future pass could trim it to just `{id, name, rank, element}`. Gift item pricing (`data/shopItems.js`) and the Bond Guide picks (`data/bondGuide.js`) are still being filled in for some characters — see the source repo's data-tracking notes for what's confirmed vs. pending.
