const { validationResult } = require("express-validator");

const Families = require("../models/families");
const Members = require("../models/members");
const MemberDetail = require("../models/memberDetail");
const mongoose = require("mongoose");

//thư viện xóa bỏ dấu tiếng việt
const removeAccents = require("remove-accents");

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
  const background = req.body.background;
  const logo = req.body.logo;
  try {
    const family = new Families({
      name: family_name,
      admin: [admin_id],
      background: background,
      logo: logo,
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
      const error = new Error("Bạn không có quyền thực hiện hành động này!");
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
      const error = new Error("Bạn không có quyền thực hiện hành động này!");
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
    let root = members.find(
      (member) => member.parent.length === 0 || !member.parent
    );

    const rootDetail = await MemberDetail.findOne({ member_id: root._id });
    if (!rootDetail) {
      const error = new Error("Không tìm thấy thông tin thành viên");
      error.statusCode = 404;
      throw error;
    }

    let childrenField = [];
    for (let i = 0; i < root.children.length; i++) {
      let child = members.find(
        (member) => member._id.toString() === root.children[i].toString()
      );
      if (!child) {
        const error = new Error("Không tìm thấy thành viên trong dòng họ!");
        error.statusCode = 404;
        throw error;
      }
      childrenField.push(child._id.toString());
    }
    let spouseField = [];
    for (let i = 0; i < root.spouse.length; i++) {
      let spouse = members.find(
        (member) => member._id.toString() === root.spouse[i].toString()
      );
      if (!spouse) {
        const error = new Error("Không tìm thấy thành viên trong dòng họ!");
        error.statusCode = 404;
        throw error;
      }
      spouseField.push(spouse._id.toString());
    }
    root = {
      firstPerson: {
        id: root._id.toString(),
        fullname: root.fullname,
        gender: root.gender,
        dob: rootDetail.date_of_birth,
        dod: rootDetail.date_of_death,
      },
      spouse: spouseField,
      children: childrenField,
    };
    await getTreeFamily(members, root);

    res.status(200).json({
      message: "Lấy dữ liệu dòng họ thành công!",
      family: family,
      familyTree: root,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getFamilyTree = async (req, res, next) => {
  const family_id = req.params.id;
  try {
    const members = await Members.find({ family_id: family_id });
    if (!members) {
      const error = new Error("Không tìm thấy thành viên trong dòng họ!");
      error.statusCode = 404;
      throw error;
    }

    //Tạo cây dòng họ
    let root = members.find(
      (member) => member.parent.length === 0 || !member.parent
    );

    const rootDetail = await MemberDetail.findOne({ member_id: root._id });
    if (!rootDetail) {
      const error = new Error("Không tìm thấy thông tin thành viên");
      error.statusCode = 404;
      throw error;
    }

    let childrenField = [];
    for (let i = 0; i < root.children.length; i++) {
      let child = members.find(
        (member) => member._id.toString() === root.children[i].toString()
      );
      if (!child) {
        const error = new Error("Không tìm thấy thành viên trong dòng họ!");
        error.statusCode = 404;
        throw error;
      }
      childrenField.push(child._id.toString());
    }
    let spouseField = [];
    for (let i = 0; i < root.spouse.length; i++) {
      let spouse = members.find(
        (member) => member._id.toString() === root.spouse[i].toString()
      );
      if (!spouse) {
        const error = new Error("Không tìm thấy thành viên trong dòng họ!");
        error.statusCode = 404;
        throw error;
      }
      spouseField.push(spouse._id.toString());
    }
    root = {
      id: root._id.toString(),
      fullname: root.fullname,
      gender: root.gender,
      dob: rootDetail.date_of_birth,
      dod: rootDetail.date_of_death,
      spouse: spouseField,
      children: childrenField,
    };
    await getTreeFamily2(members, root);

    res.status(200).json({
      message: "Lấy dữ liệu dòng họ thành công!",
      familyTree: [root],
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

async function getTreeFamily2(members, root) {
  //add spouse
  for (let i = 0; i < root.spouse.length; i++) {
    let spouse = members.find(
      (member) => member._id.toString() === root.spouse[i]
    );
    if (!spouse) {
      const error = new Error("Không tìm thấy thành viên trong dòng họ!");
      error.statusCode = 404;
      throw error;
    }

    const objectIdMemberId = new mongoose.Types.ObjectId(spouse.id);
    const spouseDetail = await MemberDetail.findOne({
      member_id: objectIdMemberId,
    });
    if (!spouseDetail) {
      const error = new Error("Không tìm thấy thông tin thành viên");
      error.statusCode = 404;
      throw error;
    }
    root.spouse[i] = {
      id: spouse._id.toString(),
      fullname: spouse.fullname,
      gender: spouse.gender,
      dob: spouseDetail.date_of_birth,
      dod: spouseDetail.date_of_death,
    };
  }
  if (root.children.length === 0) {
    return root;
  } else {
    //add children
    for (let i = 0; i < root.children.length; i++) {
      let childMain = members.find(
        (member) => member._id.toString() === root.children[i]
      );
      if (!childMain) {
        const error = new Error("Không tìm thấy thành viên trong dòng họ!");
        error.statusCode = 404;
        throw error;
      }

      const objectIdMemberId = new mongoose.Types.ObjectId(childMain.id);
      const childDetail = await MemberDetail.findOne({
        member_id: objectIdMemberId,
      });
      if (!childDetail) {
        const error = new Error("Không tìm thấy thông tin thành viên");
        error.statusCode = 404;
        throw error;
      }

      //children cua thang childMain
      let childrenField = [];
      for (let i = 0; i < childMain.children.length; i++) {
        let child = members.find(
          (member) => member._id.toString() === childMain.children[i].toString()
        );
        if (!child) {
          const error = new Error("Không tìm thấy thành viên trong dòng họ!");
          error.statusCode = 404;
          throw error;
        }
        childrenField.push(child._id.toString());
      }

      let spouseField = [];
      for (let i = 0; i < childMain.spouse.length; i++) {
        let spouse = members.find(
          (member) => member._id.toString() === childMain.spouse[i].toString()
        );
        if (!spouse) {
          const error = new Error("Không tìm thấy thành viên trong dòng họ!");
          error.statusCode = 404;
          throw error;
        }
        spouseField.push(spouse._id.toString());
      }

      root.children[i] = {
        id: childMain._id.toString(),
        fullname: childMain.fullname,
        gender: childMain.gender,
        dob: childDetail.date_of_birth,
        dod: childDetail.date_of_death,
        spouse: spouseField,
        children: childrenField,
      };

      await getTreeFamily2(members, root.children[i]);
    }
  }
}

async function getTreeFamily(members, root) {
  //add spouse
  for (let i = 0; i < root.spouse.length; i++) {
    let spouse = members.find(
      (member) => member._id.toString() === root.spouse[i]
    );
    if (!spouse) {
      const error = new Error("Không tìm thấy thành viên trong dòng họ!");
      error.statusCode = 404;
      throw error;
    }

    const objectIdMemberId = new mongoose.Types.ObjectId(spouse.id);
    const spouseDetail = await MemberDetail.findOne({
      member_id: objectIdMemberId,
    });
    if (!spouseDetail) {
      const error = new Error("Không tìm thấy thông tin thành viên");
      error.statusCode = 404;
      throw error;
    }
    root.spouse[i] = {
      id: spouse._id.toString(),
      fullname: spouse.fullname,
      gender: spouse.gender,
      dob: spouseDetail.date_of_birth,
      dod: spouseDetail.date_of_death,
    };
  }
  if (root.children.length === 0) {
    return root;
  } else {
    //add children
    for (let i = 0; i < root.children.length; i++) {
      let childMain = members.find(
        (member) => member._id.toString() === root.children[i]
      );
      if (!childMain) {
        const error = new Error("Không tìm thấy thành viên trong dòng họ!");
        error.statusCode = 404;
        throw error;
      }

      const objectIdMemberId = new mongoose.Types.ObjectId(childMain.id);
      const childDetail = await MemberDetail.findOne({
        member_id: objectIdMemberId,
      });
      if (!childDetail) {
        const error = new Error("Không tìm thấy thông tin thành viên");
        error.statusCode = 404;
        throw error;
      }

      //children cua thang childMain
      let childrenField = [];
      for (let i = 0; i < childMain.children.length; i++) {
        let child = members.find(
          (member) => member._id.toString() === childMain.children[i].toString()
        );
        if (!child) {
          const error = new Error("Không tìm thấy thành viên trong dòng họ!");
          error.statusCode = 404;
          throw error;
        }
        childrenField.push(child._id.toString());
      }

      let spouseField = [];
      for (let i = 0; i < childMain.spouse.length; i++) {
        let spouse = members.find(
          (member) => member._id.toString() === childMain.spouse[i].toString()
        );
        if (!spouse) {
          const error = new Error("Không tìm thấy thành viên trong dòng họ!");
          error.statusCode = 404;
          throw error;
        }
        spouseField.push(spouse._id.toString());
      }

      root.children[i] = {
        firstPerson: {
          id: childMain._id.toString(),
          fullname: childMain.fullname,
          gender: childMain.gender,
          dob: childDetail.date_of_birth,
          dod: childDetail.date_of_death,
        },
        spouse: spouseField,
        children: childrenField,
      };

      await getTreeFamily(members, root.children[i]);
    }
  }
}

//search family by name
exports.searchFamily = async (req, res, next) => {
  const text = removeAccents(req.query.text).toLowerCase();
  try {
    const families = await Families.find().lean();
    const matchedFamilies = families.filter((family) =>
      removeAccents(family.name).toLowerCase().includes(text)
    );
    res.status(200).json({
      message: "Tìm kiếm dòng họ thành công!",
      families: matchedFamilies,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
