const { validationResult } = require("express-validator");

const Families = require("../models/families");
const Members = require("../models/members");
const MemberDetail = require("../models/memberDetail");

//auto add members to family
async function addMembersToFamily(family_id, ids) {
    const family = await Families.findById(family_id);
    if (!family) {
        throw new Error("Không thể tìm thấy dòng họ!");
    }

    for (let id of ids) {
        const member = await Members.findById({ _id: id });
        if (!member) {
            throw new Error("Thành viên không tồn tại");
        }
        family.members.push(id);
    }

    await family.save();
}

async function deleteMemberFromFamily(family_id, id) {
    const family = await Families.findById(family_id);
    if (!family) {
        throw new Error("Không thể tìm thấy dòng họ!");
    }

    const member = await Members.findById({ _id: id });
    if (!member) {
        throw new Error("Thành viên không tồn tại");
    }

    family.members.pull(id);

    await family.save();
}

// Hàm xử lí tạo member mới và auto thêm children
// Dùng cho khi tạo một member mới và member đó tạo một parent mới (không dùng parent_id)
async function createMemAddChildren(children_id, parent_data, family_id) {
    const ids = [];
    for (let i = 0; i < parent_data.length; i++) {
        const member = new Members({
            family_id: family_id,
            fullname: parent_data[i].fullname,
            gender: parent_data[i].gender,
            children: [children_id],
        });
        try {
            const result = await member.save();
            ids.push(result._id);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            throw err;
        }
    }
    addMembersToFamily(family_id, ids);
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
            gender: spouse_data[i].gender,
            spouse: [spouse_id],
        });
        try {
            const result = await member.save();
            ids.push(result._id);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            throw err;
        }
    }
    addMembersToFamily(family_id, ids);
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
            gender: children_data[i].gender,
            parent: [parent_id],
        });
        try {
            const result = await member.save();
            ids.push(result._id);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            throw err;
        }
    }
    addMembersToFamily(family_id, ids);
    return ids;
}

async function updateMemField(current_mem, field, field_data) {
    let ids = [];
    let oldFieldIds;
    switch (field) {
        case "parent":
            oldFieldIds = current_mem.parent;
            break;
        case "children":
            oldFieldIds = current_mem.children;
            break;
        case "spouse":
            oldFieldIds = current_mem.spouse;
            break;
    }

    //Cập nhật field
    for (var i = 0; i < field_data.length; i++) {
        if (field_data[i].fullname) {
            switch (field) {
                case "parent":
                    const newParentId = await createMemAddChildren(
                        current_mem._id,
                        [field_data[i]],
                        current_mem.family_id
                    );
                    ids.push(newParentId);
                    break;
                case "children":
                    const newChildrenId = await createMemAddParent(
                        current_mem._id,
                        [field_data[i]],
                        current_mem.family_id
                    );
                    ids.push(newChildrenId);
                    break;
                case "spouse":
                    const newSpouseId = await createMemAddSpouse(
                        current_mem._id,
                        [field_data[i]],
                        current_mem.family_id
                    );
                    ids.push(newSpouseId);
                    break;
            }
        } else if (!oldFieldIds.includes(field_data[i])) {
            switch (field) {
                case "parent":
                    //update mem add parent
                    const parent = await Members.findOne({
                        _id: field_data[i],
                    });
                    if (!parent.children.includes(current_mem._id)) {
                        parent.children.push(current_mem._id);
                    }
                    try {
                        await parent.save();
                    } catch (err) {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        throw err;
                    }
                    break;
                case "children":
                    const children = await Members.findOne({
                        _id: field_data[i],
                    });
                    if (!children.parent.includes(current_mem._id)) {
                        children.parent.push(current_mem._id);
                    }
                    try {
                        await children.save();
                    } catch (err) {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        throw err;
                    }
                    break;
                case "spouse":
                    const spouse = await Members.findOne({
                        _id: field_data[i],
                    });
                    if (!spouse.spouse.includes(current_mem._id)) {
                        spouse.spouse.push(current_mem._id);
                    }
                    try {
                        await spouse.save();
                    } catch (err) {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        throw err;
                    }
                    break;
            }
            ids.push(field_data[i]);
        } else {
            ids.push(field_data[i]);
        }
    }

    //Xóa field cũ
    let deletedIds = [];
    switch (field) {
        case "parent":
            const oldParentIds = current_mem.parent;
            deletedIds = deletedIds.concat(
                oldParentIds
                    .map((id) => id.toString())
                    .filter((idStr) => !ids.includes(idStr))
            );
            break;
        case "children":
            const oldChildrenIds = current_mem.children;
            deletedIds = deletedIds.concat(
                oldChildrenIds
                    .map((id) => id.toString())
                    .filter((idStr) => !ids.includes(idStr))
            );
            break;
        case "spouse":
            const oldSpouseIds = current_mem.spouse;
            deletedIds = deletedIds.concat(
                oldSpouseIds
                    .map((id) => id.toString())
                    .filter((idStr) => !ids.includes(idStr))
            );
            break;
    }

    //function delete member
    for (var i = 0; i < deletedIds.length; i++) {
        try {
            // const member = await Members.findOne({ _id: deletedIds[i] });
            // console.log("member: ", member);
            // switch (field) {
            //     case "parent":
            //         member.children.pull(current_mem._id);
            //         console.log("delete children");
            //         break;
            //     case "children":
            //         member.parent.pull(current_mem._id);
            //         console.log("delete parent");
            //         break;
            //     case "spouse":
            //         member.spouse.pull(current_mem._id);
            //         console.log("delete spouse");
            //         break;
            // }
            // await deleteMemberFromFamily(current_mem.family_id, current_mem._id)
            // await member.save();

            const member = await Members.findOne({ _id: deletedIds[i] });
            if (!member) {
                const error = new Error("Không tìm thấy thành viên!");
                error.statusCode = 404;
                throw error;
            }

            //khi một member bị xóa thì phải xóa vợ của nó trong family
            if (member.spouse.length > 0) {
                for (let i = 0; i < member.spouse.length; i++) {
                    await deleteMemberFromFamily(
                        current_mem.family_id,
                        member.spouse[i]
                    );
                }
            }

            //delete in families collection
            deleteMemberFromFamily(current_mem.family_id, deletedIds[i]);

            //delete in other document
            const collectionsToUpdate = ["parent", "children", "spouse"];
            for (let collection of collectionsToUpdate) {
                await Members.updateMany(
                    { [collection]: deletedIds[i] },
                    { $pull: { [collection]: deletedIds[i] } }
                );
            }

            await Members.findOneAndDelete({
                _id: deletedIds[i],
            });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            throw err;
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
    const gender = req.body.gender;

    //Tạo member mới với family_id và fullname
    const member = new Members({
        family_id: family_id,
        fullname: fullname,
        gender: gender,
    });
    let result;
    try {
        result = await member.save();

        //add member to families
        const ids = [result._id];
        await addMembersToFamily(family_id, ids);
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

    //Kiểm tra xem member có thay đổi gender hay không
    if (req.body.gender) {
        member.gender = req.body.gender;
    }

    //Kiểm tra xem member có thay đổi parent hay không?: Xử lí parent (bao gồm hai trường hợp: là id của parent có sẵn hoặc là dữ liệu của một parent mới)
    if (req.body.parent) {
        const newParentIds = await updateMemField(
            member,
            "parent",
            req.body.parent
        );
        member.parent = newParentIds;
    }

    //Kiểm tra xem member có thay đổi children hay không. Xử lí children (bao gồm hai trường hợp: là id của children có sẵn hoặc là dữ liệu của một children mới)
    if (req.body.children) {
        const newChildrenIds = await updateMemField(
            member,
            "children",
            req.body.children
        );
        member.children = newChildrenIds;
    }

    //Kiểm tra xem member có thay đổi spouse hay không. Xử lí spouse (bao gồm hai trường hợp: là id của spouse có sẵn hoặc là dữ liệu của một spouse mới)
    if (req.body.spouse) {
        const newSpouseIds = await updateMemField(
            member,
            "spouse",
            req.body.spouse
        );
        member.spouse = newSpouseIds;
    }

    //Lưu thông tin member vừa thay đổi
    try {
        const result = await member.save();
        res.status(201).json({
            message: "Cập nhật thông tin thành viên thành công!",
            member: result,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteMember = async (req, res, next) => {
    const member_id = req.params.id;
    try {
        const member = await Members.findOne({ _id: member_id });
        if (!member) {
            const error = new Error("Không tìm thấy thành viên!");
            error.statusCode = 404;
            throw error;
        }

        //delete in families collection
        await deleteMemberFromFamily(member.family_id, member._id);

        //delete in other document
        const collectionsToUpdate = ["parent", "children", "spouse"];
        for (let collection of collectionsToUpdate) {
            await Members.updateMany(
                { [collection]: member_id },
                { $pull: { [collection]: member_id } }
            );
        }

        const result = await Members.findOneAndDelete({ _id: member_id });

        res.status(200).json({
            message: "Xóa thành viên thành công!",
            member: result,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getAllMembers = async (req, res, next) => {
    try {
        const members = await Members.find();
        res.status(200).json({
            message: "Lấy danh sách thành viên thành công!",
            members: members,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getMember = async (req, res, next) => {
    const member_id = req.params.id;
    try {
        const member = await Members.findOne({ _id: member_id });
        if (!member) {
            const error = new Error("Không tìm thấy thành viên!");
            error.statusCode = 404;
            throw error;
        }
        const children = [];
        const spouse = [];
        const parent = [];

        console.log("Độ dài của children: ", member.children);

        for (let i = 0; i < member.children.length; i++) {
            const child = await Members.findOne({ _id: member.children[i] });
            console.log(`child ${i} là ${child}`);
            if (child)
                children.push({
                    fullname: child.fullname,
                    gender: child.gender,
                });
        }

        for (let i = 0; i < member.spouse.length; i++) {
            const sp = await Members.findOne({ _id: member.spouse[i] });
            spouse.push({
                fullname: sp.fullname,
                gender: sp.gender,
            });
        }

        for (let i = 0; i < member.parent.length; i++) {
            const par = await Members.findOne({ _id: member.parent[i] });
            parent.push({
                fullname: par.fullname,
                gender: par.gender,
            });
        }

        const responseData = {
            _id: member._id,
            family_id: member.family_id,
            fullname: member.fullname,
            gender: member.gender,
            spouse: spouse,
            children: children,
            parent: parent,
        };

        res.status(200).json({
            message: "Lấy thông tin thành viên thành công!",
            memberInfo: responseData,
            member: member,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getMember2 = async (req, res, next) => {
    const member_id = req.params.id;
    try {
        const member = await Members.findOne({ _id: member_id });
        if (!member) {
            const error = new Error("Không tìm thấy thành viên!");
            error.statusCode = 404;
            throw error;
        }

        let formattedDateOfBirth = "";
        let formattedDateOfDeath = "";
        let placeOfBirth = "";
        let placeOfDeath = "";
        let description = "";
        const memberInfo = await MemberDetail.findOne({ member_id: member_id });
        if (memberInfo) {
            formattedDateOfBirth = memberInfo.date_of_birth;
            formattedDateOfDeath = memberInfo.date_of_death;
            placeOfBirth = memberInfo.place_of_birth;
            placeOfDeath = memberInfo.place_of_death;
            description = memberInfo.background_desc;
        }   
        const children = [];
        const spouse = [];
        const parent = [];

        console.log("Độ dài của children: ", member.children);

        for (let i = 0; i < member.children.length; i++) {
            const child = await Members.findOne({ _id: member.children[i] });
            console.log(`child ${i} là ${child}`);
            if (child)
                children.push({
                    id: child._id,
                    fullname: child.fullname,
                    gender: child.gender,
                });
        }

        for (let i = 0; i < member.spouse.length; i++) {
            const sp = await Members.findOne({ _id: member.spouse[i] });
            spouse.push({
                id: sp._id,
                fullname: sp.fullname,
                gender: sp.gender,
            });
        }

        for (let i = 0; i < member.parent.length; i++) {
            const par = await Members.findOne({ _id: member.parent[i] });
            parent.push({
                id: par._id,
                fullname: par.fullname,
                gender: par.gender,
            });
        }

        const responseData = {
            _id: member._id,
            family_id: member.family_id,
            fullname: member.fullname,
            gender: member.gender,
            date_of_birth: formattedDateOfBirth,
            place_of_birth: placeOfBirth,
            date_of_death: formattedDateOfDeath,
            place_of_death: placeOfDeath,
            spouse: spouse,
            children: children,
            parent: parent,
            description: description,
        };

        res.status(200).json({
            message: "Lấy thông tin thành viên thành công!",
            memberInfo: responseData,
            member: member,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
