const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");
const Users = require('../models/users')

const router = express.Router();

// PUT /auth/signup
router.put(
    "/signup",
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email")
            .custom(async (value, { req }) => {
                const userDoc = await Users.findOne({ email: value });
                if (userDoc) {
                    throw new Error("Email đã tồn tại!");
                }
            })
            .normalizeEmail(),

        body("password").trim().isLength({ min: 5 }),
    ],
    authController.signup
);

// POST /auth/login
router.post("/login", authController.login);

// PUT /auth/changepassword
router.put(
    "/changepassword/:user_id",
    isAuth,
    [
        body("current_password").trim().isLength({ min: 5 }),
        body("new_password").trim().isLength({ min: 5 }),
        body("confirm_password")
            .trim()
            .isLength({ min: 5 })
            .custom((value, { req }) => {
                if (value !== req.body.new_password) {
                    throw new Error("Mật khẩu không trùng khớp!");
                }
                return true;
            }),
    ],
    authController.changePassword
);

// // DELETE /auth/deleteuser
router.delete(
    "/deleteuser/:user_id",
    isAuth,
    [body("password").trim().isLength({ min: 5 })],
    authController.deleteUser
);

module.exports = router;