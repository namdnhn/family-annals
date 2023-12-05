const express = require("express");
const { body } = require("express-validator");

const familyController = require("../controllers/family");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//POST /family/add
router.post(
    "/add",
    isAuth,
    [body("name").trim().isLength({ min: 5 })],
    familyController.createFamily
);

//PUT /family/update/id
router.put(
    "/update/:id",
    isAuth,
    [body("name").trim().isLength({ min: 5 })],
    familyController.updateFamily
);

//DELETE /family/delete/id
router.delete("/delete/:id", isAuth, familyController.deleteFamily);

//GET /family/get/id
router.get("/get/:id", familyController.getFamily);

//GET /family/getall
router.get("/getall", familyController.getAllFamily);

//GET /family/getftree/id
router.get("/getftree/:id", familyController.getFamilyTree);

module.exports = router;