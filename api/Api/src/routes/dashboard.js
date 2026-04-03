const express = require("express");
const router = express.Router();
const controller = require("../controller/dashboard");

// /api/dashboard/:userId -> datos consolidados del usuario
router.get("/:userId", controller.getDashboard);

// /api/dashboard/ranking -> leaderboard
router.get("/ranking/all", controller.getRanking);

module.exports = router;
