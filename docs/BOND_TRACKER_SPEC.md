# Bond Tracker — implementation spec

**Status:** not yet built. This is a spec for an implementing agent to follow — the app's
owner wants this built by an agent working directly in this repo, not hand-authored blind.

## 1. What this is

Pink Paws Planner currently has two pages: **Fons Management** (income/expense projector,
including "Bond Gifts" rows that track Fons cost/day) and **Bond Guide** (best gift item
per character, reference only). Neither tracks a character's actual **bond level/exp**.

This spec adds a third page, **Bond Tracker**, that does exactly that: for each character
you add, track their current bond level (0–10) and exp within that level, with a one-click
way to log a gift (+200 or +400 exp, cascading levels correctly) or type in an exact value.

## 2. Explicit constraints from the app owner — read before building

- **No character manager / roster page / character picker modal.** Adding a character to
  the tracker happens via a `<select>` dropdown directly in the table UI, exactly like the
  existing "Bond Gifts" rows in Fons Management already do (`fons-bondcad-sel` pattern,
  `index.html` around the `fonsAddBondRow`/bond-row-rendering code). Do not build a grid
  picker, overlay/modal, or any character-browsing UI. One `<select>` + one "Add" action.
- **Do not touch Fons Management's existing Bond Gift rows.** Those track Fons cost/day and
  are unrelated in data model (they're `kind:'bond'` entries in `fonsCustomRows`). Bond
  Tracker is a separate concept (level/exp) with its own state array. They may reference the
  same `CHARACTER_DB`/`BOND_GUIDE_DB` but must not be merged into one row type.
- **No dating mechanic, no per-character gift caps, no Zero's-gift-boost math, no
  auto/day-catchup automation.** All of that was deliberately removed from this app already
  (see git history: "Strip roster/bond-editor entirely..."). Do not reintroduce it. Keep
  this feature to: level, exp, a progress bar, and a manual "log a gift" button.
- **100-bond gifts are excluded app-wide** (already removed from the Fons Management tier
  dropdown as "horribly inefficient" — see that commit). Bond Tracker's "log a gift" action
  should only offer **+200** and **+400**, matching that decision.
- One row per character, max. Once a character is added, they disappear from the "add"
  dropdown until removed.

## 3. Data model

Add one new top-level state array, alongside the existing `inventory`/`fonsCustomRows`/etc.
declarations near the top of the `<script>` block (search for `let fonsCustomRows = []`):

```js
let bondTracker = []; // [{characterId, level, exp}] -- one entry per tracked character.
                       // level: 0-10 (BOND_MAX_LEVEL). exp: exp banked within `level`,
                       // 0 <= exp < BOND_NEEDED[level] (0 when level is maxed).
```

No `id` field needed — `characterId` is already unique per row (enforced by the add-dropdown
excluding already-added characters), so it doubles as the row key.

## 4. `data/affinity.js` — restore 4 pure functions

`data/affinity.js` currently only exports `BOND_NEEDED`, `BOND_CUM`, `BOND_MAX_LEVEL` (it was
trimmed when the old bond-projection engine was removed — see "Strip roster/bond-editor
entirely" in git history). Bond Tracker needs 4 small pure functions back. These are
unchanged from the original NTEelie source (`app/data/affinity.js` in the private planner
repo) — restore them verbatim, they don't carry any of the removed roster/dating/gift-cap
baggage:

```js
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
```

Add these after the existing `BOND_MAX_LEVEL` constant, before the `module.exports` block —
and add all 4 names to that `module.exports` object alongside the existing three.

Run `node --check data/affinity.js` after editing.

## 5. CSS additions

Add to the `<style>` block, near the other `.fons-bondcad-*` rules (Bond Cadence row styles)
since this feature shares that visual language:

```css
/* ── Bond Tracker ── */
.bond-tracker-tbl td { vertical-align: middle; }
.bond-tracker-bar { height: 10px; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; overflow: hidden; position: relative; margin-top: 6px; min-width: 120px; }
.bond-tracker-bar .have { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); transition: width .25s ease; }
.bond-tracker-bar-label { font-size: 12px; color: var(--muted); margin-top: 3px; }
.bond-tracker-gift-btn { background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; color: var(--accent); font-size: 13px; font-weight: 600; padding: 6px 12px; cursor: pointer; font-family: inherit; margin-right: 6px; }
.bond-tracker-gift-btn:hover { border-color: var(--accent); }
.bond-tracker-gift-btn:disabled { opacity: .4; cursor: not-allowed; border-color: var(--border); color: var(--muted); }
.bond-tracker-maxed { font-size: 12px; color: var(--success); font-weight: 600; }
.bond-tracker-add-row { display: flex; gap: 8px; align-items: center; margin-top: 12px; }
```

(`.fons-tbl`, `.fons-table-wrap`, `.fons-tbl-note`, `.fons-bondcad-sel`, `.fons-del-btn`,
`.fons-custom-add-btn` are all reused as-is from Fons Management's existing styles — don't
redefine them.)

## 6. HTML — new page + nav item

**Nav** (in `.sidebar-nav`, alongside the existing two `.nav-item` divs — insert between
Fons Management and Bond Guide, or after Bond Guide; owner has no preference):

```html
<div class="nav-item" data-page="bond-tracker" title="Bond Tracker"><svg viewBox="0 0 24 24"><path d="M12 20V10M18 20V4M6 20v-6"/></svg><span>Bond Tracker</span></div>
```

**Page** (in `.main`, alongside `#page-fons` and `#page-bond-guide`):

```html
<div class="page" id="page-bond-tracker">
  <div class="page-header">
    <div class="page-title">Bond Tracker</div>
    <div class="page-sub">Track each character's bond level and exp. Log a gift as you give it, or type in the exact number.</div>
  </div>
  <div class="fons-wide-wrap">
    <table class="fons-eff-tbl bond-tracker-tbl" id="bond-tracker-table">
      <thead><tr><th style="text-align:left">Character</th><th style="text-align:left">Level</th><th style="text-align:left">Progress</th><th style="text-align:left">Log Gift</th><th></th></tr></thead>
      <tbody id="bond-tracker-body"></tbody>
    </table>
  </div>
  <div class="bond-tracker-add-row">
    <select class="fons-bondcad-sel" id="bond-tracker-add-sel"></select>
    <button class="fons-custom-add-btn" onclick="bondTrackerAddRow()">+ Add character</button>
  </div>
</div>
```

## 7. JS — state, render, and wiring

Add near the other `render*` functions (e.g. after `renderBondGuide`):

```js
// ── Bond Tracker ───────────────────────────────────────────────────────────
function bondTrackerAvailableChars(){
  const used = new Set(bondTracker.map(r => r.characterId));
  return (typeof CHARACTER_DB !== 'undefined' ? CHARACTER_DB : []).filter(c => !used.has(c.id));
}
function bondTrackerAddRow(){
  const sel = document.getElementById('bond-tracker-add-sel');
  const characterId = sel && sel.value;
  if (!characterId || bondTracker.some(r => r.characterId === characterId)) return;
  bondTracker.push({ characterId, level: 0, exp: 0 });
  saveData(); renderBondTracker();
}
function bondTrackerRemove(characterId){
  bondTracker = bondTracker.filter(r => r.characterId !== characterId);
  saveData(); renderBondTracker();
}
function bondTrackerSetLevel(characterId, v){
  const row = bondTracker.find(r => r.characterId === characterId); if (!row) return;
  row.level = Math.max(0, Math.min(parseInt(v) || 0, BOND_MAX_LEVEL));
  row.exp = row.level < BOND_MAX_LEVEL ? Math.min(row.exp, BOND_NEEDED[row.level]) : 0;
  saveData(); renderBondTracker();
}
function bondTrackerSetExp(characterId, v){
  const row = bondTracker.find(r => r.characterId === characterId); if (!row) return;
  const r = bondApplyManualExp(row.level, parseInt(v) || 0);
  row.level = r.level; row.exp = r.exp;
  saveData(); renderBondTracker();
}
function bondTrackerLogGift(characterId, tier){
  const row = bondTracker.find(r => r.characterId === characterId); if (!row) return;
  if (row.level >= BOND_MAX_LEVEL) return;
  const r = bondAdvance(row.level, row.exp, tier);
  row.level = r.level; row.exp = r.exp;
  saveData(); renderBondTracker();
}
function renderBondTracker(){
  const body = document.getElementById('bond-tracker-body');
  const addSel = document.getElementById('bond-tracker-add-sel');
  if (!body || !addSel) return;

  const available = bondTrackerAvailableChars();
  addSel.innerHTML = available.length
    ? available.map(c => `<option value="${c.id}">${bgEsc(c.name)}</option>`).join('')
    : '<option value="">No characters left to add</option>';
  addSel.disabled = !available.length;

  if (!bondTracker.length) {
    body.innerHTML = `<tr><td colspan="5" class="fons-tbl-note" style="padding:20px 16px">No characters tracked yet — pick one below and add it.</td></tr>`;
    return;
  }

  const rows = bondTracker.slice().sort((a, b) => {
    const na = ((typeof CHARACTER_DB !== 'undefined' ? CHARACTER_DB : []).find(c => c.id === a.characterId) || {}).name || a.characterId;
    const nb = ((typeof CHARACTER_DB !== 'undefined' ? CHARACTER_DB : []).find(c => c.id === b.characterId) || {}).name || b.characterId;
    return na.localeCompare(nb);
  });

  body.innerHTML = rows.map(row => {
    const db = (typeof CHARACTER_DB !== 'undefined' ? CHARACTER_DB : []).find(c => c.id === row.characterId);
    const name = db ? db.name : row.characterId;
    const maxed = row.level >= BOND_MAX_LEVEL;
    const needed = maxed ? 0 : BOND_NEEDED[row.level];
    const pct = maxed ? 100 : Math.min(100, needed ? (row.exp / needed) * 100 : 0);
    let lvlOpts = '';
    for (let i = 0; i <= BOND_MAX_LEVEL; i++) lvlOpts += `<option value="${i}" ${row.level === i ? 'selected' : ''}>Lv ${i}</option>`;
    return `<tr data-bt-char="${row.characterId}">
      <td>${bgEsc(name)}</td>
      <td><select class="fons-bondcad-sel" data-bt-field="level" data-bt-char="${row.characterId}">${lvlOpts}</select></td>
      <td>
        <div class="bond-tracker-bar"><div class="have" style="width:${pct}%"></div></div>
        <div class="bond-tracker-bar-label">${maxed ? 'Maxed' : `<input class="fons-bondcad-num" style="width:64px" type="number" min="0" max="${needed}" value="${row.exp}" data-bt-field="exp" data-bt-char="${row.characterId}"> / ${needed}`}</div>
      </td>
      <td>
        <button class="bond-tracker-gift-btn" data-bt-gift="${row.characterId}" data-tier="200" ${maxed ? 'disabled' : ''}>+200</button>
        <button class="bond-tracker-gift-btn" data-bt-gift="${row.characterId}" data-tier="400" ${maxed ? 'disabled' : ''}>+400</button>
        ${maxed ? '<span class="bond-tracker-maxed">&#10003; Maxed</span>' : ''}
      </td>
      <td><button class="fons-del-btn" data-bt-del="${row.characterId}" title="Remove">&#10005;</button></td>
    </tr>`;
  }).join('');

  body.querySelectorAll('[data-bt-field="level"]').forEach(el => {
    el.addEventListener('change', () => bondTrackerSetLevel(el.dataset.btChar, el.value));
  });
  body.querySelectorAll('[data-bt-field="exp"]').forEach(el => {
    el.addEventListener('change', () => bondTrackerSetExp(el.dataset.btChar, el.value));
  });
  body.querySelectorAll('[data-bt-gift]').forEach(el => {
    el.addEventListener('click', () => bondTrackerLogGift(el.dataset.btGift, parseInt(el.dataset.tier)));
  });
  body.querySelectorAll('[data-bt-del]').forEach(el => {
    el.addEventListener('click', () => bondTrackerRemove(el.dataset.btDel));
  });
}
```

## 8. Wire it into the app's existing plumbing

- **`switchPage`** (search for `function switchPage(page){`): add a branch —
  `if(page==='bond-tracker')renderBondTracker();` alongside the existing `fons`/`bond-guide` branches.
- **`getSaveData`** (search for `function getSaveData(){`): add `bondTracker` to the returned
  object: `return {inventory,fonsTargetDate,fonsDisabled,fonsMode,fonsTargetGoal,fonsCustomRows,fonsOrder,bondTracker};`
- **`applySaveData`** (search for `function applySaveData(d){`): add
  `bondTracker=Array.isArray(d.bondTracker)?d.bondTracker:[];`
- **Init** (the `DOMContentLoaded` handler, near the other `render*()` calls at the bottom):
  add `renderBondTracker();` alongside `renderFons(); renderBondGuide();`.
- Consider bumping `SAVE_KEY` from `'pink-paws-planner-v2'` to `'pink-paws-planner-v3'` —
  this project's convention has been to bump the key on every save-shape change (see git
  history). Not strictly required since `applySaveData` defaults missing fields defensively,
  but keep it consistent with prior practice unless there's a reason not to.

## 9. Explicitly out of scope (do not build)

- Any character picker grid/modal/overlay.
- Bond level tracking tied back into Fons Management's cost projections (e.g. auto-computing
  "days to level 10 at your current gifting rate" from the Bond Gift rows' gifts/day). This
  would be a reasonable **future** enhancement but requires deciding how a Bond Tracker row
  and a Fons Management Bond Gift row for the same character relate when only one of the two
  exists — out of scope until specifically requested.
- Dating, gift caps, Zero's gift-affinity boost, auto-consume/auto-deduct day-catchup — all
  previously removed, do not reintroduce.
- 100-bond gifts.

## 10. Acceptance checklist

- [ ] `node --check data/affinity.js` passes after adding the 4 functions.
- [ ] New "Bond Tracker" nav item switches pages and calls `renderBondTracker()`.
- [ ] Add-dropdown lists only characters not already tracked; empty state when all are added.
- [ ] Adding a character creates a Lv 0 / 0 exp row; duplicate-add is a no-op.
- [ ] Changing the Level select updates the row and clamps exp to the new level's cap.
- [ ] Typing an exp value that meets/exceeds the level's requirement advances exactly one
      level to 0 exp (via `bondApplyManualExp`) — does not cascade multiple levels.
- [ ] Clicking +200/+400 cascades through multiple level-ups correctly if the amount is
      large enough relative to remaining exp (via `bondAdvance`) — test near a level boundary.
- [ ] Reaching level 10 disables both gift buttons, shows a "Maxed" state, and hides the exp
      input (progress bar shows 100%).
- [ ] Removing a row returns that character to the add-dropdown.
- [ ] Export/Import round-trips `bondTracker` correctly.
- [ ] Reloading the page (localStorage) restores all tracked characters at their saved
      level/exp.
- [ ] No console errors; verify with a quick headless-browser pass (Playwright is available
      in this environment) rather than manual-only testing.
