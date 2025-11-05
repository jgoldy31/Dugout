import React, { useMemo, useState, useEffect } from "react";
import { useBiomechData } from "../hooks/biomechHooks";
import PitchTable from "./SelectPitchTable";
import type { ScatterPitch } from "./PitchTypes";
import timeSeriesRaw from "../data/time_series_metrics.json";
import TimeSeriesPlotIndiv from "./IndivTimeSeries";

interface IndivPitchProps {
  playerName?: string;
  startDate?: string;
  endDate?: string;
}

interface TimeSeriesMetrics {
  [metric: string]: { frame: number; value: number }[];
}

export default function IndivPitch({ playerName, startDate, endDate }: IndivPitchProps) {
  const { data } = useBiomechData();
  const [selectedPitchUID, setSelectedPitchUID] = useState<string | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesMetrics | null>(null);

  // Filter pitch table data
  const pitchData: ScatterPitch[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!playerName || !startDate || !endDate) return [];

    return data
      .filter((d) => {
        const pitchDate = new Date(d.Date);
        return pitchDate >= new Date(startDate) && pitchDate <= new Date(endDate);
      })
      .map((d) => ({
        PitchUID: d.PitchUID,
        pitch_type: d.pitch_type || "Unknown",
        start_speed: Number(d.start_speed),
        Date: d.Date,
        Description: d.description,
      }));
  }, [data, playerName, startDate, endDate]);

  // Load time series data for selected pitch
  useEffect(() => {
    if (!selectedPitchUID) {
      setTimeSeries(null);
      return;
    }

    const metrics = (timeSeriesRaw as Record<string, TimeSeriesMetrics>)[selectedPitchUID] || null;
    setTimeSeries(metrics);
  }, [selectedPitchUID]);

  return (
    <div>
      {/* Plot or instruction */}
      {selectedPitchUID && timeSeries ? (
        <TimeSeriesPlotIndiv timeSeries={timeSeries} />
      ) : (
          <div style={{ textAlign: "left", fontStyle: "italic", color: "#666" }}>
          Click a row to begin.
        </div>
      )}

      {/* Table below */}
      <PitchTable
        data={pitchData}
        onSelect={(pitchUID) => setSelectedPitchUID(pitchUID)}
      />
    </div>
  );
}
