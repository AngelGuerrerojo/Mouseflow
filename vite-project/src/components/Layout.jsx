import { NavLink, Outlet } from "react-router";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/crud-fantasmas", label: "Historial" },
  { to: "/crud-herramientas", label: "Inventario" },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#05070f] text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800/80 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <span className="text-lg font-bold tracking-tight text-cyan-300" style={{ fontFamily: '"Special Elite", monospace' }}>
            Phas-con menu
          </span>
          <nav aria-label="Secciones principales">
            <ul className="flex items-center gap-2">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      [
                        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
                        isActive
                          ? "bg-cyan-500/15 text-cyan-200 shadow-sm shadow-cyan-500/20"
                          : "text-slate-200 hover:bg-slate-800/80",
                      ].join(" ")
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="w-full flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </div>
        <div className="pb-6 flex justify-center">
          <a
            href="https://www.youtube.com/shorts/Ay8lynMZ4mE"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:border-cyan-400 hover:text-cyan-200 hover:-translate-y-0.5"
          >
            NGGYU
          </a>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-[#0b1020] py-6 text-center text-sm text-slate-400" />
    </div>
  );
}
