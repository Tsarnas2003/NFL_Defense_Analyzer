type CoachNotesCardProps = {
  coverage: string;
  coverageColor: string;
  confidence: string;
  color: string;
  reasoningCornerbacks: string;
  reasoningSafeties: string;
  reasoningLinebackers: string;
};

export default function CoachNotesCard({
  coverage,
  confidence,
  color,
  coverageColor,
  reasoningCornerbacks,
  reasoningSafeties,
  reasoningLinebackers,
}: CoachNotesCardProps) {
  // Map confidence color
  const confidenceColor =
    color === "green"
      ? "#16A34A" // green
      : color === "yellow"
      ? "#CA8A04" // yellow
      : color === "red"
      ? "#DC2626" // red
      : "#000000"; // black

  // Optional: slight tilt per card
//   const tilt = `${Math.random() * 4 - 2}deg`; // -2 to +2 degrees

  return (
    <div
      style={{
        width: "800px",
        height: "475px",
        backgroundColor: "#FEF3C7", // paper yellow
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
        // transform: `rotate(${tilt})`,
        fontFamily: '"Patrick Hand", cursive',
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Optional horizontal lines like a flashcard */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
             "repeating-linear-gradient(to bottom, transparent, transparent 28px, rgba(0,0,0,0.3) 29px)",
          pointerEvents: "none",
        }}
      ></div>

      {/* Coverage */}
      <p
        style={{
          fontFamily: '"Permanent Marker", cursive',
          fontSize: "2rem",
          color: coverageColor,
          marginBottom: "8px",
        }}
      >
        {coverage}
      </p>

      {/* Confidence */}
      <p
        style={{
          fontFamily: '"Permanent Marker", cursive',
          fontSize: "1.5rem",
          color: confidenceColor,
          marginBottom: "12px",
        }}
      >
        {confidence}
      </p>

      {/* Notes / Reasoning */}
      <div style={{ fontSize: "1rem", color: "#1F2937", lineHeight: "1.5" }}>
        <p>→ CBs: {reasoningCornerbacks}</p>
        <p>→ Safeties: {reasoningSafeties}</p>
        <p>→ LBs: {reasoningLinebackers}</p>
      </div>

      {/* Optional scribble / emphasis */}
      <p
        style={{
          fontFamily: '"Permanent Marker", cursive',
          color: "#1E40AF",
          position: "absolute",
          bottom: "10px",
          right: "20px",
          fontSize: "1rem",
          transform: "rotate(-3deg)",
        }}
      >
   
      </p>
    </div>
  );
}