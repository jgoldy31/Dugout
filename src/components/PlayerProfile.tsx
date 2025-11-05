// Player profile card, top left
import "./PlayerProfile.css";
import mlbLogo from "../images/mlb_logo.png";

interface PlayerProfileProps {
  playerPhoto: string;
  playerName: string;
}

export default function PlayerProfile({ playerPhoto, playerName }: PlayerProfileProps) {
  if (!playerPhoto) return null;

  const nameDict: { [key: string]: string } = {
    "P00001": "Felix Bautista",
  };
   
  const displayName = nameDict[playerName] || playerName;
  return (
    <div className="player-header">
      <div className="image-container">
        <img src={mlbLogo} alt="MLB logo" className="mlb-logo" />
        <img src={playerPhoto} alt={playerName} className="player-photo" />
      </div>
      <h2 className="player-name">{displayName}</h2>
    </div>
  );
}
