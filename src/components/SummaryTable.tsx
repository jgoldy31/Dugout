import React from "react";
import "./SummaryTable.css";
import { pitchColorsDarken, namesToAbbreviations } from "../constants/plotConstants";


interface SummaryRow {
  pitch_type: string;
  n: number;
  usage_pct: number;
  velocity_range: string;
  iz_pct: number;
}

interface SummaryTableProps {
  data: SummaryRow[];
  colors?: Record<string, string>; 
}

export default function SummaryTable({ data, colors }: SummaryTableProps) {
  return (
    <div className="pitch-summary-table-container">
      <table className="summary-table">
        <thead>

          <tr className="">
            <th className=""></th> 
            <th className="summary-table-header"># Thrown</th>
            <th className="summary-table-header">Usage %</th>
            <th className="summary-table-header">Velocity</th>
            <th className="summary-table-header">IZ %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const bgColor = idx % 2 === 0 ? "white" : "#e4e4e4";
            const pitchColor = colors?.[row.pitch_type] || "#ababab"; 

            return (
              <tr key={row.pitch_type}
                style={{  backgroundColor: bgColor }}
                className="summary-table-border"
              >
                <td 
                  className="" 
                  style={{ backgroundColor: pitchColor, color: "white", fontWeight: "bold", border:"2px solid black" }}
                >
                  {namesToAbbreviations[row.pitch_type] || row.pitch_type}
                </td>
                <td className="inside-right">{row.n}</td>
                <td className="inside-right">{row.usage_pct}%</td>
                <td className="inside-right">{row.velocity_range}</td>
                <td className="">{row.iz_pct}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}