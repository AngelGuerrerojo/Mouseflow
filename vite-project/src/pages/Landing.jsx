import { useMemo } from "react";
import { useNavigate, Link } from "react-router";
import { getCurrentUser } from "../lib/api";

export default function Landing() {
  const navigate = useNavigate();
  const user = useMemo(() => getCurrentUser(), []);

  const handleStart = () => {
    if (user?.id_usuario) {
      navigate("/menu");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <header className="bg-hero-gradient pt-5 pb-5">
        <div className="container py-5">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6 order-2 order-lg-1">
              <span className="badge bg-secondary text-dark border border-secondary border-opacity-25 rounded-pill px-3 py-2 mb-3">
                <i className="bi bi-stars me-1" />
                Nueva Versión 2.0
              </span>
              <h1 className="display-3 fw-bold text-dark mb-3 lh-sm">
                Aprende lógica de <span className="text-primary position-relative">Programación</span>
              </h1>
              <p className="lead text-secondary mb-4 w-75">
                Una plataforma interactiva diseñada para estudiantes. Domina algoritmos y bases de datos con nuestra
                metodología práctica.
              </p>
              <div className="d-flex gap-3">
                <button
                  type="button"
                  onClick={handleStart}
                  className="btn btn-primary btn-lg rounded-pill px-5 shadow-lg fw-semibold text-white"
                >
                  Empezar Gratis
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/menu")}
                  className="btn btn-outline-primary btn-lg rounded-pill px-4 fw-semibold border-2"
                >
                  <i className="bi bi-play-circle me-2" />
                  Demo
                </button>
              </div>

            </div>

            <div className="col-lg-6 order-1 order-lg-2 text-center">
              <div className="bg-white rounded-4 shadow-lg p-3 d-inline-block rotate-n3" style={{ maxWidth: 740 }}>
                <div
                  className="bg-dark rounded-3 overflow-hidden position-relative"
                  style={{ width: "100%", aspectRatio: "16 / 9", minHeight: 360 }}
                >
                  {(() => {
                    const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
                    const parents = Array.from(new Set([host, "localhost", "127.0.0.1"]));
                    const parentParams = parents.map((p) => `parent=${p}`).join("&");
                    const src = `https://player.twitch.tv/?channel=mouse_flow&${parentParams}&muted=true&autoplay=true`;
                    return (
                      <iframe
                        title="Twitch Stream"
                        src={src}
                        allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                        frameBorder="0"
                        scrolling="no"
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                      />
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="py-5 bg-white">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6 text-primary">Todo lo que necesitas</h2>
            <p className="text-secondary">Accesos rápidos a tus secciones principales.</p>
          </div>

          <div className="row g-4">
            {[
              {
                title: "Ver lecciones",
                desc: "Accede a las lecciones y continúa tu ruta de aprendizaje.",
                to: "/menu",
                badge: "Ruta",
                icon: "/icono%20lecciones.png",
                bg: "linear-gradient(135deg, #7b61ff, #a48bff)",
              },
              {
                title: "Ver diccionario",
                desc: "Consulta definiciones y ejemplos de términos clave.",
                to: "/diccionario",
                badge: "Referencia",
                icon: "/icono%20diccionario.png",
                bg: "linear-gradient(135deg, #6dd5ed, #2193b0)",
              },
              {
                title: "Ver ranking",
                desc: "Mira la tabla de posiciones y compite con otros estudiantes.",
                to: "/ranking",
                badge: "Gamificación",
                icon: "/icono%20ranking.png",
                bg: "linear-gradient(135deg, #ff9a9e, #f6416c)",
              },
            ].map((card) => (
              <div className="col-md-6 col-lg-4" key={card.title}>
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100 transition-hover">
                  <div
                    className="p-4 text-white position-relative"
                    style={{ background: card.bg, height: 170 }}
                  >
                {/* badge removido */}
                    <h4 className="fw-bold mb-2 text-white">{card.title}</h4>
                    <div
                      className="position-absolute top-50 end-0 translate-middle-y opacity-25"
                      style={{
                    width: 140,
                    height: 140,
                    backgroundImage: `url(${card.icon})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
                  }}
                >
                  <span className="visually-hidden">icono {card.title}</span>
                </div>
              </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <p className="card-text text-secondary mb-4">{card.desc}</p>
                    <Link to={card.to} className="btn btn-link text-primary text-decoration-none p-0 fw-bold mt-auto stretched-link">
                      Ver sección <i className="bi bi-arrow-right ms-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

