// calc.js — Pure calculation & formatting logic (no DOM dependencies).
// Loaded by index.html via <script>.
//
// This is a TRIMMED fork of NTEelie's app/data/calc.js, carrying only the
// functions Pink Paws Planner actually uses: number formatting, inventory
// clamping, and the server-reset / recurring-activity date math that the
// Fons Projector and Bond gifting plan depend on. Everything else in the
// original file (material/box/level-up cost math) is planner-only and was
// left behind on purpose.

function abbrevNum(n) {
  if (n < 1000) return String(n);
  const units = [{ v: 1e9, s: 'b' }, { v: 1e6, s: 'm' }, { v: 1e3, s: 'k' }];
  for (const u of units) {
    if (n >= u.v) {
      const scaled = n / u.v;
      let str = scaled >= 100 ? Math.round(scaled).toString() : scaled.toPrecision(3);
      if (parseFloat(str) >= 1000) {
        const bigger = units[units.indexOf(u) - 1];
        if (bigger) { let s2 = (n / bigger.v).toPrecision(3); if (s2.includes('.')) s2 = s2.replace(/\.?0+$/, ''); return s2 + bigger.s; }
      }
      if (str.includes('.')) str = str.replace(/\.?0+$/, '');
      return str + u.s;
    }
  }
  return String(n);
}

function clampInv(val) { const n = parseInt(val); return Number.isFinite(n) && n > 0 ? n : 0; }

// ── Server Reset + recurring activity windows (pure; browser + Node) ──────────
// Daily server reset is 09:00 UTC. A "service day" runs from one 09:00 UTC reset to
// the next, identified by an integer index (days since the Unix epoch, shifted back
// 9h) or by the UTC calendar date it opens on ('YYYY-MM-DD').
const SERVER_RESET_UTC_HOUR = 9;
const _MS_DAY = 86400000;
const _RESET_OFFSET = SERVER_RESET_UTC_HOUR * 3600000;

// Service-day index that the instant `now` (Date) falls in.
function serviceDayIndex(now) {
  return Math.floor((now.getTime() - _RESET_OFFSET) / _MS_DAY);
}
function _idxDate(index) { return new Date(index * _MS_DAY); } // 00:00 UTC of the service date
function serviceDateStr(index) { return _idxDate(index).toISOString().slice(0, 10); }
function dateStrToIndex(str) {
  const p = String(str).split('-').map(Number);
  return Math.floor(Date.UTC(p[0], p[1] - 1, p[2]) / _MS_DAY);
}
function resetInstant(index) { return index * _MS_DAY + _RESET_OFFSET; } // epoch-ms of the 09:00 UTC boundary opening `index`
function _daysInMonth(y, mo) { return new Date(Date.UTC(y, mo + 1, 0)).getUTCDate(); }

// Does service-day `index` carry an occurrence (window-open boundary) of `rec`?
//   rec.type 'days'    : { interval N>=1, anchor 'YYYY-MM-DD' }       every N days from anchor
//   rec.type 'weekly'  : { interval N>=1, weekdays [0..6], anchor }   selected UTC weekdays, every N weeks
//   rec.type 'monthly' : { interval N>=1, day 1..31, anchor }         day-of-month (clamped), every N months
function isOccurrence(rec, index) {
  const a = dateStrToIndex(rec.anchor); // anchor doubles as the start date
  if (index < a) return false;          // nothing is active before its start date
  if (index === a) return true;         // the start date is always the first window boundary
  const N = Math.max(1, rec.interval || 1);
  if (rec.type === 'days') {
    return (index - a) % N === 0;
  }
  if (rec.type === 'weekly') {
    const dow = _idxDate(index).getUTCDay();
    if (!rec.weekdays || rec.weekdays.indexOf(dow) === -1) return false;
    if (N === 1) return true;
    const wkA = a - _idxDate(a).getUTCDay(); // Sunday index of the start week
    const wkI = index - dow;
    return ((((wkI - wkA) / 7) % N) + N) % N === 0;
  }
  if (rec.type === 'monthly') {
    const d = _idxDate(index);
    const y = d.getUTCFullYear(), mo = d.getUTCMonth();
    const target = Math.min(rec.day, _daysInMonth(y, mo)); // clamp to month-end
    if (d.getUTCDate() !== target) return false;
    if (N === 1) return true;
    const ad = _idxDate(a);
    const months = (y - ad.getUTCFullYear()) * 12 + (mo - ad.getUTCMonth());
    return (((months % N) + N) % N) === 0;
  }
  return false;
}

// Resolve a fons-style { type:'patch' } sentinel into a concrete 'days' rec
// against the shared patch anchor/length; every other rec shape passes through
// unchanged. Pure (no global reads) so callers own where PATCH_ANCHOR /
// PATCH_LENGTH_DAYS actually live -- see fons.js.
function resolveRec(rec, patchAnchor, patchLengthDays) {
  if (rec && rec.type === 'patch') {
    return { type: 'days', interval: Math.max(1, patchLengthDays || 1), anchor: patchAnchor };
  }
  return rec;
}

function _recCap(rec) {
  const N = Math.max(1, rec.interval || 1);
  if (rec.type === 'monthly') return N * 31 + 40;
  if (rec.type === 'weekly') return N * 7 + 8;
  return N + 1;
}
function currentWindowStartIndex(rec, fromIndex) { // most recent occurrence <= fromIndex
  const cap = _recCap(rec);
  for (let i = 0; i <= cap; i++) { const idx = fromIndex - i; if (isOccurrence(rec, idx)) return idx; }
  return null;
}
function nextResetIndex(rec, fromIndex) { // next occurrence strictly after fromIndex
  const cap = _recCap(rec);
  for (let i = 1; i <= cap; i++) { const idx = fromIndex + i; if (isOccurrence(rec, idx)) return idx; }
  return null;
}

// ── Fons Projector counters, rebased onto the 09:00 UTC server reset ──────────
// Count server resets strictly after `now` through the target service-date (inclusive).
function fonsServiceSpan(now, targetDateStr) {
  return Math.max(0, dateStrToIndex(targetDateStr) - serviceDayIndex(now));
}
function _fonsEach(now, targetDateStr, pred) {
  const T0 = serviceDayIndex(now), Tg = dateStrToIndex(targetDateStr);
  let n = 0;
  for (let i = T0 + 1; i <= Tg; i++) if (pred(i)) n++;
  return n;
}
function fonsCountWeekday(now, targetDateStr, weekday) {
  return _fonsEach(now, targetDateStr, (i) => _idxDate(i).getUTCDay() === weekday);
}
function fonsCountMonthlyFirst(now, targetDateStr) {
  return _fonsEach(now, targetDateStr, (i) => _idxDate(i).getUTCDate() === 1);
}
function fonsCountBiweekly(now, targetDateStr, weekday, anchorDateStr) {
  const A = dateStrToIndex(anchorDateStr);
  return _fonsEach(now, targetDateStr, (i) => _idxDate(i).getUTCDay() === weekday && ((((i - A) % 14) + 14) % 14) === 0);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    abbrevNum, clampInv,
    SERVER_RESET_UTC_HOUR, serviceDayIndex, serviceDateStr, dateStrToIndex, resetInstant,
    isOccurrence, resolveRec, currentWindowStartIndex, nextResetIndex,
    fonsServiceSpan, fonsCountWeekday, fonsCountMonthlyFirst, fonsCountBiweekly,
  };
}
