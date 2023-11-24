const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const memberController = require("../controllers/member");

//POST /member/add
router.post(
    "/add",
    isAuth,
    [body("fullname").trim().isLength({ min: 5 })],
    memberController.createMember
);

//PUT /member/update/id
router.put("/update/:id", isAuth, memberController.updateMember);

module.exports = router;
