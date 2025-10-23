import { useNavigate } from "react-router-dom";

export default function Header({ title, home=false, list=false, scanAgain=false }) {
  const nav = useNavigate();
  return (
    <header className="app-header">
      <div className="header-left">
        {home && <button className="chip" onClick={() => nav("/")}>← Menú</button>}
        {list && <button className="chip" onClick={() => nav("/info")}>← Lista</button>}
        {scanAgain && <button className="chip" onClick={() => nav("/qr")}>Escanear otro QR</button>}
      </div>

      <div className="brand">
        {/* Si luego añades el PNG del logo: /public/img/logo-cc.png */}
        {/* <img className="brand-logo" src="/img/logo-cc.png" alt="Casa de la Cultura" /> */}
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-right" />
    </header>
  );
}
