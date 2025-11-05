import { useEffect, useState } from "react";
import { filterPitchData, filterPitchMetadata } from "../utils/filterThreeD";
import type { BiomechRecord } from "../utils/filterThreeD";
import type { AllPitchData, PitchMetrics,} from "../utils/filterThreeD";

export interface PitchFrame {
  frame: number;
  value: number;
}

export interface PitchData {
  metrics: BiomechRecord | null;  // per-pitch metadata
  frames: PitchMetrics | null;    // frame-by-frame kinematics
}


export function usePitchData(pitchId: string) {
  const [data, setData] = useState<PitchData>({ metrics: null, frames: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // 1. Load biomech metadata
        const metricsRes = await fetch("./src/data/pitch_biomech_data.json");
        const metricsJson: BiomechRecord[] = await metricsRes.json(); 
        const metrics = metricsJson.find((row) => row.PitchUID === pitchId) ?? null;

        console.log("Loaded metrics for pitchId", pitchId, metrics);

        // 2. Load frame-by-frame kinematics
        const framesRes = await fetch("./src/data/time_series_metrics.json");
        const framesJson: AllPitchData = await framesRes.json();
        const frames = framesJson[pitchId] || null;

        console.log("Loaded frames for pitchId", pitchId, frames);

        setData({ metrics, frames });
      } catch (err) {
        console.error("Error loading pitch data:", err);
        setData({ metrics: null, frames: null });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [pitchId]);

  return { ...data, loading };
}
