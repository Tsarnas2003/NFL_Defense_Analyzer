"use client"


import{useState} from "react";

function parseAnalysis(text: string) {
  const coverage = text.match(/COVERAGE:\s*(.+)/)?.[1]?.trim() ?? "Unknown"
  const confidence = text.match(/CONFIDENCE:\s*(.+)/)?.[1]?.trim() ?? "Unknown"
  const confidenceValue = parseFloat(confidence.replace("%", ""))
  const reasoningCB = text.match(/REASONING Cornerbacks:\s*(.*?)(?=REASONING|$)/s)?.[1]?.trim() ?? "Unknown"
  const reasoningSafeties = text.match(/REASONING Safeties:\s*(.*?)(?=REASONING|$)/s)?.[1]?.trim() ?? "Unknown"
  const reasoningLB = text.match(/REASONING Linebackers:\s*(.*?)(?=REASONING|$)/s)?.[1]?.trim() ?? "Unknown"
  const color = confidenceValue > 85 ? "green" : confidenceValue > 70 ? "yellow" : "red"

  return { coverage, confidence, reasoningCornerbacks: reasoningCB, reasoningSafeties, reasoningLinebackers: reasoningLB, confidenceValue, color }
}
export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const[analysis, setAnalysis] = useState<string | null>(null);
  const[loading, setLoading] = useState(false);

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
        body: JSON.stringify({image}),

      })
      const data = await response.json()
      console.log("API RESPONSE:", data)
      setAnalysis(data.analysis)

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
  const { coverage, confidence, reasoningCornerbacks, reasoningSafeties, reasoningLinebackers, confidenceValue, color } = parseAnalysis(analysis)
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-lg w-full mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Coverage</p>
          <p className="text-2xl font-bold text-white">{coverage}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Confidence</p>
          <p className={`text-2xl font-bold ${color === "green" ? "text-green-500" : color === "yellow" ? "text-yellow-500" : "text-red-500"}`}>{confidence}</p>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">Reasoning</p>
         <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">CornerBacks</p>
            <p className="text-gray-300 leading-relaxed">{reasoningCornerbacks}</p>
        <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Safeties</p>
        <p className="text-gray-300 leading-relaxed">{reasoningSafeties}</p>
        <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Linebackers</p>
        <p className="text-gray-300 leading-relaxed">{reasoningLinebackers}</p>
      </div>
    </div>
  )
})()}
    </main>
  )
}