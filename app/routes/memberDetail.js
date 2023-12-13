const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const memberDetailController = require("../controllers/memberDetail");
const memberDetail = require("../models/memberDetail");

//PUT /memberdetail/add/:id
router.put(
    "/add/:id",
    isAuth,
    memberDetailController.createMemberDetail
);

router.put(
    "/edit/:id",
    memberDetailController.createMemberDetail
);

//GET /memberdetail/get/:id
router.get("/get/:id", memberDetailController.getMemberDetail);

router.get("/get2/:id", memberDetailController.getMemberDetail2);

module.exports = router;