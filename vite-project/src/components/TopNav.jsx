import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import logo from "../assets/logo.png";
import { useTheme } from "../context/ThemeContext";
import { getCurrentUser, setCurrentUser } from "../lib/api";

const commonLinks = [
  { to: "/", label: "Inicio" },
  { to: "/menu", label: "Menú principal" },
  { to: "/progreso", label: "Progreso" },
  { to: "/diccionario", label: "Diccionario" },
  { to: "/ranking", label: "Ranking" },
  { to: "/perfil", label: "Perfil" },
];

export default function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const close = () => setExpanded(false);

  const handleLogout = () => {
    setCurrentUser(null);
    close();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary fs-4 tracking-tight d-flex align-items-center gap-2" to="/" onClick={close}>
          <img src={logo} alt="Mouseflow logo" style={{ height: 32 }} />
          Mouseflow
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse${expanded ? " show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center gap-lg-3">
            {commonLinks.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      "nav-link fw-medium",
                      isActive || location.pathname === link.to ? "active fw-bold text-primary" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")
                  }
                  onClick={close}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            <li className="nav-item">
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  close();
                }}
                className="btn btn-outline-primary btn-sm rounded-pill theme-toggle d-flex align-items-center"
              >
                {theme === "light" ? (
                  <>
                    <i className="bi bi-moon-stars" />
                    <span className="d-none d-lg-inline ms-2">Modo oscuro</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-sun" />
                    <span className="d-none d-lg-inline ms-2">Modo claro</span>
                  </>
                )}
              </button>
            </li>

            <li className="nav-item ms-lg-2">
              {location.pathname === "/login" ? (
                <Link className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm text-white" to="/" onClick={close}>
                  Ir a inicio
                </Link>
              ) : user ? (
                <button className="btn btn-outline-danger rounded-pill px-4 fw-semibold btn-sm" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1" />
                  Salir
                </button>
              ) : (
                <Link className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm text-white" to="/login" onClick={close}>
                  Iniciar sesiÃ³n
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}


