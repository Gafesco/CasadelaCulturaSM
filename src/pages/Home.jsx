import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="hero">
        <h1>Casa de la Cultura Sanmartineca</h1>
      </div>

      <main className="container">
        <div className="stack">
          <Link className="btn primary" to="/info">Ver información</Link>
          <Link className="btn primary" to="/qr">QR</Link>
          <button className="btn danger" onClick={handleExit}>Salir</button>
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
