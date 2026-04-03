import { useEffect, useState } from "react";
import { getCurrentUser, setCurrentUser, userApi } from "../lib/api";

export default function Profile() {
  const user = getCurrentUser();
  const [form, setForm] = useState({
    nombre_usuario: "",
    descripcion: "",
    correo: "",
    fecha_registro: "",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!user?.id_usuario) return;
      try {
        const data = await userApi.getProfile(user.id_usuario);
        setForm({
          nombre_usuario: data.nombre_usuario ?? "",
          descripcion: data.descripcion ?? "",
          correo: data.correo ?? "",
          fecha_registro: data.fecha_registro ?? "",
        });
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, [user?.id_usuario]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    try {
      const updated = await userApi.updateProfile(user.id_usuario, {
        nombre_usuario: form.nombre_usuario,
        descripcion: form.descripcion,
        imagen_perfil: null, // ya no se usa imagen
      });
      setStatus("Cambios guardados");
      setCurrentUser({ ...user, nombre_usuario: updated.nombre_usuario });
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="container py-5">
        <p className="text-secondary">Inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
            <h5 className="fw-bold text-dark mb-4 border-bottom pb-3">Información Personal</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            {status && <div className="alert alert-success">{status}</div>}
            <form onSubmit={onSubmit}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-medium text-secondary-emphasis">Nombre de usuario</label>
                  <input
                    type="text"
                    className="form-control bg-light border-0 py-2"
                    value={form.nombre_usuario}
                    onChange={(e) => setForm({ ...form, nombre_usuario: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium text-secondary-emphasis">Registrado el</label>
                  <input
                    type="text"
                    className="form-control bg-light border-0 py-2"
                    value={form.fecha_registro ? new Date(form.fecha_registro).toLocaleDateString() : "—"}
                    readOnly
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label fw-medium text-secondary-emphasis">Biografía</label>
                  <textarea
                    className="form-control bg-light border-0"
                    rows="3"
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label fw-medium text-secondary-emphasis">Correo</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-primary">
                      <i className="bi bi-envelope" />
                    </span>
                    <input type="email" className="form-control py-2" value={form.correo} readOnly />
                  </div>
                </div>
                <div className="col-12 mt-4">
                  <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 fw-semibold shadow-sm">
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
