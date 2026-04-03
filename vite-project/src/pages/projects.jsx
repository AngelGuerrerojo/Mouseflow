const sections = [
  {
    title: "Landing",
    detail: "Texto de bienvenida, CTA y tarjetas con beneficios.",
  },
  {
    title: "Servicios",
    detail: "Bloques cortos para listar lo que ofreces con descripciones breves.",
  },
  {
    title: "Testimonios",
    detail: "Citas o métricas rápidas que den confianza.",
  },
  {
    title: "FAQ",
    detail: "Preguntas frecuentes para resolver dudas sin saturar de texto.",
  },
];

export default function Projects() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-cyan-100" style={{ fontFamily: '"Special Elite", monospace' }}>
          Proyectos de ejemplo
        </h2>
        <p className="text-slate-300">
          Usa estas secciones como punto de partida. Duplica o ajusta lo que necesites.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-800 bg-[#0f162b] p-4 shadow-lg shadow-cyan-500/5"
          >
            <h3 className="text-lg font-semibold text-cyan-100">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
