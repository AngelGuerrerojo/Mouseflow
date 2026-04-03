import { useEffect, useState } from "react";
import { dictionaryApi } from "../lib/api";

export default function Dictionary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const load = async (query = "") => {
    try {
      setLoading(true);
      setError("");
      const data = await dictionaryApi.search(query);
      setItems(data);
    } catch (err) {
      setError(err.message || "Error al cargar el diccionario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("");
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-primary mb-1">Diccionario</h2>
          <p className="text-secondary mb-0">Conceptos clave para repasar rápido.</p>
        </div>
        <div className="mt-3 mt-md-0">
          <form
            className="d-flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              load(q);
            }}
          >
            <input
              type="search"
              className="form-control"
              placeholder="Buscar palabra o definición..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>
              Buscar
            </button>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p className="text-secondary">Cargando diccionario...</p>
      ) : items.length === 0 ? (
        <p className="text-secondary">No se encontraron entradas.</p>
      ) : (
        <div className="list-group">
          {items.map((item) => (
            <div key={item.id_concepto} className="list-group-item">
              <div className="fw-bold text-dark">{item.palabra}</div>
              <div className="text-muted small">{item.definicion}</div>
              {item.ejemplo_codigo && (
                <pre className="bg-light border rounded p-2 mt-2 mb-0 small text-secondary">
                  {item.ejemplo_codigo}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
