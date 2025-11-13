export default function StationBadge({ code, lineColor = "#000" }) {
  if (!code) return null;

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      style={{ pointerEvents: "none" }}
    >
      <circle cx="6" cy="6" r="5" fill={lineColor} />
      <text
        x="50%"
        y="50%"
        fill="#000"  
        fontSize="3.5"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {code}
      </text>
    </svg>
  );
}
