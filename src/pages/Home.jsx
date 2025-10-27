import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="hero">
        <h1>CASA DE LA CULTURA SANMARTINECA</h1>
      </div>

      <main className="container">
        <div className="stack">
          <Link className="btn primary" to="/info">VER INFORMACIÓN</Link>
          <Link className="btn primary" to="/qr">ESCANEAR QR (CASA DE LA CULTURA)</Link>
          <button className="btn danger" onClick={handleExit}>SALIR</button>
        </div>

        {/* 🔹 Imagen inferior centrada */}
        <div className="menu-logo">
          <img
            src="/img/casadelacultura.png"
            alt="Logo Casa de la Cultura Sanmartineca"
            className="menu-logo-img"
            loading="lazy"
          />
        </div>
      </main>
    </>
  );
}

async function handleExit() {
  const isNative = typeof window !== "undefined"
    && window?.Capacitor?.isNativePlatform
    && window.Capacitor.isNativePlatform();

  if (isNative) {
    try {
      const { App } = await import(/* @vite-ignore */ "@capacitor/app");
      App.exitApp();
      return;
    } catch {}
  }
  alert("Para cerrar completamente, usa el botón Atrás del teléfono o cierra la app desde el sistema. El botón 'Salir' sólo funciona en la app nativa (APK).");
}
