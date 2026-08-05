// ============================================================================
//  characters.js — Character name list (CHARACTER_DB).
// ----------------------------------------------------------------------------
//  Trimmed to just {id, name} -- this app only needs a character to label a
//  Bond gift row and to look up Bond Guide entries by id. No portraits, ranks,
//  elements, or level/talent/console data (that lives in the private planner).
//
//  id   -- must match the characterId used in bondGuide.js BOND_GUIDE_DB.
//  name -- display name shown in the Character dropdown and Bond Guide table.
// ============================================================================
const CHARACTER_DB = [
  { id: "adler", name: "Adler" },
  { id: "aurelia", name: "Aurelia" },
  { id: "baicang", name: "Baicang" },
  { id: "chaos", name: "Chaos" },
  { id: "chiz", name: "Chiz" },
  { id: "daffodill", name: "Daffodill" },
  { id: "edgar", name: "Edgar" },
  { id: "fadia", name: "Fadia" },
  { id: "haniel", name: "Haniel" },
  { id: "hathor", name: "Hathor" },
  { id: "hotori", name: "Hotori" },
  { id: "iroi", name: "Iroi" },
  { id: "jiuyuan", name: "Jiuyuan" },
  { id: "lacrimosa", name: "Lacrimosa" },
  { id: "mint", name: "Mint" },
  { id: "nanally", name: "Nanally" },
  { id: "sakiri", name: "Sakiri" },
  { id: "shinku", name: "Shinku" },
  { id: "skia", name: "Skia" },
  { id: "zero", name: "Zero" },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CHARACTER_DB };
}
