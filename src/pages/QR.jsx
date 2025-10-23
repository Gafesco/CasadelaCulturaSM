import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getExhibitById } from "../lib/dataService";

export default function QR() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const readerRef = useRef(null);
  const nav = useNavigate();

  // Mensaje fijo de ayuda + error sólo cuando el QR no es válido
  const [msg] = useState("Apunta la cámara a un código QR dentro de la Casa de la Cultura");
  const [error, setError] = useState("");

  // Pequeño “rate limit” para no disparar muchos errores seguidos
  const errorCooldownRef = useRef(0);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;
    let stopFlag = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const loop = async () => {
          if (stopFlag) return;
          try {
            const res = await reader.decodeOnceFromVideoDevice(undefined, videoRef.current);
            const text = (res?.getText?.() || "").trim();

            // Validar si el QR existe en el catálogo
            const exhibit = await getExhibitById(text);

            if (exhibit) {
              stopCamera();
              nav(`/info?id=${encodeURIComponent(text)}&from=qr`);
            } else {
              const now = Date.now();
              if (now - errorCooldownRef.current > 1200) {
                errorCooldownRef.current = now;
                setError("QR no válido. Por favor, escanea un código de la Casa de la Cultura Sanmartineca.");
                setTimeout(() => setError(""), 1700);
              }
              setTimeout(loop, 260);
            }
          } catch {
            // No se detectó aún: seguir intentando
            setTimeout(loop, 240);
          }
        };

        loop();
      } catch (e) {
        console.error(e);
        setError("No se pudo acceder a la cámara. Revisá permisos.");
      }
    })();

    return () => {
      stopFlag = true;
      stopCamera();
    };
  }, [nav]);

  const stopCamera = () => {
    try { readerRef.current?.reset?.(); } catch {}
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.load();
    }
  };

  return (
    <>
      {/* Título SIN tilde: “Escanear” */}
      <Header title="Escanear QR" home={true} />
      <main className="container with-header">
        {/* Aviso principal */}
        <div className="notice">
          <span className="notice-icon" aria-hidden>📷</span>
          <div className="notice-text">
            <strong>{msg}</strong>
          </div>
        </div>

        {/* Aviso de error SOLO si el QR es inválido */}
        {error && (
          <div className="notice error" role="alert">
            <span className="notice-icon" aria-hidden>⚠️</span>
            <div className="notice-text">
              <strong>{error}</strong>
            </div>
          </div>
        )}

        {/* Visor de cámara */}
        <div className="qr-frame">
          <video
            ref={videoRef}
            playsInline
            muted
            className="qr-video"
            aria-label="Visor de cámara para lectura de QR"
          />
        </div>
      </main>
    </>
  );
}
