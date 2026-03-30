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

        <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--text-sub)]/20 text-center text-[var(--text-sub)]">
          No data yet. Log your first workout 🚀
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">Workout Performance</h3>

      <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--text-sub)]/20 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {/* Gradient */}
            <defs>
              <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor="var(--secondary)"
                  stopOpacity={0.6}
                />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid stroke="var(--text-sub)" strokeDasharray="3 3" />

            {/* Axes */}
            <XAxis
              dataKey="date"
              stroke="var(--text-sub)"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="var(--text-sub)"
              domain={[0, 10]}
              tick={{ fontSize: 12 }}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--text-sub)",
                borderRadius: "10px",
                color: "var(--text-main)",
              }}
              labelStyle={{ color: "var(--text-sub)" }}
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="rating"
              stroke="url(#colorRating)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--primary)" }}
              activeDot={{
                r: 6,
                stroke: "var(--primary)",
                strokeWidth: 2,
                fill: "var(--bg)",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
