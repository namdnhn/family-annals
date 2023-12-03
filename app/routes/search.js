const express = require("express");
const router = express.Router();

const familyController = require("../controllers/family");

//GET /search?text=
router.get("/", familyController.searchFamily);

module.exports = router;