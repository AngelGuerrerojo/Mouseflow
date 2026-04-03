const express = require("express");
const router = express.Router();
const controller = require("../controller/progress");

router.get("/:userId", controller.getProgress);
router.post("/", controller.upsertProgress);
router.get("/:userId/logros", controller.listAchievements);

module.exports = router;
