import { useState } from "react";
import ArsenalOverview from "./ArsenalOverview";
import Mechanics from "./Mechanics";
import ThreeD from "./ThreeD";

interface SubTabsProps {
  playerName?: string;
  startDate?: string;
  endDate?: string;
}

export default function SubTabs({ playerName, startDate, endDate }: SubTabsProps) {
  const tabs = ["Arsenal Overview", "Mechanics", "3D"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const renderContent = () => {
    switch (activeTab) {
      case "Arsenal Overview":
        return (
          <ArsenalOverview
            playerName={playerName}
            startDate={startDate}
            endDate={endDate}
          />
        );
      case "Mechanics":
        return <Mechanics playerName={playerName} />;
      case "3D":
        return <ThreeD playerName={playerName} />;
      default:
        return null;
    }
  };

  return (
    <div className="analysis-folder">
      {/* Tab buttons */}
      <div className="tab-header">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
}
