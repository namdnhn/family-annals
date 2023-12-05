const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const memberDetailController = require("../controllers/memberDetail");

//PUT /memberdetail/add
router.put(
    "/add/:id",
    isAuth,
    memberDetailController.createMemberDetail
);

module.exports = router;