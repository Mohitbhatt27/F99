import { useState } from "react";

export default function Profile() {
  const [open, setOpen] = useState(false);

  const [data, setData] = useState({
    age: 20,
    weight: 69.5,
    bodyFat: 15,
    steps: 17000,
    frequency: 5,
  });

  const [form, setForm] = useState(data);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    setData(form);
    setOpen(false);
  }

  return (
    <div className="w-full min-h-screen bg-[#0B0F14] text-[#E6EDF3] px-6 md:px-12 py-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#00D1FF] shadow-[0_0_15px_#00D1FF]">
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <div>
            <h1 className="text-3xl font-bold">Siddhartha</h1>
            <p className="text-[#8B98A5]">Fitness Enthusiast • Student</p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setOpen(true)}
          className="bg-[#00D1FF] text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 transition"
        >
          Edit Profile
        </button>
      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-6">
        <Stat label="Age" value={data.age} />
        <Stat label="Weight" value={`${data.weight} kg`} />
        <Stat label="Body Fat" value={`${data.bodyFat}%`} />
        <Stat label="Steps/day" value={data.steps} />
        <Stat label="Training" value={`${data.frequency}x/week`} />
      </div>

      {/* Goals */}
      <div className="mt-14">
        <h2 className="text-xl font-semibold mb-4">Current Goals</h2>

        <div className="bg-[#121821] p-6 rounded-xl border border-[#1f2933] space-y-5">
          {goals.map((g, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span>{g.title}</span>
                <span className="text-[#8B98A5]">{g.progress}%</span>
              </div>

              <div className="w-full h-2 bg-[#1f2933] rounded-full">
                <div
                  className="h-2 rounded-full bg-[#00FF88]"
                  style={{ width: `${g.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strength */}
      <div className="mt-14">
        <h2 className="text-xl font-semibold mb-4">Strength Stats</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {strength.map((s, i) => (
            <div
              key={i}
              className="bg-[#121821] p-6 rounded-xl border border-[#1f2933]"
            >
              <p className="text-[#8B98A5] text-sm">{s.label}</p>
              <p className="text-2xl font-bold mt-2 text-[#7C5CFF]">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#121821] p-8 rounded-2xl w-[90%] max-w-md border border-[#1f2933] shadow-2xl">
            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

            <div className="space-y-4">
              <Input
                label="Age"
                name="age"
                value={form.age}
                onChange={handleChange}
              />
              <Input
                label="Weight (kg)"
                name="weight"
                value={form.weight}
                onChange={handleChange}
              />
              <Input
                label="Body Fat (%)"
                name="bodyFat"
                value={form.bodyFat}
                onChange={handleChange}
              />
              <Input
                label="Steps/day"
                name="steps"
                value={form.steps}
                onChange={handleChange}
              />
              <Input
                label="Training Frequency"
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#1f2933] text-[#8B98A5]"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="bg-[#00FF88] text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-10" />
    </div>
  );
}

/* Internal Components */

function Stat({ label, value }) {
  return (
    <div className="bg-[#121821] p-5 rounded-xl border border-[#1f2933] text-center">
      <p className="text-2xl font-bold text-[#00D1FF]">{value}</p>
      <p className="text-[#8B98A5] text-sm mt-1">{label}</p>
    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-[#8B98A5]">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 px-3 py-2 rounded-lg bg-[#0B0F14] border border-[#1f2933] focus:outline-none focus:border-[#00D1FF]"
      />
    </div>
  );
}

const goals = [
  { title: "Cut to 8% Body Fat", progress: 55 },
  { title: "Bench 100kg", progress: 60 },
  { title: "OHP 60kg", progress: 75 },
];

const strength = [
  { label: "Bench Press", value: "80 kg x1" },
  { label: "Overhead Press", value: "55 kg x6" },
  { label: "Bodyweight", value: "69.5 kg" },
];
