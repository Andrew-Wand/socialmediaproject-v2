const db = require("../models");
const Comment = db.comments;

exports.createComment = (req, res) => {
  return Comment.create({
    comment_text: req.body.comment_text,
    postId: req.body.postId,
    userId: req.body.userId,
    owner: req.body.owner,
  })
    .then((post) => {
      console.log("Created post: " + JSON.stringify(post, null, 4));

      return post;
    })
    .catch((err) => {
      console.log("Error while creating post: ", err);
    });
};

exports.deleteComment = async (req, res) => {
  try {
    await Comment.destroy({
      where: {
        id: req.body.commentId,
      },
    });

    res.status(200).send("Successfuly deleted post");
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "There was an error deleting this post",
    });
  }
};
