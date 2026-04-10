"use client"


import{useState} from "react";
import CoachNotesCard from "./Componets/CoachNote";
import StatsPanel from "./Componets/StatsPanel";

function parseAnalysis(text: string) {
  const coverage = text.match(/COVERAGE:\s*(.+)/)?.[1]?.trim() ?? "Unknown"
  const coverageRaw = coverage.toLowerCase();

const coverageColor =
  coverageRaw.includes("cover 2") ? "blue" :
  coverageRaw.includes("cover 3") ? "purple" :
  coverageRaw.includes("cover 1") ? "red" :
  "blue";

  const confidence = text.match(/CONFIDENCE:\s*(.+)/)?.[1]?.trim() ?? "Unknown"
  const confidenceValue = parseFloat(confidence.replace("%", ""))
  const reasoningCB = text.match(/REASONING Cornerbacks:\s*(.*?)(?=REASONING|$)/s)?.[1]?.trim() ?? "Unknown"
  const reasoningSafeties = text.match(/REASONING Safeties:\s*(.*?)(?=REASONING|$)/s)?.[1]?.trim() ?? "Unknown"
  const reasoningLB = text.match(/REASONING Linebackers:\s*(.*?)(?=REASONING|$)/s)?.[1]?.trim() ?? "Unknown"
  const color = confidenceValue > 85 ? "green" : confidenceValue > 70 ? "yellow" : "red"
 

  return { coverage, coverageColor, confidence, reasoningCornerbacks: reasoningCB, reasoningSafeties, reasoningLinebackers: reasoningLB, confidenceValue, color }
}
export default function Home() {

  const [image, setImage] = useState<string | null>(null);
  const[analysis, setAnalysis] = useState<string | null>(null);
  const[loading, setLoading] = useState(false);
   const [defensiveTeam, setDefensiveTeam] = useState("")
  const [offensiveTeam, setOffensiveTeam] = useState("")
  const [season, setSeason] = useState("2024")
  const [stats, setStats] = useState<any>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setAnalysis(null);

    }
    reader.readAsDataURL(file);
  }  

  const analyzeImage = async () => {
    if(!image) return

    setLoading(true)
    try{
      const response = await fetch("/api/analyze",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({image, defensiveTeam, offensiveTeam, season}),

      })
      const data = await response.json()
      console.log("API RESPONSE:", data)
      setAnalysis(data.analysis)
      setStats(data.stats)

    }catch(error){
      console.error("Something went wrong. Please try again.")
      setAnalysis("Error analyzing the image. Please try again.")
      
    }finally{
      setLoading(false)
    }
  }

  

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">NFL Defense Analyzer</h1>
      
      {/* Team and Season Selectors */}
<div className="flex gap-4 mb-8 flex-wrap justify-center">
  <select
    value={season}
    onChange={(e) => setSeason(e.target.value)}
    className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2"
  >
    <option value="2024">2024</option>
    <option value="2025">2025</option>
  </select>

  <select
    value={defensiveTeam}
    onChange={(e) => setDefensiveTeam(e.target.value)}
    className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2"
  >
    <option value="">Select Defensive Team</option>
    {["ARI","ATL","BAL","BUF","CAR","CHI","CIN","CLE","DAL","DEN",
      "DET","GB","HOU","IND","JAX","KC","LA","LAC","LV","MIA",
      "MIN","NE","NO","NYG","NYJ","PHI","PIT","SEA","SF","TB","TEN","WAS"
    ].map(team => (
      <option key={team} value={team}>{team}</option>
    ))}
  </select>

  <select
    value={offensiveTeam}
    onChange={(e) => setOffensiveTeam(e.target.value)}
    className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2"
  >
    <option value="">Select Offensive Team</option>
    {["ARI","ATL","BAL","BUF","CAR","CHI","CIN","CLE","DAL","DEN",
      "DET","GB","HOU","IND","JAX","KC","LA","LAC","LV","MIA",
      "MIN","NE","NO","NYG","NYJ","PHI","PIT","SEA","SF","TB","TEN","WAS"
    ].map(team => (
      <option key={team} value={team}>{team}</option>
    ))}
  </select>
</div>
      <p className="text-gray-400 text-lg mb-8">Upload a pre-snap image to identify the defensive coverage</p>

      <label className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        {image ? (
          <img src={image} alt="Uploaded play" className="max-w-lg rounded-lg" />
        ) : (
          <p className="text-gray-400">Drop an image here or click to upload</p>
        )}
      </label>
      {image && (
        <button
          onClick = {analyzeImage}
          className= "bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors mb-8"
          >
            {loading ? "Analyzing..." : "Analyze Coverage"}
          </button>
      )}
      {analysis && (() => {
  const { coverage, confidence, reasoningCornerbacks, reasoningSafeties, reasoningLinebackers, confidenceValue, color, coverageColor } = parseAnalysis(analysis)
  return (
    <CoachNotesCard
      coverage={coverage}
      coverageColor= {coverageColor}
      color = {color}
      confidence={confidence}
      reasoningCornerbacks={reasoningCornerbacks}
      reasoningSafeties={reasoningSafeties}
      reasoningLinebackers={reasoningLinebackers}
      
    />

   

  )
})()}

{/* ADD THIS RIGHT HERE */}
{stats && (
  <StatsPanel
    stats={stats}
    defensiveTeam={defensiveTeam}
    offensiveTeam={offensiveTeam}
    season={season}
  />
)}
    </main>
  )
}