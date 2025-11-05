import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { pitchColors } from "../constants/plotConstants";
import "./Mechanics.css";

interface TimeSeriesPlotProps {
  playerName?: string;
  startDate?: string;
  endDate?: string;
  plotData?: Record<string, { [key: string]: number }>;
  plotDataPitch?: Record<string, Record<string, { [key: string]: number }>>;
  splitByPitch?: boolean;
}

export default function TimeSeriesPlot({
  plotData,
  plotDataPitch,
  splitByPitch = false,
}: TimeSeriesPlotProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("start_speed");

  const metricOpts: Record<string, string> = {
    start_speed: "Velocity",
    spin_rate: "Spin Rate",
    horizontal_break: "Horizontal Break",
    induced_vertical_break: "Induced Vertical Break",
    Stride_Length_X: "Stride Length X",
    Knee_Height_In_X: "Knee Lift",
    Shoulder_Rotation_Time_X: "Shoulder Rotation Time",
    Normalized_Max_Resultant_Sho_Force_X: "Max Shoulder Force",
    Arm_Slot_Updated_X: "Arm Slot",
  };

  const metricOptions = useMemo(() => {
    if (!plotData) return [];
    const firstDay = Object.values(plotData)[0];
    if (!firstDay) return [];
    return Object.keys(firstDay).filter((key) => key in metricOpts);
  }, [plotData]);

  // Map raw data to include formattedDate for XAxis
  const mapDataWithFormattedDate = (data: any) =>
    data.map((entry: any) => {
      const date = new Date(entry.date);
      return {
        ...entry,
        formattedDate: `${date.getMonth() + 1}/${date.getDate()}/${date
          .getFullYear()
          .toString()
          .slice(-2)}`,
      };
    });

  const timeSeriesData = useMemo(() => {
    if (!plotData || !selectedMetric) return [];
    const raw = Object.entries(plotData)
      .map(([date, metrics]) => ({
        date,
        value: metrics[selectedMetric],
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return mapDataWithFormattedDate(raw);
  }, [plotData, selectedMetric]);

  const timeSeriesDataByPitch = useMemo(() => {
    if (!plotDataPitch || !selectedMetric) return [];
    const dates = Object.keys(plotDataPitch).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    const raw = dates.map((date) => {
      const dayData = plotDataPitch[date];
      const entry: any = { date };
      Object.entries(dayData).forEach(([pitchType, metrics]) => {
        entry[pitchType] = metrics[selectedMetric];
      });
      return entry;
    });
    return mapDataWithFormattedDate(raw);
  }, [plotDataPitch, selectedMetric]);

  const pitchTypes = useMemo(() => {
    if (!plotDataPitch) return [];
    const set = new Set<string>();
    Object.values(plotDataPitch).forEach((dayData) => {
      Object.keys(dayData).forEach((pitchType) => set.add(pitchType));
    });
    return Array.from(set);
  }, [plotDataPitch]);

  if ((!plotData && !plotDataPitch) || Object.keys(plotData || {}).length === 0) {
    return <div style={{ fontStyle: "italic", color: "#666" }}>No data available</div>;
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: 8,
          fontSize: 12,
        }}
      >
        <strong>{label}</strong>
        <br />
        {payload.map((entry: any) => {
          const name =
            splitByPitch && pitchTypes.includes(entry.dataKey)
              ? entry.dataKey
              : metricOpts[selectedMetric] || selectedMetric;
          const value = entry.value !== undefined ? entry.value.toFixed(1) : "-";
          return (
            <div key={entry.dataKey}>
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  backgroundColor: entry.color,
                  marginRight: 5,
                }}
              ></span>
              {name}: {value}
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <div style={{ width: "100%", marginTop: 20 }}>
      <div style={{ marginBottom: 10, marginLeft:"10%" }}>
            <label className="metric-select-label">Select Metric:</label>
    <select
      className="metric-select-input"
      value={selectedMetric}
      onChange={(e) => setSelectedMetric(e.target.value)}
    >
      {metricOptions.map((metric) => (
        <option key={metric} value={metric}>
          {metricOpts[metric] || metric}
        </option>
      ))}
    </select>
      </div>
      

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={splitByPitch ? timeSeriesDataByPitch : timeSeriesData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="formattedDate" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          {splitByPitch
            ? pitchTypes.map((pitchType) => (
                <Line
                  key={pitchType}
                  type="monotone"
                  dataKey={pitchType}
                  stroke={pitchColors[pitchType] || pitchColors.Default}
                  strokeWidth={2}
                  dot={false}
                />
              ))
            : (
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
