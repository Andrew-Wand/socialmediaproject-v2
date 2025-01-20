const db = require("../models");
const Post = db.posts;
const Like = db.likes;
const User = db.users;
const Comment = db.comments;
const Follower = db.followers;

const { Op } = require("sequelize");
exports.createPost = async (req, res) => {
  return Post.create({
    Title: req.body.Title,
    Text: req.body.Text,
    userId: req.body.userId,
    owner: req.body.owner,
  })
    .then((post) => {
      console.log("Created post: " + JSON.stringify(post, null, 4));
      res.send(post);
      return post;
    })
    .catch((err) => {
      console.log("Error while creating post: ", err);
    });
};

exports.deletePost = async (req, res) => {
  try {
    await Post.destroy({
      where: {
        id: req.body.postId,
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

exports.findPostById = async (req, res) => {
  const post = await Post.findByPk(req.params.postId, {
    include: [
      "likes",
      {
        model: User,
        as: "user",
        attributes: ["image_url"],
      },
    ],
  });
  return res.send(post);
};

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: comments } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, comments, totalPages, currentPage };
};
exports.getPostComments = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Comment.findAndCountAll({
    where: {
      postId: req.params.postId,
    },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["image_url"],
      },
    ],
    limit,
    offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while retreiving tutorials.",
      });
    });
};

const getHomeFeedPagingData = (data, page, limit) => {
  const { count: totalItems, rows: posts } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, posts, totalPages, currentPage };
};

exports.getAllPosts = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  try {
    const response = await Post.findAndCountAll({
      include: [
        { model: Comment, as: "comments" },
        // limit the likes based on the logged in user
        {
          model: Like,
          as: "likes",
          required: false,
          // where: { userId: req.params.userId },
        },
        {
          model: User,
          as: "user",
          attributes: ["username", "image_url"],
          include: "userFollowers",
        },
      ],
      distinct: true,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    // const newArr = await response.flatMap((x) => x);

    const allPostData = getHomeFeedPagingData(response, page, limit);

    res.status(200).send(allPostData);
    // console.log(post);
    // return followed;
  } catch (error) {
    console.log(error);
  }
};

exports.getMyHomeFeed = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  try {
    const response = await Promise.all([
      await Follower.findAll({
        attributes: ["followerId"],
        where: {
          userId: req.params.userId,
        },
      }),
    ]);

    const newArr = response.flatMap((x) => x);

    const result = newArr.map((x) => x.followerId);

    const findPost = await Post.findAndCountAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username", "image_url"],
          include: "userFollowers",
        },
        { model: Comment, as: "comments" },
        // limit the likes based on the logged in user
        {
          model: Like,
          as: "likes",
          required: false,
          // where: { userId: req.params.userId },
        },
      ],
      distinct: true,

      order: [["createdAt", "DESC"]],
      limit,
      offset,
      where: {
        [Op.or]: [{ userId: result }, { userId: req.params.userId }],
      },
    });

    const feedData = getHomeFeedPagingData(findPost, page, limit);

    res.status(200).send(feedData);
  } catch (error) {
    console.log(error);
  }
};

exports.createLike = async (req, res) => {
  // fetch created and post at the same time
  const [created, post] = await Promise.all([
    Like.findOne({
      where: {
        userId: req.body.userId,
        postId: req.body.postId,
      },
    }),
    Post.findOne({
      where: {
        id: req.body.postId,
      },
      order: [["createdAt", "ASC"]],
    }),
  ]);

  // no post, no updates
  if (!post) {
    return res.status(200).send({
      message: "there is no post to be liked",
    });
  }

  // we are going to make updates, so use a transaction, you will need to reference sequelize
  let transaction;
  try {
    transaction = await db.sequelize.transaction();

    if (!created && post) {
      // use Promise.all() for concurrency
      await Promise.all([
        Like.create(
          {
            total: req.body.total,
            username: req.body.username,
            userId: req.body.userId,
            postId: req.body.postId,
          },
          { transaction }
        ),
        post.increment("likeCounts", { by: 1, transaction }),
        post.update({ liked: req.body.userId ? true : false }, { transaction }),
      ]);

      await transaction.commit();

      return res.status(200).send({
        message: "You liked this post",
      });
    }

    await Promise.all([
      Like.destroy(
        {
          where: {
            userId: req.body.userId,
            postId: req.body.postId,
          },
        },
        { transaction }
      ),
      post.decrement("likeCounts", { by: 1, transaction }),
    ]);

    await transaction.commit();

    return res.status(200).send({
      message: "You unliked this post",
    });
  } catch (err) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log("There was an error", err);
    return res.status(500);
  }
};
