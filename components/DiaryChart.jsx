import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DiaryChart({ entries }) {
  const data = entries
    .slice()
    .reverse()
    .map((e) => ({
      date: e.date.split("/").slice(0, 2).join("/"),
      rating: Number(e.rating),
    }));

  if (data.length === 0) {
    return (
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Workout Performance</h3>

        <div className="bg-[#121821] p-6 rounded-xl border border-[#1f2933] text-center text-[#8B98A5]">
          No data yet. Log your first workout 🚀
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">Workout Performance</h3>

      <div className="bg-[#121821] p-4 rounded-xl border border-[#1f2933] h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {/*  Gradient */}
            <defs>
              <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D1FF" stopOpacity={1} />
                <stop offset="100%" stopColor="#7C5CFF" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" />

            {/* Axes */}
            <XAxis dataKey="date" stroke="#8B98A5" tick={{ fontSize: 12 }} />
            <YAxis stroke="#8B98A5" domain={[0, 10]} tick={{ fontSize: 12 }} />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#121821",
                border: "1px solid #1f2933",
                borderRadius: "10px",
                color: "#E6EDF3",
              }}
              labelStyle={{ color: "#8B98A5" }}
            />

            {/*  Main Line */}
            <Line
              type="monotone"
              dataKey="rating"
              stroke="url(#colorRating)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#00D1FF" }}
              activeDot={{
                r: 6,
                stroke: "#00D1FF",
                strokeWidth: 2,
                fill: "#0B0F14",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
