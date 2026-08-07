# Content Editing Guide

Adding new bond-gift catalog content is a **data-only** change — none of it
requires touching `index.html`. The app reads `data/characters.js`,
`data/shopItems.js`, and `data/bondGuide.js` dynamically at load time, so a
character or item just needs to exist in the right file(s) to show up.

The two edits covered here are the only additions expected going forward:
a new default (shop) item, and a new character with two default bond items.

## 1. Add a new default (shop) item

Edit `data/shopItems.js`, add one line to `SHOP_ITEM_DB`, alphabetized by
`id`:

```js
{ id: "your-item-id", name: "Your Item Name", costPerUnit: 1234, location: "Shop Name - District" },
```

- `id` — kebab-case, unique, stable. Other files (`bondGuide.js`) reference
  items by this id, so don't rename it later without updating every
  reference.
- `costPerUnit` — Fons cost to buy one unit.
- `location` — where to buy it (`"Shop Name - District"`, or just the shop
  name if the district isn't confirmed yet).

That's it for a standalone catalog item. If it's meant to be a character's
default 200- or 400-bond gift, wire it into `bondGuide.js` too — see step 2.

Validate with:

```
node --check data/shopItems.js
```

## 2. Add a new character with 2 default bond items

Three edits, in order:

**a) `data/characters.js`** — add the character (alphabetized):

```js
{ id: "newchar", name: "New Char" },
```

**b) `data/shopItems.js`** — add their two gift items if they don't already
exist in the catalog (same pattern as step 1). Reuse an existing item's
`id` if another character already gifts the same thing — items are a
shared catalog, not per-character.

**c) `data/bondGuide.js`** — add one line to `BOND_GUIDE_DB` linking the
character to their 200-bond and 400-bond items:

```js
{ characterId: "newchar", item200Id: "cheaper-item-id", item400Id: "pricier-item-id" },
```

Per the file's own selection-policy comment: `item200Id` should be the
*cheapest* item that grants 200 bond, `item400Id` the cheapest that grants
400 — not just the first one you find.

Once `characters.js` has the entry and `bondGuide.js` has both
`item200Id`/`item400Id` filled in, the character automatically appears in
Bond Management's "+ Add character" dropdown with both items available as
picks in the gift-item editor. No further wiring needed.

Validate with:

```
node --check data/characters.js && node --check data/bondGuide.js
```

## Reminder: Bond Management never auto-spends Fons

Worth keeping in mind when planning new content: at each server reset,
Bond Management's catch-up simulation only ever ticks down **owned item
stock**. Once an item's stock hits 0, that item simply stops advancing
bond until the player manually restocks it (buys more, bumps the Owned
count in the edit modal) — it never automatically deducts Fons to keep
going. The Est. Fons Remaining / Est. Time Remaining columns are a
planning estimate of what buying enough stock would cost, not something
that executes on its own.
