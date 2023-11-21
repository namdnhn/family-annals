const { validationResult } = require("express-validator");

const Families = require("../models/families");

exports.createFamily = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed!");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const family_name = req.body.name;
    const admin_id = req.body.admin;
    try {
        const family = new Families({
            name: family_name,
            admin: [admin_id],
        });
        const result = await family.save();
        res.status(201).json({
            message: "Dòng họ của bạn đã được tạo thành công!",
            family: result,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateFamily = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed!");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const family_id = req.params.id;
    const family_name = req.body.name;
    try {
        const family = await Families.findOne({ _id: family_id });
        if (!family) {
            const error = new Error("Không tìm thấy dòng họ!");
            error.statusCode = 404;
            throw error;
        }

        //Xác thực có phải là admin hay không
        const admin = family.admin.find(
            (admin) => admin.toString() === req.userId.toString()
        );
        if (!admin) {
            const error = new Error(
                "Bạn không có quyền thực hiện hành động này!"
            );
            error.statusCode = 403;
            throw error;
        }

        family.name = family_name;
        const result = await family.save();
        res.status(200).json({
            message: "Cập nhật dòng họ thành công!",
            family: result,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteFamily = async (req, res, next) => {
    const family_id = req.params.id;
    try {
        const family = await Families.findOne({ _id: family_id });
        if (!family) {
            const error = new Error("Không tìm thấy dòng họ!");
            error.statusCode = 404;
            throw error;
        }

        //Xác thực có phải là admin hay không
        const admin = family.admin.find(
            (admin) => admin.toString() === req.userId.toString()
        );
        if (!admin) {
            const error = new Error(
                "Bạn không có quyền thực hiện hành động này!"
            );
            error.statusCode = 403;
            throw error;
        }

        await Families.deleteOne({ _id: family_id });
        res.status(200).json({
            message: "Xóa dòng họ thành công!",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getAllFamily = async (req, res, next) => {
    try {
        const families = await Families.find();
        res.status(200).json({
            message: "Lấy dữ liệu tất cả dòng họ thành công!",
            families: families,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getFamily = async (req, res, next) => {
    const family_id = req.params.id;
    try {
        const family = await Families.findOne({ _id: family_id });
        if (!family) {
            const error = new Error("Không tìm thấy dòng họ!");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: "Lấy dữ liệu dòng họ thành công!",
            family: family,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
