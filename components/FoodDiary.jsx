import { useState, useRef, useEffect } from "react";
import { api } from "../src/utils/api";
import { useFood } from "../context/FoodContext";

export default function FoodDiary() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loadingFoods, setLoadingFoods] = useState(true);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});
  const { foods, setFoods, water, setWater } = useFood();
  const waterTarget = 3000;

  // ── Load today's foods from backend on mount ──
  useEffect(() => {
    const loadToday = async () => {
      try {
        const data = await api.get("/nutrition/meal");
        // Backend returns foods array for today
        if (Array.isArray(data)) {
          // Attach base for quantity scaling
          const withBase = data.map((f) => ({
            ...f,
            fats: f.fats ?? f.fat ?? 0,
            base: {
              name: f.name,
              baseQty: f.quantity ?? 100,
              calories: f.calories,
              protein: f.protein,
              carbs: f.carbs,
              fats: f.fats ?? f.fat ?? 0,
            },
          }));
          setFoods(withBase);
        }
      } catch (err) {
        console.error("Failed to load today's foods:", err.message);
      } finally {
        setLoadingFoods(false);
      }
    };
    loadToday();
  }, []);

  // ── Search via backend proxy ──
  async function fetchFood(value) {
    if (!value.trim()) return setSuggestions([]);
    const key = value.toLowerCase();
    if (cacheRef.current[key]) {
      setSuggestions(cacheRef.current[key]);
      return;
    }

    setSearching(true);
    try {
      const data = await api.get(
        `/nutrition/food-search?q=${encodeURIComponent(value)}`,
      );
      cacheRef.current[key] = data.results ?? [];
      setSuggestions(data.results ?? []);
    } catch {
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  }

  function handleSearch(e) {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchFood(value), 400);
  }

  // ── Add food — persists to backend ──
  async function addFood(food) {
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const quantity = food.baseQty ?? 100;

    const scaled = {
      ...food,
      quantity,
      time: now,
      base: food,
      fats: food.fats ?? 0,
      calories: Math.round((food.calories * quantity) / (food.baseQty ?? 100)),
      protein: Math.round((food.protein * quantity) / (food.baseQty ?? 100)),
      carbs: Math.round((food.carbs * quantity) / (food.baseQty ?? 100)),
    };

    // Optimistic update
    setFoods([scaled, ...foods]);
    setQuery("");
    setSuggestions([]);

    try {
      await api.post("/nutrition/meal", {
        name: food.name,
        calories: scaled.calories,
        protein: scaled.protein,
        carbs: scaled.carbs,
        fat: scaled.fats,
      });
    } catch (err) {
      console.error("Failed to persist meal:", err.message);
      setFoods(foods); // roll back
    }
  }

  // ── Update quantity — local only (no per-item edit endpoint) ──
  function updateQuantity(i, qty) {
    if (qty <= 0) return;
    const updated = [...foods];
    const base = updated[i].base ?? updated[i];
    const baseQty = base.baseQty ?? base.quantity ?? 100;
    updated[i] = {
      ...updated[i],
      quantity: qty,
      calories: Math.round((base.calories * qty) / baseQty),
      protein: Math.round((base.protein * qty) / baseQty),
      carbs: Math.round((base.carbs * qty) / baseQty),
      fats: Math.round(((base.fats ?? 0) * qty) / baseQty),
    };
    setFoods(updated);
  }

  function removeFood(i) {
    setFoods(foods.filter((_, idx) => idx !== i));
  }

  // ── Water — persists to backend ──
  async function changeWater(delta) {
    const next = Math.max(0, water + delta);
    setWater(next); // optimistic
    try {
      await api.post("/nutrition/water", { amount: delta });
    } catch (err) {
      console.error("Failed to log water:", err.message);
      setWater(water); // roll back
    }
  }

  // ── Totals ──
  const totals = foods.reduce(
    (acc, f) => {
      acc.calories += f.calories ?? 0;
      acc.protein += f.protein ?? 0;
      acc.carbs += f.carbs ?? 0;
      acc.fats += f.fats ?? 0;
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
      {/* SEARCH */}
      <div className="bg-[var(--card)] p-6 rounded-xl border relative">
        <h3 className="mb-3 font-semibold">Add Food</h3>
        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search food..."
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20 text-sm focus:outline-none focus:border-[var(--primary)] transition"
        />
        {searching && (
          <p className="text-sm text-[var(--text-sub)] mt-2">Searching...</p>
        )}
        {query && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-[var(--card)] border rounded-xl shadow-lg z-20">
            {suggestions.map((f, i) => (
              <div
                key={i}
                onClick={() => addFood(f)}
                className="p-3 hover:bg-[var(--bg)] cursor-pointer text-sm"
              >
                <span className="font-medium">{f.name}</span>
                <span className="text-[var(--text-sub)] ml-2">
                  {f.calories} kcal / {f.baseQty}g
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOD LIST */}
      {loadingFoods ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : foods.length === 0 ? (
        <p className="text-sm text-[var(--text-sub)] text-center py-4">
          No food logged today. Search above to add items.
        </p>
      ) : (
        foods.map((f, i) => (
          <div
            key={i}
            className="bg-[var(--card)] p-4 rounded-xl border border-[var(--text-sub)]/20"
          >
            <div className="flex justify-between">
              <p className="font-medium">{f.name}</p>
              <span className="text-xs text-[var(--text-sub)]">{f.time}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <label className="text-xs text-[var(--text-sub)]">Qty (g)</label>
              <input
                type="number"
                value={f.quantity}
                onChange={(e) => updateQuantity(i, Number(e.target.value))}
                className="w-20 px-2 py-1 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20 text-sm"
              />
            </div>
            <p className="text-sm mt-1">
              {f.calories} kcal • P: {f.protein}g C: {f.carbs}g F: {f.fats}g
            </p>
            <button
              onClick={() => removeFood(i)}
              className="text-red-500 text-sm mt-1 hover:underline"
            >
              Remove
            </button>
          </div>
        ))
      )}

      {/* MACRO BREAKDOWN — fixed flex row */}
      <div className="bg-[var(--card)] p-6 rounded-xl border">
        <h3 className="mb-3 font-semibold">Macro Breakdown</h3>
        <div className="w-full h-3 bg-[var(--text-sub)]/20 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${macroPercent.protein}%` }}
          />
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${macroPercent.carbs}%` }}
          />
          <div
            className="h-full bg-yellow-500 transition-all duration-500"
            style={{ width: `${macroPercent.fats}%` }}
          />
        </div>
        <div className="flex gap-4 text-sm mt-2 flex-wrap">
          <span className="text-blue-500">
            ● Protein {Math.round(macroPercent.protein)}%
          </span>
          <span className="text-green-500">
            ● Carbs {Math.round(macroPercent.carbs)}%
          </span>
          <span className="text-yellow-500">
            ● Fats {Math.round(macroPercent.fats)}%
          </span>
        </div>
      </div>

      {/* WATER */}
      <div className="bg-[var(--card)] p-6 rounded-xl border">
        <h3 className="mb-3 font-semibold">Water Intake</h3>
        <div className="w-full h-3 bg-[var(--text-sub)]/20 rounded-full overflow-hidden">
          <div
            className="h-3 bg-[var(--primary)] rounded-full transition-all duration-500"
            style={{ width: `${waterProgress}%` }}
          />
        </div>
        <p className="text-sm mt-2">
          {water} / {waterTarget} ml
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => changeWater(250)}
            className="bg-[var(--primary)] text-black px-3 py-1 rounded font-medium hover:scale-105 transition"
          >
            +250ml
          </button>
          <button
            onClick={() => changeWater(-250)}
            className="border px-3 py-1 rounded hover:bg-[var(--bg)] transition"
          >
            -250ml
          </button>
        </div>
      </div>

      {/* TOTALS */}
      <div className="bg-[var(--card)] p-4 rounded-xl border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-[var(--primary)]">
              {totals.calories}
            </p>
            <p className="text-xs text-[var(--text-sub)]">Calories</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-500">{totals.protein}g</p>
            <p className="text-xs text-[var(--text-sub)]">Protein</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-500">{totals.carbs}g</p>
            <p className="text-xs text-[var(--text-sub)]">Carbs</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-500">{totals.fats}g</p>
            <p className="text-xs text-[var(--text-sub)]">Fats</p>
          </div>
        </div>
      </div>
    </div>
  );
}
