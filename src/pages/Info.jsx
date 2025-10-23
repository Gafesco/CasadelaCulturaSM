import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllExhibits, getExhibitById } from "../lib/dataService";
import Header from "../components/Header";

export default function Info() {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const [items, setItems] = useState(null);
  const [sel, setSel] = useState(null);

  // ¿venimos desde el escáner?
  const fromQR = sp.get("from") === "qr";

  useEffect(() => {
    const id = sp.get("id");
    (async () => {
      if (id) {
        setSel(await getExhibitById(id));
        setItems(null);
      } else {
        setSel(null);
        setItems(await getAllExhibits());
      }
    })();
  }, [sp]);

  // -------- DETALLE --------
  if (sel) {
    return (
      <>
        <Header
          title={sel.titulo}
          home={true}
          list={!fromQR}
          scanAgain={fromQR}
        />
        <main className="container with-header">
          {sel.imagen && (
            <div className="exhibit-frame" aria-label={`Imagen de ${sel.titulo}`}>
              <img
                className="exhibit-img"
                src={sel.imagen}
                alt={sel.titulo}
                loading="lazy"
                decoding="async"
              />
            </div>
          )}

          {/* leyenda bajo la imagen si está en datos */}
          {sel.creditos && <p className="caption">{sel.creditos}</p>}

          {/* descripción larga; respeta \n\n como párrafos (ver CSS .desc) */}
          <p className="desc" style={{ marginTop: 12 }}>{sel.descripcion}</p>
        </main>
      </>
    );
  }

  // -------- LISTA --------
  if (items === null) {
    return (
      <>
        <Header title="Sala Virtual" home={true} />
        <main className="container with-header"><p>Cargando catálogo…</p></main>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header title="Sala Virtual" home={true} />
        <main className="container with-header">
          <p>No hay piezas para mostrar. Revisa <code>public/data/exhibits.json</code>.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Sala Virtual" home={true} />
      <main className="container with-header">
        <ul className="cards">
          {items.map((x) => (
            <li
              key={x.id}
              className="card"
              role="button"
              tabIndex={0}
              onClick={() => nav(`/info?id=${encodeURIComponent(x.id)}`)}
              onKeyDown={(e) => { if (e.key === "Enter") nav(`/info?id=${encodeURIComponent(x.id)}`); }}
            >
              {x.imagen && (
                <img
                  className="card-img"
                  src={x.imagen}
                  alt={x.titulo}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <div className="card-body">
                <h3 className="card-title">{x.titulo}</h3>
                <p className="card-snippet clamp-2">
                  {x.descripcion || "Ver detalle"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
