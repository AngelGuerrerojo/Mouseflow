import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const emptyForm = {
  id: null,
  map_name: "",
  player_count: 1,
  bone_found: false,
  ghost_guessed: false,
  players_dead: 0,
  match_date: "",
};

export default function CrudFantasmas() {
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch(`${API_BASE}/match-history`);
      if (!resp.ok) throw new Error("No se pudo cargar el historial");
      const data = await resp.json();
      setMatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      map_name: form.map_name,
      player_count: Number(form.player_count),
      bone_found: Boolean(form.bone_found),
      ghost_guessed: Boolean(form.ghost_guessed),
      players_dead: Number(form.players_dead),
      match_date: form.match_date ? new Date(form.match_date).toISOString() : new Date().toISOString(),
    };

    try {
      setError(null);
      const url = form.id ? `${API_BASE}/match-history/${form.id}` : `${API_BASE}/match-history`;
      const method = form.id ? "PUT" : "POST";
      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error("No se pudo guardar el registro");
      await loadMatches();
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    }
  };

  const editRow = (match) =>
    setForm({
      ...match,
      match_date: match.match_date ? new Date(match.match_date).toISOString().slice(0, 16) : "",
    });

  const deleteRow = async (id) => {
    try {
      setError(null);
      const resp = await fetch(`${API_BASE}/match-history/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("No se pudo eliminar el registro");
      await loadMatches();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }) : "—";

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-cyan-100" style={{ fontFamily: '"Special Elite", monospace' }}>
          Historial de partidas
        </h2>
        <p className="text-slate-300">
          Operando directamente sobre la tabla <code>match_history</code>.
        </p>
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
              Nombre del mapa
              <input
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-500/20"
                value={form.map_name}
                onChange={(e) => setForm({ ...form, map_name: e.target.value })}
                required
              />
            </label>
            <label className="text-sm text-slate-200">
              Jugadores
              <input
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-500/20"
                value={form.player_count}
                onChange={(e) => setForm({ ...form, player_count: e.target.value })}
                type="number"
                min="1"
                max="4"
                required
              />
            </label>
            <label className="text-sm text-slate-200">
              Jugadores muertos
              <input
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-500/20"
                value={form.players_dead}
                onChange={(e) => setForm({ ...form, players_dead: e.target.value })}
                type="number"
                min="0"
                max="4"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={form.bone_found}
                onChange={(e) => setForm({ ...form, bone_found: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900/60 text-cyan-500 focus:ring-cyan-500/40"
              />
              Se encontró el hueso
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={form.ghost_guessed}
                onChange={(e) => setForm({ ...form, ghost_guessed: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900/60 text-cyan-500 focus:ring-cyan-500/40"
              />
              Se adivinó el fantasma
            </label>
            <label className="text-sm text-slate-200 sm:col-span-2">
              Fecha de la partida
              <input
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-500/20"
                type="datetime-local"
                value={form.match_date}
                onChange={(e) => setForm({ ...form, match_date: e.target.value })}
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
                  <th className="px-3 py-2">Mapa</th>
                  <th className="px-3 py-2">Jugadores</th>
                  <th className="px-3 py-2">Hueso</th>
                  <th className="px-3 py-2">Fantasma</th>
                  <th className="px-3 py-2">Muertos</th>
                  <th className="px-3 py-2">Fecha</th>
                  <th className="px-3 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                    <td className="px-3 py-2 text-slate-300">{match.id}</td>
                    <td className="px-3 py-2 text-slate-100">{match.map_name}</td>
                    <td className="px-3 py-2">{match.player_count}</td>
                    <td className="px-3 py-2">{match.bone_found ? "Sí" : "No"}</td>
                    <td className="px-3 py-2">{match.ghost_guessed ? "Sí" : "No"}</td>
                    <td className="px-3 py-2">{match.players_dead}</td>
                    <td className="px-3 py-2">{formatDate(match.match_date)}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editRow(match)}
                          className="rounded-lg border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-100 transition hover:border-cyan-400"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setConfirmDelete(match)}
                          className="rounded-lg border border-red-400/60 px-2 py-1 text-xs font-semibold text-red-200 transition hover:bg-red-500/10"
                        >
                          Borrar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && matches.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-center text-slate-400" colSpan={8}>
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
              ¿Eliminar la partida en <span className="font-semibold text-red-100">{confirmDelete.map_name}</span>?
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
