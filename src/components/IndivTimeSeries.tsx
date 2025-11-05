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
import "./Mechanics.css";

interface TimeSeriesPlotProps {
  timeSeries?: Record<string, { frame: number; value: number }[]>; // your new format
}

export default function TimeSeriesPlotIndiv({ timeSeries }: TimeSeriesPlotProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("Pitching_Shoulder_Rotation");

  // All available metric keys for selector
  const metricOptions = useMemo(() => {
    if (!timeSeries) return [];
    return Object.keys(timeSeries);
  }, [timeSeries]);

  // Map raw data to Recharts format
  const chartData = useMemo(() => {
    if (!timeSeries || !selectedMetric) return [];
    return timeSeries[selectedMetric].map((d) => ({
      frame: d.frame,
      value: d.value,
    }));
  }, [timeSeries, selectedMetric]);

  if (!timeSeries || Object.keys(timeSeries).length === 0) {
    return <div style={{ fontStyle: "italic", color: "#666" }}>No time series data</div>;
  }

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
        <strong>Frame: {label}</strong>
        <br />
        {payload.map((entry: any) => (
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
            {entry.dataKey}: {entry.value.toFixed(2)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ width: "100%", marginTop: 20 }}>

      <div style={{ marginBottom: 10, marginLeft: "4%" }}>
        <label className="metric-select-label">Select Metric:</label>
        <select
    className="metric-select-input"
    value={selectedMetric}
    onChange={(e) => setSelectedMetric(e.target.value)}
  >
    {metricOptions.map((metric) => (
      <option key={metric} value={metric}>
        {metric.replace(/_/g, " ")}
      </option>
    ))}
  </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="frame"    interval={49} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ef6565ff"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
