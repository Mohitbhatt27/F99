export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function formatMeal(meal) {
  return {
    _id: meal._id,
    name: meal.name,
    calories: meal.calories,
    protein: meal.protein || 0,
    carbs: meal.carbs || 0,
    fats: meal.fat || 0, // match frontend naming
    date: formatDate(meal.date),
  };
}

export function formatProgress(entry) {
  return {
    _id: entry._id,
    date: formatDate(entry.date),
    rating: entry.rating,
    note: entry.note,
    mood: entry.mood || "😐",
  };
}
