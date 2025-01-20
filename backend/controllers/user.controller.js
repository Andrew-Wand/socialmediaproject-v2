const db = require("../models");
const User = db.users;
const Follower = db.followers;
const Post = db.posts;
const { Op } = require("sequelize");
const uploadFile = require("../middleware/upload/cloudinary");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.findUserById = async (req, res) => {
  const user = await User.findByPk(req.params.profileId, {
    include: [
      {
        model: User,
        as: "userFollowers",

        through: {
          attributes: [],
        },
      },
      {
        model: Post,
        as: "posts",
        include: ["comments"],
      },
    ],
  });
  return res.send(user);
};

exports.findAllUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      include: [
        {
          model: User,
          as: "userFollowers",

          through: {
            attributes: [],
          },
        },
      ],
    });

    res.status(200).send(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Find Users page/pagination

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, users, totalPages, currentPage };
};

exports.findUsersPage = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  try {
    const data = await User.findAndCountAll({
      include: [
        {
          model: User,
          as: "userFollowers",

          through: {
            attributes: [],
          },
        },
      ],
      limit,
      offset,
      distinct: true,
    });

    const response = getPagingData(data, page, limit);
    res.status(200).send(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
exports.findMyFollowers = async (req, res) => {
  try {
    const response = await User.findAll({
      include: [
        {
          model: User,
          as: "userFollowers",
          where: {
            id: req.body.id,
          },
        },
      ],
    });

    res.status(200).send(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

exports.updateProfile = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await User.update(
      {
        email: req.body.email,
        about_me: req.body.about_me,
      },
      {
        where: { id: id },
      }
    );

    if (result == 1) {
      res.send({ message: "update successfull" });
    }
  } catch (error) {
    res.status(500).send({ message: "error uploading" });
  }
};

exports.updateProfilePic = async (req, res) => {
  const id = req.params.id;

  try {
    const upload = await uploadFile(req.file.path, "MyBlogPics");
    const result = await User.update(
      {
        image_url: upload.secure_url,
      },
      {
        where: { id: id },
      }
    );

    if (result == 1) {
      res.send({ message: "update successfull" });
    }
  } catch (error) {
    res.status(500).send({ message: "error uploading" });
  }
};
