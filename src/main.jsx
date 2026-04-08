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
import ForgotPassword from "../pages/ForgotPassword";
import ProgressPhotos from "../pages/ProgressPhotos";
import ResetPassword from "../pages/ResetPassword";
import EditProfile from "../pages/EditProfile";
import NotFound from "../pages/NotFound";
import Contact from "../pages/Contact";
import Logs from "../pages/Logs";

//  FIXED IMPORTS
import Programs from "../pages/Programs";
import Workout from "../pages/Workout";
import RouteErrorBoundary from "./routes/RouteErrorBoundary";

//  Theme handling
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else if (!savedTheme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) {
    document.documentElement.classList.add("dark");
  }
}

//  Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorBoundary />,
    children: [
      // Public routes
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/signup",
        element: <Signup />
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "/reset-password",
        element: <ResetPassword />
      },
      {
        path: "/contact",
        element: <Contact />
      },

      // Protected routes
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: "/edit-profile",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        )
      },
      {
        path: "/food",
        element: (
          <ProtectedRoute>
            <FoodDiary />
          </ProtectedRoute>
        )
      },
      {
        path: "/progress-photos",
        element: (
          <ProtectedRoute>
            <ProgressPhotos />
          </ProtectedRoute>
        )
      },

      //  NEW FEATURES (Protected)
      {
        path: "/programs",
        element: (
          <ProtectedRoute>
            <Programs />
          </ProtectedRoute>
        )
      },
      {
        path: "/workout",
        element: (
          <ProtectedRoute>
            <Workout />
          </ProtectedRoute>
        )
      },
      {
        path: "/llogs",
        element: (
          <ProtectedRoute>
            <Logs />
          </ProtectedRoute>
        )
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);

//  App render
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FoodProvider>
      <RouterProvider router={router} />
    </FoodProvider>
  </StrictMode>
);
