const { validationResult } = require("express-validator");

const MemberDetails = require("../models/memberDetail");
const Members = require("../models/members");

exports.createMemberDetail = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed!");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const member_id = req.params.id;
    const fullname = req.body.fullname;
    const gender = req.body.gender;
    const date_of_birth = req.body.date_of_birth;
    const place_of_birth = req.body.place_of_birth;
    const date_of_death = req.body.date_of_death;
    const place_of_death = req.body.place_of_death;
    const images = req.body.images;
    const background_desc = req.body.background_desc;

    try {
        //thay doi fullname va gender cua member
        const currentMember = await Members.findOne({ _id: member_id });
        if (!currentMember) {
            const error = new Error("Không tìm thấy thông tin thành viên!");
            error.statusCode = 404;
            throw error;
        }
        if (fullname) {
            currentMember.fullname = fullname;
        }
        if (gender) {
            currentMember.gender = gender;
        }
        if (images) {
            currentMember.images = images;
        }
        await currentMember.save();

        const createdMemberDetail = await MemberDetails.findOne({
            member_id: member_id,
        });
        if (createdMemberDetail) {
            createdMemberDetail.fullname = fullname;
            createdMemberDetail.gender = gender;
            createdMemberDetail.date_of_birth = date_of_birth;
            createdMemberDetail.place_of_birth = place_of_birth;
            createdMemberDetail.date_of_death = date_of_death;
            createdMemberDetail.place_of_death = place_of_death;
            createdMemberDetail.images = images;
            createdMemberDetail.background_desc = background_desc;

            const result = await createdMemberDetail.save();
            res.status(200).json({
                message:
                    "Thông tin chi tiết của thành viên đã được cập nhật thành công!",
                memberDetail: result,
            });
        } else {
            const memberDetail = new MemberDetails({
                member_id: member_id,
                fullname: fullname,
                gender: gender,
                date_of_birth: date_of_birth,
                place_of_birth: place_of_birth,
                date_of_death: date_of_death,
                place_of_death: place_of_death,
                images: images,
                background_desc: background_desc,
            });

            const result = await memberDetail.save();

            res.status(201).json({
                message:
                    "Thông tin chi tiết của thành viên đã được tạo thành công!",
                memberDetail: result,
            });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getMemberDetail = async (req, res, next) => {
    const member_id = req.params.id;
    try {
        const memberDetail = await MemberDetails.findOne({
            member_id: member_id,
        });
        if (!memberDetail) {
            const member = await Members.findOne({
                _id: member_id,
            });
            if (!member) {
                const error = new Error(
                    "Không tìm thấy thông tin chi tiết của thành viên!"
                );
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: "Lấy thông tin chi tiết của thành viên thành công!",
                memberDetail: {
                    _id: member._id,
                    member_id: member.member_id,
                    fullname: member.fullname,
                    gender: member.gender,
                    date_of_birth: "",
                    place_of_birth: "",
                    date_of_death: "",
                    place_of_death: "",
                    images:
                        member.images ||
                        "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png",
                    background_desc: "",
                },
            });
        } else {
            //convert from dade to string dd//mm/yyyy
            let formattedDateOfBirth = "";
            let formattedDateOfDeath = "";
            if (memberDetail.date_of_birth) {
                let date_of_birth = memberDetail.date_of_birth;
                let day = String(date_of_birth.getDate()).padStart(2, "0");
                let month = String(date_of_birth.getMonth() + 1).padStart(
                    2,
                    "0"
                ); // January is 0!
                let year = date_of_birth.getFullYear();
                formattedDateOfBirth = day + "/" + month + "/" + year;
            }
            if (memberDetail.date_of_death) {
                let date_of_death = memberDetail.date_of_death;
                day = String(date_of_death.getDate()).padStart(2, "0");
                month = String(date_of_death.getMonth() + 1).padStart(2, "0"); // January is 0!
                year = date_of_death.getFullYear();
                formattedDateOfDeath = day + "/" + month + "/" + year;
            }

            res.status(200).json({
                message: "Lấy thông tin chi tiết của thành viên thành công!",
                memberDetail: {
                    _id: memberDetail._id,
                    member_id: memberDetail.member_id,
                    fullname: memberDetail.fullname,
                    gender: memberDetail.gender,
                    date_of_birth: formattedDateOfBirth,
                    place_of_birth: memberDetail.place_of_birth,
                    date_of_death: formattedDateOfDeath,
                    place_of_death: memberDetail.place_of_death,
                    images: memberDetail.images,
                    background_desc: memberDetail.background_desc,
                },
            });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getMemberDetail2 = async (req, res, next) => {
    const member_id = req.params.id;
    try {
        const memberDetail = await MemberDetails.findOne({
            member_id: member_id,
        });
        if (!memberDetail) {
            const member = await Members.findOne({
                _id: member_id,
            });
            if (!member) {
                const error = new Error(
                    "Không tìm thấy thông tin chi tiết của thành viên!"
                );
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: "Lấy thông tin chi tiết của thành viên thành công!",
                memberDetail: {
                    _id: member._id,
                    member_id: member.member_id,
                    fullname: member.fullname,
                    gender: member.gender,
                    date_of_birth: "",
                    place_of_birth: "",
                    date_of_death: "",
                    place_of_death: "",
                    parent: member.parent,
                    spouse: member.spouse,
                    children: member.children,
                    images:
                        member.images ||
                        "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png",
                    background_desc: "",
                },
            });
        } else {
            const member = await Members.findOne({
                _id: member_id,
            });

            if (!member) {
                const error = new Error(
                    "Không tìm thấy thông tin chi tiết của thành viên!"
                );
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                message: "Lấy thông tin chi tiết của thành viên thành công!",
                memberDetail: {
                    _id: memberDetail._id,
                    member_id: memberDetail.member_id,
                    fullname: memberDetail.fullname,
                    gender: memberDetail.gender,
                    date_of_birth: memberDetail.date_of_birth,
                    place_of_birth: memberDetail.place_of_birth,
                    date_of_death: memberDetail.date_of_death,
                    place_of_death: memberDetail.place_of_death,
                    parent: member.parent,
                    spouse: member.spouse,
                    children: member.children,
                    images: memberDetail.images,
                    background_desc: memberDetail.background_desc,
                },
            });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
