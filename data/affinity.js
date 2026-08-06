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

// Bond EXP total (post the level's floor) a character has banked, at `level` with
// `expInLevel` progress into it. Used to compute the progress-bar percentage.
function bondCumAtLevel(level) {
  const L = Math.max(0, Math.min(level | 0, BOND_MAX_LEVEL));
  return BOND_CUM[L];
}
function bondCurrentCum(level, expInLevel) {
  const L = Math.max(0, Math.min(level | 0, BOND_MAX_LEVEL));
  const within = L < BOND_MAX_LEVEL ? Math.max(0, Math.min(expInLevel | 0, BOND_NEEDED[L])) : 0;
  return BOND_CUM[L] + within;
}
function bondLevelFromCum(cum) {
  let L = 0;
  for (let i = 0; i <= BOND_MAX_LEVEL; i++) { if (cum >= BOND_CUM[i]) L = i; else break; }
  return L;
}
// Manual "type an exact exp value" entry. Clamps within the current level; reaching/
// exceeding the level's requirement advances exactly ONE level to 0 exp (no cascade --
// that's what bondAdvance is for). At max level, exp always stays 0.
function bondApplyManualExp(level, typedExp) {
  let L = Math.max(0, Math.min(level | 0, BOND_MAX_LEVEL));
  const e = Math.max(0, typedExp | 0);
  if (L >= BOND_MAX_LEVEL) return { level: BOND_MAX_LEVEL, exp: 0 };
  if (e >= BOND_NEEDED[L]) return { level: L + 1, exp: 0 };
  return { level: L, exp: e };
}
// "Log a gift" / any exp award that should cascade through multiple levels if it's big
// enough (e.g. a +400 gift landing near a level boundary). Caps at max level (surplus
// exp beyond max is discarded, matching in-game behavior).
function bondAdvance(level, exp, addExp) {
  let L = Math.max(0, Math.min(level | 0, BOND_MAX_LEVEL));
  let e = Math.max(0, exp | 0) + Math.max(0, addExp | 0);
  while (L < BOND_MAX_LEVEL && e >= BOND_NEEDED[L]) { e -= BOND_NEEDED[L]; L++; }
  if (L >= BOND_MAX_LEVEL) e = 0;
  return { level: L, exp: e };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BOND_NEEDED, BOND_CUM, BOND_MAX_LEVEL, bondCumAtLevel, bondCurrentCum, bondLevelFromCum, bondApplyManualExp, bondAdvance };
}
