const { validationResult } = require("express-validator");

const Families = require("../models/families");
const Members = require("../models/members");

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
        const members = await Members.find({ family_id: family_id });
        if (!members) {
            const error = new Error("Không tìm thấy thành viên trong dòng họ!");
            error.statusCode = 404;
            throw error;
        }

        //Tạo cây dòng họ
        let tree = [];
        let root = members.find(
            (member) => member.parent.length === 0 || !member.parent
        );
        root = {
            id: root._id,
            fullname: root.fullname,
            gender: root.gender,
            parent: root.parent,
            spouse: root.spouse,
            children: root.children,
            level: 0,
        };
        tree.push(root);
        await getTreeFamily(members, root, tree);

        // Sort the tree array by level
        tree.sort((a, b) => a.level - b.level);

        res.status(200).json({
            message: "Lấy dữ liệu dòng họ thành công!",
            family: family,
            familyTree: tree,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

async function getTreeFamily(members, root, tree) {
    //add spouse
    for (let i = 0; i < root.spouse.length; i++) {
        let spouse = members.find(
            (member) => member._id.toString() === root.spouse[i].toString()
        );
        if (!spouse) {
            const error = new Error("Không tìm thấy thành viên trong dòng họ!");
            error.statusCode = 404;
            throw error;
        }
        spouse = {
            id: spouse._id,
            fullname: spouse.fullname,
            gender: spouse.gender,
            parent: spouse.parent,
            spouse: spouse.spouse,
            children: spouse.children,
            level: root.level,
        };
        tree.push(spouse);
    }
    if (root.children.length === 0) {
        return root;
    } else {
        //add children
        for (let i = 0; i < root.children.length; i++) {
            let child = members.find(
                (member) =>
                    member._id.toString() === root.children[i].toString()
            );
            if (!child) {
                const error = new Error(
                    "Không tìm thấy thành viên trong dòng họ!"
                );
                error.statusCode = 404;
                throw error;
            }
            child = {
                id: child._id,
                fullname: child.fullname,
                gender: child.gender,
                parent: child.parent,
                spouse: child.spouse,
                children: child.children,
                level: root.level + 1,
            };
            tree.push(child);

            await getTreeFamily(members, child, tree);
        }
    }
}
