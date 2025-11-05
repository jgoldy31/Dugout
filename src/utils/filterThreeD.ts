// utils/filterPitchData.ts

export interface FrameValue {
  frame: number;
  value: number;
}

export interface PitchMetrics {
  [metricName: string]: FrameValue[];
}

export interface AllPitchData {
  [pitchId: string]: PitchMetrics;
}

export function filterPitchData(
  allData: AllPitchData,
  pitchId: string
): PitchMetrics | null {
  if (!allData || !allData[pitchId]) return null;
  return allData[pitchId];
}

// ---- Biomech Metadata ----
export interface BiomechRecord {
  PitchUID: string;
  pitch_type?: string;   // optional, but recommended
  PlayerName?: string;   // optional, for filtering by player
  // add any other metrics here as needed
}

export function filterPitchMetadata(
  data: BiomechRecord[],
  pitchId?: string
): BiomechRecord[] {
  return data.filter((row: BiomechRecord) => {
    // If pitchId is provided, match it; otherwise keep all rows
    return pitchId ? row.PitchUID === pitchId : true;
  });
}
