// ============================================================================
//  affinity.js — Bond EXP ladder constants.
// ----------------------------------------------------------------------------
//  Trimmed to just the ladder this app actually uses: Bond Guide's "Total Fons
//  to max" column (bgTotalFons() in index.html, via BOND_CUM[BOND_MAX_LEVEL]).
//  The full bond-state projection engine (level/exp tracking, dating, gift
//  caps, Zero's gift-affinity boost) lived here in the original planner but
//  isn't needed once bond gifting is just a flat Fons/day line in the Fons
//  Management table instead of a tracked-to-completion plan per character.
//
//  The bond EXP ladder is ROSTER-INDEPENDENT: every character levels 0..10 on
//  the same curve (see docs/AFFINITY_BOND_DATA.md in the source planner for
//  how these were confirmed in-game). Do not hand-edit BOND_CUM -- it's
//  derived from BOND_NEEDED.
// ============================================================================

// Bond EXP required to advance FROM each level (index = from-level, 0..9).
const BOND_NEEDED = [100, 500, 1000, 2000, 3500, 5000, 7000, 9000, 12000, 16000];

// Cumulative bond EXP banked AT each level (0..10). Derived from BOND_NEEDED.
const BOND_CUM = (function () {
  const cum = [0];
  for (let i = 0; i < BOND_NEEDED.length; i++) cum.push(cum[cum.length - 1] + BOND_NEEDED[i]);
  return cum; // length 11: BOND_CUM[10] === 56100
})();

const BOND_MAX_LEVEL = 10; // bond levels run 0..10

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BOND_NEEDED, BOND_CUM, BOND_MAX_LEVEL };
}
