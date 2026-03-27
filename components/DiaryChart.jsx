import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DiaryChart({ entries }) {
  const data = entries
    .slice()
    .reverse()
    .map((e) => ({
      date: e.date.split("/").slice(0, 2).join("/"),
      rating: Number(e.rating),
    }));

  if (data.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">Workout Performance</h3>

      <div className="bg-[#121821] p-4 rounded-xl border border-[#1f2933] h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#8B98A5" />
            <YAxis stroke="#8B98A5" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#00D1FF"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
