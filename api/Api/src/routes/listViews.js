const express = require("express");
const router = express.Router();
const controller = require("../controller/listViews");

router.get("/usuarios", controller.listUsuarios);
router.get("/perfiles", controller.listPerfiles);
router.get("/lecciones", controller.listLecciones);
router.get("/preguntas", controller.listPreguntas);
router.get("/respuestas", controller.listRespuestas);
router.get("/progreso", controller.listProgreso);
router.get("/logros", controller.listLogros);
router.get("/logros-usuarios", controller.listLogrosUsuarios);
router.get("/diccionario", controller.listDiccionario);
router.get("/vista/dashboard", controller.listVistaDashboard);
router.get("/vista/ranking", controller.listVistaRanking);

module.exports = router;
