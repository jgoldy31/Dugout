// Mechanics tab, release point plots, time series plots
import React, { useMemo, useState } from "react";
import PitchPlot from "./ReleaseFront";
import PitchPlotSide from "./ReleaseSide";
import { useBiomechData } from "../hooks/biomechHooks";
import TimeSeriesPlot from "./TimeSeriesPlot";
import "./Mechanics.css";
interface MechanicsProps {
  playerName?: string;
  startDate?: string;
  endDate?: string;
}

export default function Mechanics({ playerName, startDate, endDate }: MechanicsProps) {
  const { data } = useBiomechData();
  const [splitByPitch, setSplitByPitch] = useState<boolean>(false); // <-- new checkbox state

  const xKey = "x0";
  const yKey = "z0";
  const extKey = "y0"; 

  const scatterData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!playerName || !startDate || !endDate) return [];

    return data
      .filter((d) => d[xKey] != null && d[yKey] != null && d[extKey] != null)
      .filter((d) => {
        const pitchDate = new Date(d.Date);
        return pitchDate >= new Date(startDate) && pitchDate <= new Date(endDate);
      })
      .map((d) => ({
        x: Number(d[xKey]),
        y: Number(d[yKey]),
        ext: 60.5 - Number(d[extKey]),
        pitch_type: d.pitch_type || "Unknown",
        start_speed: Number(d.start_speed),
        Date: d.Date,
        count: `${d.balls}-${d.strikes}`,
        batterHandedness: d.batterSide,
      }));
  }, [data, playerName, startDate, endDate]);

  // X, Z for front View
  const releasePointsFront = useMemo(() => {
    const sums: Record<string, { x: number; y: number; count: number }> = {};
    scatterData.forEach((d) => {
      const type = d.pitch_type;
      if (!sums[type]) sums[type] = { x: 0, y: 0, count: 0 };
      sums[type].x += d.x;
      sums[type].y += d.y;
      sums[type].count += 1;
    });
    const avgPoints: Record<string, [number, number]> = {};
    Object.entries(sums).forEach(([type, val]) => {
      avgPoints[type] = [val.x / val.count, val.y / val.count];
    });
    return avgPoints;
  }, [scatterData]);

  // Extension and Z for Side view
  const releasePointsSide = useMemo(() => {
    const sums: Record<string, { y: number; ext: number; count: number }> = {};
    scatterData.forEach((d) => {
      const type = d.pitch_type;
      if (!sums[type]) sums[type] = { y: 0, ext: 0, count: 0 };
      sums[type].y += d.y;
      sums[type].ext += d.ext;
      sums[type].count += 1;
    });
    const avgPoints: Record<string, [number, number]> = {};
    Object.entries(sums).forEach(([type, val]) => {
      avgPoints[type] = [val.ext / val.count, val.y / val.count];
    });
    return avgPoints;
  }, [scatterData]);

  // Daily averages
  const dailyAverages = useMemo(() => {
    if (!data || data.length === 0 || !playerName || !startDate || !endDate) return {};
    const grouped: Record<string, { [key: string]: number; count: number }> = {};
    data
      .filter((d) => {
        const pitchDate = new Date(d.Date);
        return pitchDate >= new Date(startDate) && pitchDate <= new Date(endDate);
      })
      .forEach((d) => {
        const day = d.Date.split("T")[0];
        if (!grouped[day]) grouped[day] = { count: 0 };
        Object.entries(d).forEach(([key, value]) => {
          if (typeof value === "number") {
            if (!grouped[day][key]) grouped[day][key] = 0;
            grouped[day][key] += value;
          }
        });
        grouped[day].count += 1;
      });

    const averages: Record<string, { [key: string]: number }> = {};
    Object.entries(grouped).forEach(([day, val]) => {
      const count = val.count;
      averages[day] = {};
      Object.entries(val).forEach(([key, value]) => {
        if (key !== "count") averages[day][key] = value / count;
      });
    });
    return averages;
  }, [data, playerName, startDate, endDate]);

  // Daily averages by pitch type
  const dailyAveragesByPitch = useMemo(() => {
    if (!data || data.length === 0 || !playerName || !startDate || !endDate) return {};
    const grouped: Record<string, Record<string, { [key: string]: number; count: number }>> = {};
    data
      .filter((d) => {
        const pitchDate = new Date(d.Date);
        return pitchDate >= new Date(startDate) && pitchDate <= new Date(endDate);
      })
      .forEach((d) => {
        const day = d.Date.split("T")[0];
        const pitchType = d.pitch_type || "Unknown";
        if (!grouped[day]) grouped[day] = {};
        if (!grouped[day][pitchType]) grouped[day][pitchType] = { count: 0 };
        Object.entries(d).forEach(([key, value]) => {
          if (typeof value === "number") {
            if (!grouped[day][pitchType][key]) grouped[day][pitchType][key] = 0;
            grouped[day][pitchType][key] += value;
          }
        });
        grouped[day][pitchType].count += 1;
      });

    const averages: Record<string, Record<string, { [key: string]: number }>> = {};
    Object.entries(grouped).forEach(([day, pitchData]) => {
      averages[day] = {};
      Object.entries(pitchData).forEach(([pitchType, metrics]) => {
        const count = metrics.count;
        averages[day][pitchType] = {};
        Object.entries(metrics).forEach(([key, value]) => {
          if (key !== "count") averages[day][pitchType][key] = value / count;
        });
      });
    });
    return averages;
  }, [data, playerName, startDate, endDate]);

  const uniquePitchTypes = useMemo(() => {
  if (!dailyAveragesByPitch) return [];
  const pitchSet = new Set<string>();

  Object.values(dailyAveragesByPitch).forEach((dayData) => {
    Object.keys(dayData).forEach((pitchType) => {
      pitchSet.add(pitchType);
    });
  });

  return Array.from(pitchSet);
}, [dailyAveragesByPitch]);

console.log("Unique pitch types:", uniquePitchTypes);

  return (
    <div>
      {!playerName ? (
        <div className="select-div" style={{ textAlign: "left", fontStyle: "italic", color: "#666" }}>
          Select a player to see mechanics
        </div>
      ) : (
        <>
          <div
            style={{
              marginLeft: "17%",
              marginTop: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 0,
            }}
          >
            <PitchPlot releasePoints={releasePointsFront} width={400} height={450} />
            <div style={{ marginTop: -120 }}>
              <PitchPlotSide releasePoints={releasePointsSide} width={600} height={400} />
            </div>
          </div>

          {/* Checkbox for split by pitch */}
          <div style={{width:"80%", marginLeft:"10%"}}>
<label className="checkbox-label-mechanics">
  <input
    type="checkbox"
    checked={splitByPitch}
    onChange={(e) => setSplitByPitch(e.target.checked)}
  />
  <span>Split By Pitch Type</span>
</label>

</div>
        
          {/* Time series plot below the release points */}
                    <div style={{width:"80%" ,  marginLeft:"10%"}}>
            <TimeSeriesPlot
              playerName={playerName}
              startDate={startDate}
              endDate={endDate}
              plotData={dailyAverages}
              plotDataPitch={dailyAveragesByPitch}
              splitByPitch={splitByPitch}
            />
          </div>
        </>
      )}
    </div>
  );
}
