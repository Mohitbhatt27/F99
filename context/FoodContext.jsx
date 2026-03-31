import { createContext, useContext, useState } from "react";

const FoodContext = createContext();

export function FoodProvider({ children }) {
  const [foods, setFoods] = useState([]);
  const [water, setWater] = useState(0);

  return (
    <FoodContext.Provider value={{ foods, setFoods, water, setWater }}>
      {children}
    </FoodContext.Provider>
  );
}

export function useFood() {
  return useContext(FoodContext);
}
