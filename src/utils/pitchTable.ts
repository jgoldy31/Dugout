// src/utils/pitchSummary.ts
import { STRIKE_ZONE } from "../constants/plotConstants";

interface Pitch {
  pitch_type: string;
  start_speed: number;
  plateX: number;
  plateZ: number;
}

interface PitchSummary {
  pitch_type: string;
  n: number;
  usage_pct: number;
  velocity_range: string; // e.g., "88-95"
  iz_pct: number;
}

// helper to check if pitch is in strike zone
function isInStrikeZone(pitch: Pitch): boolean {
  const { x, y, width, height } = STRIKE_ZONE;
  return (
    pitch.plateX >= x &&
    pitch.plateX <= x + width &&
    pitch.plateZ >= y &&
    pitch.plateZ <= y + height
  );
}

// helper to get percentile
function percentile(arr: number[], p: number): number {
  if (!arr.length) return 0;
  const sorted = arr.slice().sort((a, b) => a - b);
  const idx = (sorted.length - 1) * p;
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

export function summarizePitches(pitches: Pitch[]): PitchSummary[] {
  const total = pitches.length;
  const grouped: Record<string, Pitch[]> = {};

  // group by pitch_type
  pitches.forEach((p) => {
    if (!grouped[p.pitch_type]) grouped[p.pitch_type] = [];
    grouped[p.pitch_type].push(p);
  });

  const summary: PitchSummary[] = [];

  for (const type in grouped) {
    const group = grouped[type];
    const n = group.length;
    const usage_pct = +(Math.round(100 * (n / total))).toFixed(1);

    const speeds = group.map((p) => p.start_speed);
    const velLow = Math.round(percentile(speeds, 0.1));
    const velHigh = Math.round(percentile(speeds, 0.9));

    const izCount = group.filter(isInStrikeZone).length;
    const iz_pct = +(Math.round(100 * (izCount / n))).toFixed(1);

    summary.push({
      pitch_type: type,
      n,
      usage_pct,
      velocity_range: `${velLow}-${velHigh}`,
      iz_pct,
    });
  }

  return summary;
}
