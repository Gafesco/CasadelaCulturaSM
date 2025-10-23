import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Info from "./pages/Info.jsx";
import QR from "./pages/QR.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/info" element={<Info/>} />
      <Route path="/qr" element={<QR/>} />
    </Routes>
  );
}
