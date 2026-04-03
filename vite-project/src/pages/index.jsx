import { Link } from "react-router";

export default function Index() {
  return (
    <section className="space-y-6 text-center">
      <div className="rounded-2xl border border-slate-800 bg-[#0f162b]/90 p-8 shadow-2xl shadow-cyan-500/10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Bienvenido a Phas-con
        </p>
        <h1
          className="mt-3 text-4xl font-bold text-cyan-100"
          style={{ fontFamily: '"Special Elite", monospace' }}
        >
          Gestiona tu base de Phasmophobia
        </h1>
        <p className="mt-3 text-slate-300">
          Elige qué administrar: historial de partidas o herramientas del inventario.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            to="/crud-fantasmas"
            className="flex h-28 items-center justify-center rounded-2xl border border-slate-700 bg-gradient-to-br from-cyan-500/20 to-slate-900 text-xl font-semibold text-cyan-100 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-cyan-500/30"
          >
            Historial de partidas
          </Link>
          <Link
            to="/crud-herramientas"
            className="flex h-28 items-center justify-center rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-cyan-500/15 text-xl font-semibold text-cyan-100 shadow-lg shadow-cyan-500/15 transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-cyan-500/30"
          >
            CRUD de herramientas
          </Link>
        </div>
      </div>
    </section>
  );
}
