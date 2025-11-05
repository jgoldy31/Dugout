// ArsenalOverview.tsx - Usage Table, Movement Plot, Heatmaps
import React, { useMemo } from "react";
import { useBiomechData } from "../hooks/biomechHooks";
import { summarizePitches } from "../utils/pitchTable";
import SimpleScatter from "./MovementScatter";
import PitchHeatmap from "./PitchChart";
import SummaryTable from "./SummaryTable";
import { pitchColorsDarken } from "../constants/plotConstants";
import { HandednessButton, CountButton } from "./ButtonGroups";

interface ArsenalOverviewProps {
  playerName?: string;
  startDate?: string;
  endDate?: string;
}

export default function ArsenalOverview({ playerName, startDate, endDate }: ArsenalOverviewProps) {
  const {
    data,
    selectedCount,
    setSelectedCount,
    selectedHandedness,
    setSelectedHandedness,
  } = useBiomechData();

  const xKey = "horizontal_break";
  const yKey = "induced_vertical_break";
  const plateZ = "plate_z";
  const plateX = "plate_x";

  const scatterData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!playerName || !startDate || !endDate) return [];

    return data
      .filter((d) => d[xKey] != null && d[yKey] != null)
      .filter((d) => {
        const pitchDate = new Date(d.Date);
        return pitchDate >= new Date(startDate) && pitchDate <= new Date(endDate);
      })
      .map((d) => ({
        x: Number(d[xKey]),
        y: Number(d[yKey]),
        plateX: Number(d[plateX]),
        plateZ: Number(d[plateZ]),
        pitch_type: d.pitch_type || "Unknown",
        start_speed: Number(d.start_speed),
        Date: d.Date,
        count: String(d.balls) + "-" + String(d.strikes),
        batterHandedness: d.batterSide,
      }));
  }, [data, playerName, startDate, endDate]);

  const pitchTypes = useMemo(() => Array.from(new Set(scatterData.map((d) => d.pitch_type))), [scatterData]);
  const pitchSummary = useMemo(() => summarizePitches(scatterData), [scatterData]);

  return (
    <div className="arsenal-overview-container">
      {scatterData.length > 0 ? (
        <div className="arsenal-main">
          {/* Left Panel - Overview Table and Movement Plot*/}
          <div className="arsenal-left">
            <div className="button-groups">
              <HandednessButton value={selectedHandedness} onChange={setSelectedHandedness} />
              <CountButton value={selectedCount} onChange={setSelectedCount} />
            </div>

            <SummaryTable data={pitchSummary} colors={pitchColorsDarken} />
            <SimpleScatter data={scatterData} />
          </div>

          {/* Right Panel: Pitch heatmaps */}
          <div className="arsenal-right">
            
            {pitchTypes.map((type, index) => {
              const pitchesOfType = scatterData
                .filter((d) => d.pitch_type === type)
                .map((d) => ({ x: d.plateX, y: d.plateZ }));

              const color = pitchColorsDarken[type] || pitchColorsDarken.Default;

              const cardsPerRow = 2; 
    const customStyle = index >= cardsPerRow && index < cardsPerRow * 2
        ? { marginTop: "-120px", marginBottom: "90px" }
        : {};

              return (
                <div  style={customStyle}>
            
                <div key={type} className="pitch-heatmap-card">
                  <h3 className="pitch-heatmap-title">
                    <span style={{ color }}>{type}</span>{" "}
                    <span style={{ color: "black" }}>({pitchesOfType.length})</span>
                  </h3>
                  <PitchHeatmap
                    pitches={pitchesOfType}
                    sigma={0.0575}
                    gridSize={200}
                    maxColor={color}
                  />
                </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="no-data-text">No data available for selected filters.</p>
      )}
    </div>
  );
}
