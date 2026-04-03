const express = require("express");
const router = express.Router();
const controller = require("../controller/lessons");

router.get("/", controller.listLessons);
router.get("/:id", controller.getLesson);
router.post("/:id/evaluar", controller.evaluateLesson);

module.exports = router;
