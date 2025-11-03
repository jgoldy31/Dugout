import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Layer,
} from "recharts";
import { pitchColors } from "../constants/plotConstants";
import {
  mean,
  covarianceMatrix,
  eigenDecomposition2x2,
  ellipseBoundaryPoints,
} from "../utils/EllipseHelpers";

interface ScatterPoint {
  x: number;
  y: number;
  pitch_type?: string;
  Date?: string;
}

interface SimpleScatterProps {
  data: ScatterPoint[];
  xDomain?: [number, number];
  yDomain?: [number, number];
}

export default function SimpleScatter({
  data,
  xDomain = [-25, 25],
  yDomain = [-25, 25],
}: SimpleScatterProps) {
  const scatterData = React.useMemo(
    () =>
      data.map((d) => ({
        ...d,
        fill: pitchColors[d.pitch_type || "Default"] || pitchColors.Default,
      })),
    [data]
  );
  

  const ellipseBoundariesByPitch = React.useMemo(() => {
    const grouped: Record<string, ScatterPoint[]> = {};
    scatterData.forEach((d) => {
      const key = d.pitch_type || "Default";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(d);
    });

    return Object.entries(grouped)
      .map(([pitch_type, pts]) => {
        if (pts.length < 3) return null;
        const xs = pts.map((p) => p.x);
        const ys = pts.map((p) => p.y);
        const cov = covarianceMatrix(xs, ys);
        const eig = eigenDecomposition2x2(cov);
        const center = { x: mean(xs), y: mean(ys) };
        const boundary = ellipseBoundaryPoints(center, eig, 0.7, 64);
        return { pitch_type, boundary, color: pitchColors[pitch_type] || pitchColors.Default };
      })
      .filter(Boolean) as {
      pitch_type: string;
      boundary: { x: number; y: number }[];
      color: string;
    }[];
  }, [scatterData]);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = React.useState<{ width: number; height: number } | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      setContainerSize({ width: e.contentRect.width, height: e.contentRect.height });
    });
    ro.observe(el);
    const rect = el.getBoundingClientRect();
    setContainerSize({ width: rect.width || 600, height: rect.height || 400 });
    return () => ro.disconnect();
  }, []);

  // Inner margins to align ellipses with Recharts scatter points
  const innerMargin = { left: 60, right: 10, top: 10, bottom: 25 };
  const innerWidth = containerSize ? containerSize.width - innerMargin.left - innerMargin.right : 0;
  const innerHeight = containerSize ? containerSize.height - innerMargin.top - innerMargin.bottom : 0;

  function dataToPixel(x: number, y: number) {
    if (!containerSize) return { px: 0, py: 0 };
    const [xMin, xMax] = xDomain;
    const [yMin, yMax] = yDomain;
    const rx = (x - xMin) / (xMax - xMin);
    const ry = (y - yMin) / (yMax - yMin);
    const px = innerMargin.left + rx * innerWidth;
    const py = innerMargin.top + (1 - ry) * innerHeight; // invert y for SVG
    return { px, py };
  }

  function buildPathD(boundary: { x: number; y: number }[]) {
    if (!boundary.length) return "";
    const pts = boundary.map((pt) => {
      const { px, py } = dataToPixel(pt.x, pt.y);
      return [px, py];
    });
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i][0]} ${pts[i][1]}`;
    }
    d += " Z";
    return d;
  }

  const ticks = React.useMemo(() => Array.from({ length: 11 }, (_, i) => -25 + i * 5), []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: 650,
        margin: "5px",
        aspectRatio: "19 / 20", 
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            type="number"
            dataKey="x"
            domain={xDomain}
            ticks={ticks}
            tick={{ fontSize: 8 }}
            axisLine
            label={{ value: "Horizontal Break (in)", position: "insideBottom", fontSize: 10 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={yDomain}
            ticks={ticks}
            tick={{ fontSize: 8 }}
            axisLine
            label={{ value: "Induced Vertical Break (in)", angle: -90, position: "insideLeft", fontSize: 10 }}
          />

          <ReferenceLine x={0} stroke="#999" strokeWidth={1} />
          <ReferenceLine y={0} stroke="#999" strokeWidth={1} />

          {containerSize && (
            <Layer>
              {ellipseBoundariesByPitch.map((eb, i) => {
  const d = buildPathD(eb.boundary);
  return (
    <path
      key={i}
      d={d}
      fill="none"
      stroke={eb.color}
      strokeWidth={2}
      strokeDasharray="4 4" // <-- this creates a dotted line
    />
  );
})}

            </Layer>
          )}

          <Scatter
            name="Pitches"
            data={scatterData}
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              if (cx == null || cy == null) return <g />;
              const fill = pitchColors[payload.pitch_type || "Default"] || pitchColors.Default;
              return <circle cx={cx} cy={cy} r={3} fill={fill} fillOpacity={0.5} stroke={fill} strokeWidth={0.5} />;
            }}
          />

          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            wrapperStyle={{
              border: "1px solid #999",
              backgroundColor: "#fff",
              padding: "4px 6px",
              fontSize: "10px",
              borderRadius: "4px",
            }}
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const d = payload[0].payload as ScatterPoint;
              return (
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "10px" }}>{d.pitch_type || "Unknown"}</div>
                  <div style={{ fontSize: "9px" }}>HB: {d.x.toFixed(1)} in</div>
                  <div style={{ fontSize: "9px" }}>IVB: {d.y.toFixed(1)} in</div>
                  {d.Date && <div style={{ fontSize: "9px" }}>{d.Date}</div>}
                </div>
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
