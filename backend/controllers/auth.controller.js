require("dotenv").config();
const db = require("../models");
const User = db.users;
const uploadFile = require("../middleware/upload/cloudinary");

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const upload = await uploadFile(
    "/Users/andrew-wand/Documents/NodeJS-Odin-Project/social-media-project/backend/public/images/Default_pfp.jpg",
    "MyBlogPics"
  );

  const aboutMeDefault = "";

  // Save user to database
  const newPassword = await bcrypt.hashSync(req.body.password, 8);
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: newPassword,
    image_url: upload.secure_url,
    about_me: aboutMeDefault,
  });

  await user.save();
  res.send({ message: "User successfully registered!" });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Username or password not found. Try again." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Username or password not found. Try again.",
        });
      }

      const token = jwt.sign({ id: user.id }, process.env.VITE_MY_SECRET, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });
      // redirect(`/main/${user.id}`);
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        image_url: user.image_url,
        about_me: user.about_me,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
