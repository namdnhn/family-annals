const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../models/users");

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Đăng ký thất bại!");
        error.statusCode = 422;
        res.status(422).json({
            message: "Đăng ký thất bại!",
            errors: errors.array(),
        });
        return;
    }
    const email = req.body.email;
    const password = req.body.password;

    try {
        const hashedPw = await bcrypt.hash(password, 12);
        const user = new Users({
            email: email,
            password: hashedPw,
        });

        const result = await user.save();

        res.status(201).json({
            message: "Đăng ký thành công!",
            userId: result._id,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await Users.findOne({ email: email });
        if (!user) {
            res.status(401).json({
                message: "Email không tồn tại!",
            });
            return;
        }
        const userLoaded = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            res.status(401).json({
                message: "Sai mật khẩu!",
            });
            return;
        }
        const token = jwt.sign(
            {
                email: userLoaded.email,
                user_id: userLoaded.id.toString(),
            },
            "somesupersecretsecret",
            { expiresIn: "1h" }
        );
        res.status(200).json({
            token: token,
            id: userLoaded.id.toString(),
            expiresIn: 3600,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.changePassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Cập nhật thông tin thất bại!");
        error.statusCode = 422;
        res.status(422).json({
            message: "Cập nhật thông tin thất bại!",
            errors: errors.array(),
        });
        return;
    }

    const user_id = req.params.user_id;
    const current_password = req.body.current_password;
    const new_password = req.body.new_password;

    try {
        const user = await Users.findOne({ _id: user_id });
        if (!user) {
            res.status(401).json({
                message: "Email không tồn tại!",
            });
            return;
        }

        //check entered current pass is correct
        const checkCurrentPass = await bcrypt.compare(
            current_password,
            user.password
        );
        if (!checkCurrentPass) {
            res.status(401).json({
                message: "Sai mật khẩu hiện tại!",
            });
            return;
        }

        const hashedPw = await bcrypt.hash(new_password, 12);
        await Users.findOneAndUpdate({ _id: user_id }, { password: hashedPw })
        res.status(200).json({
            message: "Cập nhật thông tin thành công!",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Xóa tài khoản thất bại!");
        error.statusCode = 422;
        res.status(422).json({
            message: "Xóa tài khoản thất bại!",
            errors: errors.array(),
        });
        return;
    }

    const user_id = req.params.user_id;
    const password = req.body.password;

    try {
        const user = await Users.findOne({ _id: user_id });
        if (!user) {
            res.status(401).json({
                message: "Không thể tìm thấy tài khoản!",
            });
            return;
        }
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            res.status(401).json({
                message: "Sai mật khẩu hiện tại!",
            });
            return;
        }
        await Users.deleteOne({ _id: user_id});
        res.status(200).json({
            message: "Xóa tài khoản thành công!",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};