// src/lib/dataService.js
const URL = "/data/exhibits.json";
let cache;

export async function getAllExhibits() {
  if (cache) return cache;
  try {
    const res = await fetch(URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    try {
      cache = JSON.parse(text);
    } catch (e) {
      console.error("Contenido no es JSON. Respuesta fue:\n", text);
      throw e;
    }
  } catch (err) {
    console.error("Error cargando exhibits.json:", err);
    cache = [];
  }
  return cache;
}

export async function getExhibitById(id) {
  const list = await getAllExhibits();
  return list.find(x => x.id === id);
}
