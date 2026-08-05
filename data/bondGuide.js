// ============================================================================
//  bondGuide.js — Bond Guide reference table (BOND_GUIDE_DB).
// ----------------------------------------------------------------------------
//  A player-maintained reference: for each character, the best 200-bond and
//  400-bond gift item. Edited via the data-editor tool's "Bond Guide" tab (or
//  by hand here). Displayed in-app under Appendix -> Bond Guide, and used to
//  seed the character modal's Bond tab.
//
//  Each entry: { characterId, item200Id, item400Id }
//   • characterId       — REQUIRED, must match an id in characters.js
//                          CHARACTER_DB. One entry per character (no dupes).
//   • item200Id/item400Id — id of the gift item (granting 200/400 bond
//                          respectively) in shopItems.js SHOP_ITEM_DB. Name,
//                          Fons cost, and location are looked up from there
//                          at render/seed time -- NOT duplicated here. Leave
//                          blank/undefined while unresearched.
//
//  SELECTION POLICY: pick the CHEAPEST eligible item at each tier (a
//  character can have several items that grant them 200 or 400 bond --
//  cross-check DT_LikeabilityGiftData.json's DefaultLikeabilityValue /
//  SpeicalGiftDatas, see docs/NTE_DATA_EXTRACTION.md). When adding a new
//  character's entry, don't just record the first confirmed item you find --
//  compare it against the full eligible list and confirm it's actually the
//  lowest costPerUnit at that tier. Ties (same price, different item) don't
//  need to be swapped, just keep whichever's already recorded.
//
//  There is NO stored "total Fons" field. The total Fons cost to take a
//  character's bond from 0 to max (56,100 exp -- BOND_CUM[BOND_MAX_LEVEL] in
//  affinity.js) using ONLY that item is always CALCULATED, never stored:
//    totalFons = ceil(56100 / tierBond) * costPerUnit
//  (the gift COUNT is rounded up first, since you can't buy a fractional
//  item, then multiplied by cost-per-unit) where tierBond is 200 or 400
//  (fixed by which slot the item is in) and costPerUnit comes from the
//  SHOP_ITEM_DB lookup. Both the app's Bond Guide page and the data-editor's
//  Bond Guide tab compute this the same way at display time -- see
//  renderBondGuide() in index.html.
//
//  This file has NO module.exports (loaded via <script>, like characters.js /
//  weapons.js) -- the data-editor tool's generic single-array save path
//  (writeJsFile) overwrites the whole file with the header + this one const,
//  so anything after the array (like a module.exports block) would be
//  silently dropped on every save. Leave it that way.
//
//  After editing: run `node --check app/data/bondGuide.js`.
// ============================================================================
const BOND_GUIDE_DB = [
  { characterId: "adler",     item200Id: "golden-dawn",           item400Id: "promise" },
  { characterId: "aurelia",   item200Id: "fantasia",              item400Id: "promise" },
  { characterId: "baicang",   item200Id: "refulgent-agreement",   item400Id: "gigafluff-the-strong" },
  // Chaos: item200 was "Sin, Vice, Crime" (6,000/unit) -- Glimmering Ice
  // (5,400/unit, also a valid 200-value item for Chaos per the datamine) is
  // cheaper. Selection-policy correction, not a wrong-item bug.
  { characterId: "chaos",     item200Id: "glimmering-ice",        item400Id: "kokoro-rider-l1-metal-strategist" },
  { characterId: "chiz",      item200Id: "fantasia",              item400Id: "bunny-box" },
  { characterId: "daffodill", item200Id: "eternal-purity",        item400Id: "promise" },
  { characterId: "edgar",     item200Id: "bosss-approval",        item400Id: "bear-o-metry" },
  { characterId: "fadia",     item200Id: "golden-spring",         item400Id: "glimmering-ice" },
  { characterId: "haniel",    item200Id: "fantasia",              item400Id: "asahi-inori-crimson" },
  { characterId: "hathor",    item200Id: "fever-dream",           item400Id: "on-track" },
  { characterId: "hotori",    item200Id: "yellow-glaze-vase",     item400Id: "golden-moon" },
  { characterId: "iroi",      item200Id: "refulgent-agreement",   item400Id: "bear-o-metry" },
  { characterId: "jiuyuan",   item200Id: "moon-vase",             item400Id: "on-track" },
  { characterId: "lacrimosa", item200Id: "chill-out",             item400Id: "bunny-box" },
  { characterId: "mint",      item200Id: "waltz",                 item400Id: "asahi-inori-crimson" },
  // Nanally: 200/400 items were swapped in an earlier hand-entry (Kokoro Rider
  // L1 recorded as her 200-item, Blazing Crimson as her 400-item) -- corrected
  // against the Waifus-Grace/NTE_Assets datamine (DT_LikeabilityGiftData.json):
  // Blazing Crimson is her 200-value item, Kokoro Rider L1 - Metal Strategist
  // is her 400-value item.
  { characterId: "nanally",   item200Id: "blazing-crimson",       item400Id: "kokoro-rider-l1-metal-strategist" },
  { characterId: "sakiri",    item200Id: "fever-dream",           item400Id: "bunny-box" },
  // Shinku: item200 was "Golden Spring" (7,500/unit) -- Glimmering Ice
  // (5,400/unit, also a valid 200-value item for Shinku per the datamine) is
  // cheaper. Selection-policy correction, not a wrong-item bug.
  { characterId: "shinku",    item200Id: "glimmering-ice",        item400Id: "gigafluff-the-strong" },
  { characterId: "skia",      item200Id: "chill-out",             item400Id: "white-jade-lamp" },
];
