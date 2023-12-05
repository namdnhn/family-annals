const { validationResult } = require("express-validator");

const MemberDetails = require("../models/memberDetail");

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
