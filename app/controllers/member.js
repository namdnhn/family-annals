const { validationResult } = require("express-validator/check");

const Families = require("../models/families");
const Members = require("../models/members");

// Hàm xử lí tạo member mới và auto thêm children
// Dùng cho khi tạo một member mới và member đó tạo một parent mới (không dùng parent_id)
async function createMemAddChildren(children_id, parent_data, family_id) {
    const id = [];
    for (let i = 0; i < parent_data.length; i++) {
        const member = new Members({
            family_id: family_id,
            fullname: parent_data[i].fullname,
            children: [children_id],
        });
        try {
            const result = await member.save();
            id.push(result._id);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
    return id;
}

exports.createMember = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed!");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    let parentIds;

    const user_id = req.userId;
    const family_id = req.body.family_id;

    //Xử lí parent (bao gồm hai trường hợp: là id của parent có sẵn hoặc là dữ liệu của một parent mới)
    if (req.body.parent) {
        const parent = req.body.parent;
        if (parent[0].fullname) {
            //Tạo một parent mới
            parentIds = await createMemAddChildren(user_id, parent, family_id);
        } else {
            //Thêm vào parent có sẵn
            parentIds = parent;
        }
    }

    //Xử lí children (bao gồm hai trường hợp: là id của children có sẵn hoặc là dữ liệu của một children mới)


    //Xử lí spouse (bao gồm hai trường hợp: là id của spouse có sẵn hoặc là dữ liệu của một spouse mới)
};
