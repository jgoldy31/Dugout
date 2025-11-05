//Central App component
import { useState, useEffect} from "react";
import Sidebar from "./components/Sidebar";
import PlayerProfile from "./components/PlayerProfile";
import ScoreCard from "./components/ScoreCard";
import SubTabs from "./components/SubTabs";
import "./App.css";
import { LOCATIONS_DEF, MOVEMENT_EFFECIENCY_DEF, STUFF_DEF, DELIVERY_CONSISTENCY_DEF } from "./constants/definitions";
function App() {
  const [selectedName, setSelectedName] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [score, setScore] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Use sidebarOpen directly for layout logic
  const effectiveSidebarWidth = sidebarOpen ? 191 : 40;



 //Would be dynamic in a full app 
  const playerPhoto = "/src/images/felix.png";

  // Update score when a player is selected, this would be pre-computed per player
  useEffect(() => {
    if (selectedName) setScore(50); 
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
          marginLeft: effectiveSidebarWidth, 
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
         <p className="loading-text">Select a player to begin.</p>
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


            <ScoreCard title="Delivery Consistency" score={score} titleAttr={DELIVERY_CONSISTENCY_DEF} />
            <ScoreCard title="Movement Efficiency" score={score} titleAttr={MOVEMENT_EFFECIENCY_DEF} />
            <ScoreCard title="Stuff" score={score}  titleAttr={STUFF_DEF}/>
            <ScoreCard title="Locations" score={score} titleAttr={LOCATIONS_DEF}  />
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
