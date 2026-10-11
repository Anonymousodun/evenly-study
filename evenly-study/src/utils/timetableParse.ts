import { ScheduleKind } from '../types';

// Turns OCR lines from a photographed timetable into candidate schedule blocks.
// The student always reviews and corrects the candidates before saving (PRD 7.1).
export interface TimetableCandidate {
  day: number; // 0 (Sunday) - 6 (Saturday)
  title: string;
  start: string; // HH:MM
  end: string; // HH:MM
}

const DAY_PATTERNS: { day: number; re: RegExp }[] = [
  { day: 1, re: /\b(mon(day)?|lun)\b/i },
  { day: 2, re: /\b(tue(s|sday)?|mar)\b/i },
  { day: 3, re: /\b(wed(nesday)?|mer)\b/i },
  { day: 4, re: /\b(thu(rs|rsday)?|jeu)\b/i },
  { day: 5, re: /\b(fri(day)?|ven)\b/i },
  { day: 6, re: /\b(sat(urday)?|sam)\b/i },
  { day: 0, re: /\b(sun(day)?|dim)\b/i },
];

const TIME_RE = /(\d{1,2})[:.](\d{2})/g;

function normTime(h: number, m: number): string | null {
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function stripTimes(text: string): string {
  // Remove only the time tokens themselves, so words like "Mathematics"
  // or "Trip to school" survive. Dangling separators are trimmed after.
  const ranges: [number, number][] = [];
  const re = /(\d{1,2})[:.](\d{2})\s*(am|pm)?/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) ranges.push([m.index, m.index + m[0].length]);
  let out = '';
  let last = 0;
  for (const [s, e] of ranges) {
    out += text.slice(last, s);
    last = e;
  }
  out += text.slice(last);
  return out
    .replace(/^[\s\-–—:;.]+/, '')
    .replace(/[\s\-–—:;.]+$/, '')
    .replace(/^to\s+/i, '')
    .replace(/\sto$/i, '')
    .replace(/\s*[-–—]\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export interface OcrLine {
  text: string;
  y: number;
}

export function parseTimetableLines(rawLines: OcrLine[]): TimetableCandidate[] {
  const out: TimetableCandidate[] = [];
  let day = 1; // default to Monday when no day header is found
  const sorted = [...rawLines].sort((a, b) => a.y - b.y);

  for (const line of sorted) {
    const text = line.text.trim();
    if (!text) continue;

    const dayHit = DAY_PATTERNS.find(d => d.re.test(text));
    const times: string[] = [];
    TIME_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = TIME_RE.exec(text)) !== null) {
      let h = parseInt(m[1], 10);
      const min = parseInt(m[2], 10);
      const ampm = new RegExp(`${m[1]}[:.]${m[2]}\\s*(am|pm)`, 'i').exec(text);
      if (ampm) {
        const ap = ampm[1].toLowerCase();
        if (ap === 'pm' && h < 12) h += 12;
        if (ap === 'am' && h === 12) h = 0;
      }
      const t = normTime(h, min);
      if (t) times.push(t);
    }

    if (dayHit && times.length === 0) {
      // Pure day header ("Monday", "TUE", ...) — sets context for following lines.
      day = dayHit.day;
      continue;
    }
    if (dayHit) day = dayHit.day;

    if (times.length >= 2) {
      const start = times[0];
      const end = times[times.length - 1];
      if (start >= end) continue;
      const title = stripTimes(text);
      if (!title) continue;
      out.push({ day, title, start, end });
    } else if (times.length === 1) {
      // Single time: assume a one-hour block starting there.
      const [h, min] = times[0].split(':').map(Number);
      const endMin = h * 60 + min + 60;
      if (endMin >= 24 * 60) continue;
      const end = `${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;
      const title = stripTimes(text);
      if (!title) continue;
      out.push({ day, title, start: times[0], end });
    }
    // Lines with no times are skipped — the correction screen only shows placeable blocks.
  }

  return out;
}

export const DEFAULT_SCAN_KIND: ScheduleKind = 'class';
