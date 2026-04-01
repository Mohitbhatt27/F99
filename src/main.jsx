import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "../pages/LandingPage.jsx";
import Login from "../pages/LoginPage.jsx";
import Signup from "../pages/SignUpPage.jsx";
import Profile from "../components/Profile.jsx";
import FoodDiary from "../components/FoodDiary.jsx";
import { FoodProvider } from "../context/FoodContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else if (!savedTheme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) {
    document.documentElement.classList.add("dark");
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },

      // Protected
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/food",
        element: (
          <ProtectedRoute>
            <FoodDiary />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FoodProvider>
      <RouterProvider router={router} />
    </FoodProvider>
  </StrictMode>,
);
