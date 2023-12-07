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
    const page = parseInt(req.query.page) || 1; //Default to page 1
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10; //Default to 10 items per page

    const families = await Families.find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const totalItems = await Families.countDocuments();

    res.status(200).json({
      message: "Lấy dữ liệu tất cả dòng họ thành công!",
      families: families,
      totalItems: totalItems,
      currentPage: page,
      itemsPerPage: itemsPerPage,
      totalPages: Math.ceil(totalItems / itemsPerPage),
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
      (member) =>
        (member.parent.length === 0 || !member.parent) && member.gender !== "Nữ"
    );

    if (!root) {
      return res.status(200).json({
        message: "Lấy dữ liệu dòng họ thành công!",
        family: family,
        familyTree: null,
      });
    }

    let childrenField = [];
    if (root.children) {
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
    }

    let spouseField = [];
    if (root.spouse) {
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
    }

    root = {
      firstPerson: {
        id: root._id.toString(),
        fullname: root.fullname,
        gender: root.gender,
        image:
          root.images ||
          "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png",
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

    var root_dob = "";
    var root_dod = "";
    var root_image = "";
    const rootDetail = await MemberDetail.findOne({ member_id: root._id });
    if (rootDetail) {
      root_dob = rootDetail.date_of_birth;
      root_dod = rootDetail.date_of_death;
      root_image = rootDetail.images;
    }

    let childrenField = [];
    if (root.children) {
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
    }
    let spouseField = [];
    if (root.spouse) {
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
    }
    root = {
      id: root._id.toString(),
      fullname: root.fullname,
      gender: root.gender,
      dob: root_dob,
      dod: root_dod,
      image:
        root_image ||
        "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png",
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

    console.log("Spouse", spouse);

    const spouseDetail = await MemberDetail.findOne({
      member_id: spouse._id,
    });
    var spouse_dob = "";
    var spouse_dod = "";
    var spouse_image = "";
    if (spouseDetail) {
      spouse_dob = spouseDetail.date_of_birth;
      spouse_dod = spouseDetail.date_of_death;
      spouse_image = spouseDetail.images;
    }
    root.spouse[i] = {
      id: spouse._id.toString(),
      fullname: spouse.fullname,
      gender: spouse.gender,
      dob: spouse_dob,
      dod: spouse_dod,
      image:
        spouse_image ||
        "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png",
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

      var child_dob = "";
      var child_dod = "";
      var child_image = "";
      const childDetail = await MemberDetail.findOne({
        member_id: childMain._id,
      });
      if (childDetail) {
        child_dob = childDetail.date_of_birth;
        child_dod = childDetail.date_of_death;
        child_image = childDetail.images;
      }

      //children cua thang childMain
      let childrenField = [];
      if (root.children) {
        for (let i = 0; i < childMain.children.length; i++) {
          let child = members.find(
            (member) =>
              member._id.toString() === childMain.children[i].toString()
          );
          if (!child) {
            const error = new Error("Không tìm thấy thành viên trong dòng họ!");
            error.statusCode = 404;
            throw error;
          }
          childrenField.push(child._id.toString());
        }
      }

      let spouseField = [];
      if (root.spouse) {
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
      }

      root.children[i] = {
        id: childMain._id.toString(),
        fullname: childMain.fullname,
        gender: childMain.gender,
        dob: child_dob,
        dod: child_dod,
        image:
          child_image ||
          "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png",
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
    root.spouse[i] = {
      id: spouse._id.toString(),
      fullname: spouse.fullname,
      gender: spouse.gender,
      image:
        spouse.images ||
        "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png",
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
          image:
            childMain.images ||
            "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png",
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
