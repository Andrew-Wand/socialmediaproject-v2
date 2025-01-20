const controller = require("../controllers/post.controller");
const { authJwt } = require("../middleware");

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

  app.post("/test/create-post", controller.createPost);

  app.get("/test/getMyHomeFeed/:userId", controller.getMyHomeFeed);
  app.get("/test/getAllPosts/:userId", controller.getAllPosts);
  app.get("/test/post/:postId", controller.findPostById);
  app.post("/test/create-like", controller.createLike);
  app.delete("/test/delete-post", controller.deletePost);
  app.get("/test/getPostComments/:postId", controller.getPostComments);
};
