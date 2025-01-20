const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const upload = require("../middleware/upload/multer.middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/auth/signup",
    upload.single("image"),
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signup
  );

  app.post("/auth/signin", controller.signin);
};
