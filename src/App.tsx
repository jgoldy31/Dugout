import { useState, useEffect} from "react";
import Sidebar from "./components/Sidebar";
import PlayerProfile from "./components/PlayerProfile";
import ScoreCard from "./components/ScoreCard";
import SubTabs from "./components/SubTabs";
import "./App.css";

function App() {
  const [selectedName, setSelectedName] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [score, setScore] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Use sidebarOpen directly for layout logic
  const effectiveSidebarWidth = sidebarOpen ? 191 : 40;




  const playerPhoto = "/src/images/felix.png";

  // Update score when a player is selected
  useEffect(() => {
    if (selectedName) setScore(50); // trigger count-up
  }, [selectedName]);

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        items={[]}
        names={["", "P00001"]}
        onNameChange={setSelectedName}
        onDateChange={setDateRange}
         onToggle={setSidebarOpen}
      />

      {/* Main content */}
      <div
        style={{
          marginLeft: effectiveSidebarWidth, // shift content based on sidebar
          transition: "margin-left 0.3s ease",
          height: "100vh",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {/* Top row: PlayerProfile + ScoreCards */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            alignItems: "flex-start",
          }}
        >
          {selectedName ? (
            <PlayerProfile playerPhoto={playerPhoto} playerName={selectedName} />
          ) : (
            <p>Select a player to begin analysis.</p>
          )}

          {/* ScoreCards container */}
          <div
            style={{
              display: "flex",
               flexGrow: 0, 
              flexBasis: "80%",            
              marginLeft: "5%",   
              justifyContent: "space-between", 
              alignItems: "stretch",
              gap: "10px",
            }}
          >
            <ScoreCard title="Delivery Consistency" score={score} />
            <ScoreCard title="Movement Efficiency" score={score} />
            <ScoreCard title="Stuff" score={score} />
            <ScoreCard title="Locations" score={score} />
          </div>
        </div>

        {/* Rest of content */}
        <div
          style={{
            marginTop: "-5px",
            flex: 1,
            backgroundColor: "#f8f8f8",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          {

           <SubTabs
  playerName={selectedName}
  startDate={dateRange.start}
  endDate={dateRange.end}
/>
          }
        </div>
      </div>
    </>
  );
}

export default App;
