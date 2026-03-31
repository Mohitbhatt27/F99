export default function ProgressRing({ value, label }) {
  const radius = 40;
  const stroke = 6;
  const normalized = radius - stroke;
  const circumference = normalized * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalized}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="var(--primary)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={normalized}
          cx={radius}
          cy={radius}
        />
      </svg>

      <p className="text-sm mt-2">{label}</p>
      <p className="text-xs text-[var(--text-sub)]">{value}%</p>
    </div>
  );
}
