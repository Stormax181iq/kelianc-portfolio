import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { adminApi } from "./api/client";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [auth, setAuth] = useState<"loading" | "in" | "out">("loading");

  useEffect(() => {
    adminApi
      .me()
      .then(() => setAuth("in"))
      .catch(() => setAuth("out"));
  }, []);

  if (auth === "loading") return <p className="loading">Loading…</p>;
  return (
    <Routes>
      <Route path="/login" element={auth === "in" ? <Navigate to="/" replace /> : <Login onLogin={() => setAuth("in")} />} />
      <Route path="/" element={auth === "in" ? <Dashboard onLogout={() => setAuth("out")} /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
