import React from "react";
import CountUp from "react-countup";
import "./ScoreCard.css";

interface ScoreCardProps {
  title: string;
  score: number;
   titleAttr:  string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, titleAttr  }) => {
  // dynamically set font size based on title length
  const fontSize= "1.1rem";

  return (
    <div className="scorecard" data-tooltip={titleAttr}>
      <div
        className="scorecard-title"
        style={{ fontSize }}
      >
        {title}
      </div>
      <div className="scorecard-box">
        <CountUp end={score} duration={1.5} key={score} />
      </div>
    </div>
  );
};

export default ScoreCard;
