const express = require("express");
const router = express.Router();
const controller = require("../controller/dictionary");

router.get("/", controller.searchDictionary);

module.exports = router;
