import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const emptyForm = {
  id: null,
  name: "",
  tier: 1,
  cost: 0,
  max_amount: 1,
  is_electronic: false,
  is_consumable: false,
  description: "",
};

export default function CrudHerramientas() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch(`${API_BASE}/items`);
      if (!resp.ok) throw new Error("No se pudieron cargar las herramientas");
      const data = await resp.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      tier: Number(form.tier),
      cost: Number(form.cost),
      max_amount: Number(form.max_amount),
      is_electronic: Boolean(form.is_electronic),
      is_consumable: Boolean(form.is_consumable),
      description: form.description,
    };

    try {
      setError(null);
      const url = form.id ? `${API_BASE}/items/${form.id}` : `${API_BASE}/items`;
      const method = form.id ? "PUT" : "POST";
      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error("No se pudo guardar el registro");
      await loadItems();
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    }
  };

  const editRow = (item) => setForm({ ...item });

  const deleteRow = async (id) => {
    try {
      setError(null);
      const resp = await fetch(`${API_BASE}/items/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("No se pudo eliminar el registro");
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-cyan-100" style={{ fontFamily: '"Special Elite", monospace' }}>
          CRUD de herramientas
        </h2>
        <p className="text-slate-300">Datos conectados a la tabla <code>items</code> de la base de datos.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-800 bg-[#0f162b] p-5 shadow-lg shadow-cyan-500/10 space-y-3"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-slate-200 sm:col-span-2">
              Nombre
              <input
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-500/20"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label className="text-sm text-slate-200">
              Tier (1-3)
              <input
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-500/20"
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
                type="number"
                min="1"
                max="3"
                required
              />
            </label>
            <label className="text-sm text-slate-200">
              Costo
              <input
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-500/20"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                type="number"
                min="0"
                required
              />
            </label>
            <label className="text-sm text-slate-200">
              Cantidad máxima
              <input
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-500/20"
                value={form.max_amount}
                onChange={(e) => setForm({ ...form, max_amount: e.target.value })}
                type="number"
                min="1"
                required
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={form.is_electronic}
                onChange={(e) => setForm({ ...form, is_electronic: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900/60 text-cyan-500 focus:ring-cyan-500/40"
              />
              Es electrónico
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={form.is_consumable}
                onChange={(e) => setForm({ ...form, is_consumable: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900/60 text-cyan-500 focus:ring-cyan-500/40"
              />
              Es consumible
            </label>
            <label className="text-sm text-slate-200 sm:col-span-2">
              Descripción
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-500/20"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:bg-cyan-400"
            >
              {form.id ? "Actualizar" : "Crear"}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={() => setForm(emptyForm)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-100"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="rounded-2xl border border-slate-800 bg-[#0f162b] p-5 shadow-lg shadow-cyan-500/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-cyan-100">Listado</h3>
            {loading && <span className="text-xs text-slate-400">Cargando...</span>}
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Tier</th>
                  <th className="px-3 py-2">Costo</th>
                  <th className="px-3 py-2">Máx.</th>
                  <th className="px-3 py-2">Electrónica</th>
                  <th className="px-3 py-2">Consumible</th>
                  <th className="px-3 py-2">Descripción</th>
                  <th className="px-3 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                    <td className="px-3 py-2 text-slate-300">{item.id}</td>
                    <td className="px-3 py-2 text-slate-100">{item.name}</td>
                    <td className="px-3 py-2">{item.tier}</td>
                    <td className="px-3 py-2">${item.cost}</td>
                    <td className="px-3 py-2">{item.max_amount}</td>
                    <td className="px-3 py-2">{item.is_electronic ? "Sí" : "No"}</td>
                    <td className="px-3 py-2">{item.is_consumable ? "Sí" : "No"}</td>
                    <td className="px-3 py-2 max-w-xs truncate" title={item.description || ""}>
                      {item.description}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editRow(item)}
                          className="rounded-lg border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-100 transition hover:border-cyan-400"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setConfirmDelete(item)}
                          className="rounded-lg border border-red-400/60 px-2 py-1 text-xs font-semibold text-red-200 transition hover:bg-red-500/10"
                        >
                          Borrar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-center text-slate-400" colSpan={9}>
                      Sin registros todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
          <div className="w-full max-w-md rounded-2xl border border-red-500/40 bg-[#0b1020] p-6 shadow-2xl shadow-red-500/30">
            <h3 className="text-xl font-semibold text-red-200">Confirmar eliminación</h3>
            <p className="mt-2 text-sm text-slate-200">
              ¿Eliminar la herramienta <span className="font-semibold text-red-100">{confirmDelete.name}</span>?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-100"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await deleteRow(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-red-500/30 transition hover:-translate-y-0.5 hover:bg-red-400"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
