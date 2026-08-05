// ============================================================================
//  fons.js -- Fons Projector income sources & recurring expenses
// ----------------------------------------------------------------------------
//  This file is the single source of truth for all guaranteed recurring Fons
//  income AND recurring Fons expenses. index.html's renderFons() reads from
//  FONS_SOURCES to build the projector table and calculate totals.
//
//  HOW TO ADD / EDIT A SOURCE
//
//  Each entry: { id, name, fpr, rec }
//
//  - id   -- REQUIRED, unique, STABLE FOREVER. Save-data key for the disabled
//           toggle (fonsDisabled). Use kebab-case. Renaming orphans saved state.
//
//  - name -- REQUIRED display name shown in the table. Keep PLAIN ASCII: escape
//           any non-ASCII as \uXXXX (e.g. 'Caf\u00e9') so the file stays
//           connector-safe. NOTE: fons.js carries no non-ASCII characters of
//           its own, so unlike index.html and CHANGELOG.md it CAN be
//           connector-committed.
//
//  - fpr  -- REQUIRED Fons per run (integer).
//           POSITIVE = income, NEGATIVE = expense (e.g. a buy-out cost).
//           The projector multiplies this by the number of times the source
//           fires before the target date (or the goal date in Target Fons mode).
//           Only include sources with a confirmed non-zero fpr.
//           Sources with fpr:0 are hidden from the table.
//
//  - rec  -- REQUIRED recurrence. Same three shapes used in activities.js
//           (the window logic lives in calc.js; server reset is 09:00 UTC),
//           plus a fourth 'patch' shape that's fons-specific:
//
//        { type:'days',    interval:N,                 anchor:'YYYY-MM-DD' }
//            fires every N days. interval:1 = daily.
//
//        { type:'weekly',  interval:N, weekdays:[...], anchor:'YYYY-MM-DD' }
//            fires on the listed weekday indices every N weeks.
//            0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat.
//            interval:2 = biweekly; anchor's week = first active week.
//
//        { type:'monthly', interval:N, day:D,          anchor:'YYYY-MM-DD' }
//            fires on day-of-month D every N months.
//
//        { type:'patch' }
//            fires on the shared patch cadence (PATCH_ANCHOR / PATCH_LENGTH_DAYS,
//            defined below). No interval/anchor of its own -- index.html resolves
//            this via calc.js's resolveRec() before evaluating it, so every
//            'patch' entry (and any user-added custom item set to "Patch Start")
//            automatically follows the same date whenever PATCH_ANCHOR or
//            PATCH_LENGTH_DAYS is edited, instead of needing its own anchor kept
//            in sync by hand.
//
//  - anchor -- REQUIRED for days/weekly/monthly. The first occurrence date (and
//           thereafter the cadence phases off it). For a FUTURE-only recurring
//           event whose next reset is known, set anchor to that next reset
//           date. Reference weekdays: 2026-06-01 and 06-08 are Mondays;
//           2026-06-03 is Wednesday. (Not used by 'patch' -- see PATCH_ANCHOR.)
//
//  After editing: run `node --check app/data/fons.js`.
// ============================================================================

const FONS_SOURCES = [

  {
    id:   'dailies',
    name: 'Daily Activities',
    fpr:  20000,
    rec:  {'type': 'days', 'interval': 1, 'anchor': '2026-06-01'},
  },
  {
    id:   'cafe',
    name: 'Café',
    fpr:  65000,
    rec:  {'type': 'days', 'interval': 1, 'anchor': '2026-06-01'},
  },
  {
    id:   'riftcrystal-permit',
    name: 'Riftcrystal Permit',
    fpr:  30000,
    rec:  {'type': 'days', 'interval': 1, 'anchor': '2026-06-01'},
  },
  {
    id:   'city-stamina',
    name: 'City Stamina',
    fpr:  700000,
    rec:  {'type': 'weekly', 'interval': 1, 'weekdays': [1], 'anchor': '2026-06-08'},
  },
  {
    id:   'mammon',
    name: 'Mammon',
    fpr:  75000,
    rec:  {'type': 'weekly', 'interval': 1, 'weekdays': [1], 'anchor': '2026-06-08'},
  },
  {
    id:   'city-delivery',
    name: 'City Delivery',
    fpr:  32000,
    rec:  {'type': 'weekly', 'interval': 1, 'weekdays': [1], 'anchor': '2026-06-08'},
  },
  {
    id:   'respawning-vaults',
    name: 'Respawning Vaults',
    fpr:  15000,
    rec:  {'type': 'weekly', 'interval': 1, 'weekdays': [1], 'anchor': '2026-06-08'},
  },
  {
    id:   'heist',
    name: 'Heist',
    fpr:  1000000,
    rec:  {'type': 'weekly', 'interval': 2, 'weekdays': [1], 'anchor': '2026-06-08'},
  },
  {
    id:   'ghost-train',
    name: 'Ghost Train',
    fpr:  200000,
    rec:  {'type': 'weekly', 'interval': 2, 'weekdays': [3], 'anchor': '2026-06-17'},
  },
  {
    id:   'ghost-train-shop',
    name: 'Ghost Train Shop',
    fpr:  180000,
    rec:  {'type': 'monthly', 'interval': 1, 'day': 1, 'anchor': '2026-06-01'},
  },
  {
    id:   'lost-exchange',
    name: 'Lost Exchange',
    fpr:  200000,
    rec:  {'type': 'monthly', 'interval': 1, 'day': 1, 'anchor': '2026-06-01'},
  },
  {
    id:   'buyout-hunter-items',
    name: 'Buy Out Hunter Exchange Items',
    fpr:  -2110000,
    rec:  {'type': 'patch'},
  },
  {
    id:   'buyout-hunter-pulls',
    name: 'Buy Out Hunter Exchange Pulls',
    fpr:  -2487000,
    rec:  {'type': 'patch'},
  }

];

// ── Patch cycle ─────────────────────────────────────────────────────────────
// Single source of truth for "start of patch" timing, consumed by any
// FONS_SOURCES entry (or user-added custom Fons Manager item) using
// { type:'patch' } instead of its own days/weekly/monthly recurrence.
// Edit both here, or via the data editor's "Patch Day Settings" panel.
//   PATCH_ANCHOR      -- 'YYYY-MM-DD' of a known patch start date.
//   PATCH_LENGTH_DAYS -- days between patches (currently a 6-week cycle).
const PATCH_ANCHOR = '2026-07-07';
const PATCH_LENGTH_DAYS = 42;

// CommonJS export for the test runner. Skipped in the browser (no `module`).
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FONS_SOURCES, PATCH_ANCHOR, PATCH_LENGTH_DAYS };
}
