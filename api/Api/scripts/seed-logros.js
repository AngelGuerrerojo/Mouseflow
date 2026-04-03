const db = require("../src/models/connection");

(async () => {
  const seeds = [
    { id_logro: 1, nombre: "Primer avance", descripcion: "Completa tu primera lección", icono_url: "" },
    { id_logro: 2, nombre: "Aprendiz constante", descripcion: "Completa 5 lecciones", icono_url: "" },
    { id_logro: 3, nombre: "Maratón de estudio", descripcion: "Completa 10 lecciones", icono_url: "" },
  ];

  for (const s of seeds) {
    await db.query(
      `INSERT INTO logros (id_logro, nombre, descripcion, icono_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id_logro) DO UPDATE SET nombre = EXCLUDED.nombre, descripcion = EXCLUDED.descripcion, icono_url = EXCLUDED.icono_url`,
      [s.id_logro, s.nombre, s.descripcion, s.icono_url]
    );
  }

  console.log("Logros insertados/actualizados:", seeds.length);
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
