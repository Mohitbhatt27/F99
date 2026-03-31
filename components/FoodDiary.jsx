import { useState, useEffect, useRef } from "react";
import { useFood } from "../context/FoodContext";
const API_KEY = import.meta.env.VITE_USDA_API_KEY;

export default function FoodDiary() {
  const today = new Date().toLocaleDateString();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});
  const { foods, setFoods, water, setWater } = useFood();
  const waterTarget = 3000;

  /* 🔥 FETCH */
  async function fetchFood(value) {
    if (!value) return setSuggestions([]);

    if (cacheRef.current[value]) {
      setSuggestions(cacheRef.current[value]);
      return;
    }

    const res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${value}&api_key=${API_KEY}`,
    );

    const data = await res.json();

    const results = data.foods.slice(0, 6).map((food) => {
      const nutrients = food.foodNutrients || [];

      const get = (name) =>
        nutrients.find((n) => n.nutrientName === name)?.value || 0;

      return {
        name: food.description,
        baseQty: food.servingSize || 100,
        calories: get("Energy"),
        protein: get("Protein"),
        carbs: get("Carbohydrate, by difference"),
        fats: get("Total lipid (fat)"),
      };
    });

    cacheRef.current[value] = results;
    setSuggestions(results);
  }

  function handleSearch(e) {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchFood(value), 400);
  }

  /* 🔥 ADD FOOD */
  function addFood(food) {
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const quantity = food.baseQty;

    const scaled = {
      ...food,
      quantity,
      time: now,
      base: food,
      calories: Math.round((food.calories * quantity) / food.baseQty),
      protein: Math.round((food.protein * quantity) / food.baseQty),
      carbs: Math.round((food.carbs * quantity) / food.baseQty),
      fats: Math.round((food.fats * quantity) / food.baseQty),
    };

    setFoods([scaled, ...foods]);
    setQuery("");
    setSuggestions([]);
  }

  function updateQuantity(i, qty) {
    if (qty <= 0) return;

    const updated = [...foods];
    const base = updated[i].base;

    updated[i] = {
      ...updated[i],
      quantity: qty,
      calories: Math.round((base.calories * qty) / base.baseQty),
      protein: Math.round((base.protein * qty) / base.baseQty),
      carbs: Math.round((base.carbs * qty) / base.baseQty),
      fats: Math.round((base.fats * qty) / base.baseQty),
    };

    setFoods(updated);
  }

  function removeFood(i) {
    setFoods(foods.filter((_, idx) => idx !== i));
  }

  /* 🔥 TOTALS */
  const totals = foods.reduce(
    (acc, f) => {
      acc.calories += f.calories;
      acc.protein += f.protein;
      acc.carbs += f.carbs;
      acc.fats += f.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  );

  const totalMacros = totals.protein + totals.carbs + totals.fats;

  const macroPercent = {
    protein: totalMacros ? (totals.protein / totalMacros) * 100 : 0,
    carbs: totalMacros ? (totals.carbs / totalMacros) * 100 : 0,
    fats: totalMacros ? (totals.fats / totalMacros) * 100 : 0,
  };

  const waterProgress = Math.min(100, (water / waterTarget) * 100);

  return (
    <div className="space-y-10 mt-10">
      {/* 🔍 SEARCH */}
      <div className="bg-[var(--card)] p-6 rounded-xl border relative">
        <h3 className="mb-3 font-semibold">Add Food</h3>

        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search food..."
          className="input w-full"
        />

        {query && (
          <div className="absolute left-0 right-0 mt-2 bg-[var(--card)] border rounded-xl shadow-lg z-20">
            {suggestions.map((f, i) => (
              <div
                key={i}
                onClick={() => addFood(f)}
                className="p-3 hover:bg-[var(--bg)] cursor-pointer"
              >
                {f.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🍽 FOOD LIST */}
      {foods.map((f, i) => (
        <div key={i} className="bg-[var(--card)] p-4 rounded-xl border">
          <div className="flex justify-between">
            <p className="font-medium">{f.name}</p>
            <span className="text-xs text-[var(--text-sub)]">{f.time}</span>
          </div>

          <input
            type="number"
            value={f.quantity}
            onChange={(e) => updateQuantity(i, Number(e.target.value))}
            className="input w-20 mt-2"
          />

          <p className="text-sm">
            {f.calories} kcal • P:{f.protein} C:{f.carbs} F:{f.fats}
          </p>

          <button
            onClick={() => removeFood(i)}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      {/* 📊 MACRO BREAKDOWN */}
      <div className="bg-[var(--card)] p-6 rounded-xl border">
        <h3 className="mb-3 font-semibold">Macro Breakdown</h3>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${macroPercent.protein}%` }}
          />
          <div
            className="h-full bg-green-500"
            style={{ width: `${macroPercent.carbs}%` }}
          />
          <div
            className="h-full bg-yellow-500"
            style={{ width: `${macroPercent.fats}%` }}
          />
        </div>

        <div className="text-sm mt-2">
          Protein {Math.round(macroPercent.protein)}% • Carbs{" "}
          {Math.round(macroPercent.carbs)}% • Fats{" "}
          {Math.round(macroPercent.fats)}%
        </div>
      </div>

      {/* 💧 WATER LOGGER */}
      <div className="bg-[var(--card)] p-6 rounded-xl border">
        <h3 className="mb-3 font-semibold">Water Intake</h3>

        <div className="w-full h-3 bg-gray-200 rounded-full">
          <div
            className="h-3 bg-[var(--primary)] rounded-full"
            style={{ width: `${waterProgress}%` }}
          />
        </div>

        <p className="text-sm mt-2">
          {water} / {waterTarget} ml
        </p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setWater(water + 250)}
            className="bg-[var(--primary)] px-3 py-1 rounded"
          >
            +250ml
          </button>

          <button
            onClick={() => setWater(Math.max(0, water - 250))}
            className="border px-3 py-1 rounded"
          >
            -250ml
          </button>
        </div>
      </div>

      {/* 📊 TOTAL */}
      <div className="bg-[var(--card)] p-4 rounded-xl border">
        <p>Total Calories: {totals.calories}</p>
      </div>
    </div>
  );
}
