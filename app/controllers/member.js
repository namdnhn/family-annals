const { validationResult } = require("express-validator");

const Families = require("../models/families");
const Members = require("../models/members");

// Hàm xử lí tạo member mới và auto thêm children
// Dùng cho khi tạo một member mới và member đó tạo một parent mới (không dùng parent_id)
async function createMemAddChildren(children_id, parent_data, family_id) {
    const ids = [];
    for (let i = 0; i < parent_data.length; i++) {
        const member = new Members({
            family_id: family_id,
            fullname: parent_data[i].fullname,
            children: [children_id],
        });
        try {
            const result = await member.save();
            ids.push(result._id);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
    return ids;
}

//Ham xử lí tạo member mới và auto thêm spouse
//Dùng cho khi tạo một member mới và member đó tạo một spouse mới (không dùng spouse_id)
async function createMemAddSpouse(spouse_id, spouse_data, family_id) {
    const ids = [];
    for (let i = 0; i < spouse_data.length; i++) {
        const member = new Members({
            family_id: family_id,
            fullname: spouse_data[i].fullname,
            spouse: [spouse_id],
        });
        try {
            const result = await member.save();
            ids.push(result._id);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
    return ids;
}

//Ham xử lí tạo member mới và auto thêm parent
//Dùng cho khi tạo một member mới và member đó tạo một children mới (không dùng children_id)
async function createMemAddParent(parent_id, children_data, family_id) {
    const ids = [];
    for (let i = 0; i < children_data.length; i++) {
        const member = new Members({
            family_id: family_id,
            fullname: children_data[i].fullname,
            parent: [parent_id],
        });
        try {
            const result = await member.save();
            ids.push(result._id);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
    return ids;
}

//Controller xử lí khi tạo mới một thành viên trong Family (yêu cầu nhập thông tin về family_id, fullname, parent, spouse, children)
exports.createMember = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed!");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    let parentIds;
    let spouseIds;
    let childrenIds;

    const family_id = req.body.family_id;
    const fullname = req.body.fullname;

    //Tạo member mới với family_id và fullname
    const member = new Members({
        family_id: family_id,
        fullname: fullname,
    });
    let result;
    try {
        result = await member.save();
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

    //Kiểm tra xem family_id có tồn tại hay không
    const family = await Families.findOne({ _id: family_id });
    if (!family) {
        const error = new Error("Không tìm thấy dòng họ!");
        error.statusCode = 404;
        throw error;
    }

    //Xử lí parent (bao gồm hai trường hợp: là id của parent có sẵn hoặc là dữ liệu của một parent mới)
    if (req.body.parent) {
        const parent = req.body.parent;
        if (parent[0].fullname) {
            //Tạo một parent mới
            parentIds = await createMemAddChildren(
                result._id,
                parent,
                family_id
            );
        } else {
            //Thêm vào parent có sẵn
            parentIds = parent;
        }
    }

    //Xử lí children (bao gồm hai trường hợp: là id của children có sẵn hoặc là dữ liệu của một children mới)
    if (req.body.children) {
        const children = req.body.children;
        if (children[0].fullname) {
            //Tạo một children mới
            childrenIds = await createMemAddParent(
                result._id,
                children,
                family_id
            );
        } else {
            //Thêm vào children có sẵn
            childrenIds = children;
        }
    }

    //Xử lí spouse (bao gồm hai trường hợp: là id của spouse có sẵn hoặc là dữ liệu của một spouse mới)
    if (req.body.spouse) {
        const spouse = req.body.spouse;
        if (spouse[0].fullname) {
            //Tạo một spouse mới
            spouseIds = await createMemAddSpouse(result._id, spouse, family_id);
        } else {
            //Thêm vào spouse có sẵn
            spouseIds = spouse;
        }
    }

    //Thêm thông tin vào member vừa tạo mới
    member.parent = parentIds;
    member.spouse = spouseIds;
    member.children = childrenIds;
    try {
        result = await member.save();
        res.status(201).json({
            message: "Thành viên đã được tạo thành công!",
            member: result,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateMember = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Cập nhật thông tin thất bại!");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let parentIds;
    let spouseIds;
    let childrenIds;

    const member_id = req.params.id;

    //Kiểm tra xem member_id có tồn tại hay không
    const member = await Members.findOne({ _id: member_id });
    if (!member) {
        const error = new Error("Không tìm thấy thành viên!");
        error.statusCode = 404;
        throw error;
    }

    //Kiểm tra member có thay đổi fullname hay không
    if (req.body.fullname) {
        member.fullname = req.body.fullname;
    }

    //Kiểm tra xem member có thay đổi parent hay không?: Xử lí parent (bao gồm hai trường hợp: là id của parent có sẵn hoặc là dữ liệu của một parent mới)
    if (req.body.parent) {
        const parent = req.body.parent;
        if (parent[0].fullname) {
            //Tạo một parent mới
            parentIds = await createMemAddChildren(
                member_id,
                parent,
                member.family_id
            );
        } else {
            //Thêm vào parent có sẵn
            parentIds = parent;
        }
    }

    //Xử lí children (bao gồm hai trường hợp: là id của children có sẵn hoặc là dữ liệu của một children mới)
    if (req.body.children) {
        const children = req.body.children;
        if (children[0].fullname) {
            //Tạo một children mới
            childrenIds = await createMemAddParent(
                member_id,
                children,
                family_id
            );
        } else {
            //Thêm vào children có sẵn
            childrenIds = children;
        }
    }

    //Xử lí spouse (bao gồm hai trường hợp: là id của spouse có sẵn hoặc là dữ liệu của một spouse mới)
    if (req.body.spouse) {
        const spouse = req.body.spouse;
        if (spouse[0].fullname) {
            //Tạo một spouse mới
            spouseIds = await createMemAddSpouse(member_id, spouse, family_id);
        } else {
            //Thêm vào spouse có sẵn
            spouseIds = spouse;
        }
    }

    //Thêm thông tin vào member vừa tạo mới
    member.parent = parentIds;
    member.spouse = spouseIds;
    member.children = childrenIds;
    try {
        result = await member.save();
        res.status(201).json({
            message: "Thành viên đã được tạo thành công!",
            member: result,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
