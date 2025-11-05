# Dugout Dashboard

This Dashboard is a small version of a potential framework to allow for pitcher analysis for a variety of audiences (Coaches, Front Office Staff, Analysts). While the present project only contains data for a single piture, the dashboard could be expanded to dynamically display content for multiple pitchers. Below, I will describe the content as well as ideas for future improvements.

---

## Project Overview
This dashboard is organized into three main tabs, each focusing on a different aspect of pitching data:

### 1. Arsenal Overview
**Description:**  
Provides a high-level view of a pitcher’s performance history by displaying a summary table, pitch movement chart, and heatmaps depicting the location tencies by pitch type. This tab also allows for quick filtering of count-types and platoon splits.

**Future Ideas:**  
- Add additional metrics to summary table (wOBA, HH/BIP, Swing%, Chase%, etc.) 
- BIP charts - Individual Pitches and mapped landing coordinates

---

### 2. Mechanics Summary
**Description:**  
Provides basic information of pitcher's mechanics, along with time-series plot allowing for user investigation. Namely, front-view and side-view release plots split by pitch type and a custom time-series plots of corresponding metrics.

**Future Ideas:**  
- Normalizing release tendencies relative to MLB average.
- Expanding the set of metrics for time series plots to all applicable metrics
- Flagging system that automatically informs users of standout changes to mechanics

---

### 3. Individual-Pitch Analysis
**Description:**  
Using the time-series data provided, allows the user to view the frame-by-frame trend for any pitch within the selected date range.

**Future Ideas:**  
- Ability to layer multiple pitches at once
- Using additional data, coupling the time-series data with 3D stick figures.

---

## Getting Started

1. **Clone the repository:**  
   ```bash
   git clone https://github.com/jgoldy31/Dugout.git
cd into cloned directory
2. **Install Dependencies**  
npm install 

3. **Add in Data (too large for git)**  
copy provided json files to /Users/jgoldsher/dugout/dugout/src/data

4. **Run the Code!**
npm run dev

5. **Open In Browser**
http://localhost:5173/