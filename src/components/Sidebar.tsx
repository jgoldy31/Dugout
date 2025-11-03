import { useState, useEffect } from "react";
import "./Sidebar.css";
import logo from "../images/logo.png";

interface SidebarProps {
  items: string[];
  names: string[];
  selectedName?: string;
  startDate?: string;
  endDate?: string;
  onNameChange?: (name: string) => void;
  onDateChange?: (range: { start: string; end: string }) => void;
  onToggle?: (isOpen: boolean) => void;
}

export default function Sidebar({
  items,
  names,
  selectedName: externalName,
  startDate: externalStart,
  endDate: externalEnd,
  onNameChange,
  onDateChange,
  onToggle,
}: SidebarProps) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const [isOpen, setIsOpen] = useState(true);
  const [playerAnalysisOpen, setPlayerAnalysisOpen] = useState(false);
  const [selectedName, setSelectedName] = useState(externalName || names[0] || "");
  const [startDate, setStartDate] = useState(externalStart || "2023-03-01");
  const [endDate, setEndDate] = useState(externalEnd || todayStr);

  // Propagate initial values to parent on mount
  useEffect(() => {
    onDateChange?.({ start: startDate, end: endDate });
  }, []);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newName = e.target.value;
    setSelectedName(newName);
    onNameChange?.(newName);
  };

  const handleDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") setStartDate(value);
    else setEndDate(value);

    onDateChange?.({
      start: type === "start" ? value : startDate,
      end: type === "end" ? value : endDate,
    });
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <button className="toggle-btn" onClick={handleToggle}>
        {isOpen ? "←" : "→"}
      </button>

      <div className="sidebar-logo">
        <img src={logo} alt="App Logo" className="logo-img" />
      </div>

      {isOpen && (
        <div className="sidebar-content">
          <div
            className="menu-item"
            onClick={() => setPlayerAnalysisOpen(!playerAnalysisOpen)}
          >
            <span>Player Analysis</span>
            <span style={{ marginLeft: "auto" }}>
              {playerAnalysisOpen ? "▲" : "▼"}
            </span>
          </div>

          {playerAnalysisOpen && (
            <div className="sub-section">
              <div className="sidebar-section">
                <label htmlFor="name-select">Pitcher</label>
                <select
                  id="name-select"
                  value={selectedName}
                  onChange={handleNameChange}
                >
                  {names.map((name, i) => (
                    <option key={i} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sidebar-section">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                />

                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                />
              </div>
            </div>
          )}

          <nav className="menu">
            {items.map((item, i) => (
              <div key={i} className="menu-item">
                {item}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
