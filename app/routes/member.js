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
    [
        body("gender")
            .trim()
            .custom((value) => {
                if (
                    value !== "Nam" &&
                    value !== "Nữ" &&
                    value !== "Male" &&
                    value !== "Female"
                ) {
                    throw new Error("Giới tính không hợp lệ!");
                }
                return true;
            }),
    ],
    memberController.createMember
);

// POST /member/addchildren
router.post("/addchildren", memberController.addChildren);

// POST /member/addspouse
router.post("/addspouse", memberController.addSpouse);

// POST /member/addparent
router.post("/addparent", memberController.addParent);

//PUT /member/update/id
router.put("/update/:id", isAuth, memberController.updateMember);

//DELETE /member/delete/id
router.delete("/delete/:id", isAuth, memberController.deleteMember);

//GET /member/get/id
router.get("/get/:id", memberController.getMember);

router.get("/get2/:id", memberController.getMember2);

//GET /member/getall
router.get("/getall", memberController.getAllMembers);

module.exports = router;
