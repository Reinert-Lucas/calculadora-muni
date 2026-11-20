import "./index.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import Calculator from "./views/Calculator";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
