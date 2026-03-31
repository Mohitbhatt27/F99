import { useState } from "react";

export default function MealSection({ title, foods }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-[var(--card)] rounded-xl border">
      <div
        onClick={() => setOpen(!open)}
        className="p-4 cursor-pointer flex justify-between"
      >
        <h3>{title}</h3>
        <span>{open ? "−" : "+"}</span>
      </div>

      {open && (
        <div className="p-4 space-y-2">
          {foods.map((f, i) => (
            <div key={i} className="text-sm flex justify-between">
              <span>{f.name}</span>
              <span>{f.calories} kcal</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
