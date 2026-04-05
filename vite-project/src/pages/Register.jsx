import { useState } from "react";
import { Link, useNavigate } from "react-router";
import logo from "../assets/logo.png";
import { useTheme } from "../context/ThemeContext";
import { authApi, setCurrentUser } from "../lib/api";

export default function Register() {
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ correo: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      const data = await authApi.register(form.correo, form.password);
      setCurrentUser({
        id_usuario: data.user.id_usuario,
        correo: data.user.correo,
        nombre_usuario: data.perfil?.nombre_usuario ?? undefined,
        descripcion: data.perfil?.descripcion ?? "",
        imagen_perfil: data.perfil?.imagen_perfil ?? "",
      });
      navigate("/menu", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-hero-gradient min-vh-100 d-flex align-items-center justify-content-center py-5 auth-page">
      <button
        type="button"
        onClick={toggleTheme}
        className="btn btn-outline-primary btn-sm theme-toggle position-fixed top-0 end-0 m-3 d-flex align-items-center shadow-sm"
        style={{ zIndex: 1055 }}
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

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden auth-card">
              <div className="bg-primary bg-gradient p-4 text-center">
                <button
                  className="text-white text-decoration-none fs-3 fw-bold tracking-tight btn btn-link p-0 text-reset auth-brand"
                  type="button"
                  onClick={() => navigate("/")}
                >
                  <img src={logo} alt="Mouseflow Logo" className="me-2" style={{ height: 40 }} />
                  Mouseflow
                </button>
                <p className="text-white-50 mt-2 mb-0">Crea tu cuenta para empezar a aprender.</p>
              </div>

              <div className="card-body p-4 p-md-5 bg-white">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={onSubmit}>
                  <div className="mb-4">
                    <label htmlFor="correo" className="form-label fw-medium text-secondary-emphasis">
                      Correo institucional
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-primary">
                        <i className="bi bi-envelope" />
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0 bg-light py-2"
                        id="correo"
                        placeholder="alumno@utzmg.edu.mx"
                        value={form.correo}
                        onChange={(e) => setForm({ ...form, correo: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-medium text-secondary-emphasis">
                      Contraseña
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-primary">
                        <i className="bi bi-lock" />
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0 bg-light py-2"
                        id="password"
                        placeholder="••••••••"
                        minLength={6}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirm" className="form-label fw-medium text-secondary-emphasis">
                      Confirmar contraseña
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-primary">
                        <i className="bi bi-shield-lock" />
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0 bg-light py-2"
                        id="confirm"
                        placeholder="••••••••"
                        minLength={6}
                        value={form.confirm}
                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm mb-4 mt-2"
                    disabled={loading}
                  >
                    {loading ? "Creando cuenta..." : "Crear cuenta"}
                  </button>

                  <div className="text-center">
                    <span className="text-muted small">¿Ya tienes cuenta?</span>
                    <Link to="/login" className="text-secondary fw-bold text-decoration-none ms-1">
                      Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
