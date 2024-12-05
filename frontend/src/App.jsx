import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  NotificationPage,
  ProfilePage,
  SignUpPage,
} from "./pages/pages.js";
import {
  LoadingSpinner,
  RightPanel,
  Sidebar,
} from "./components/components.js";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

function App() {
  // ............data fetching.....................//
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.error) return null;
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        // console.log("authUser is here:", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // .................This is the JSX return part.......................//
  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notificatios"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
