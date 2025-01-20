module.exports = (sequelize, Sequelize) => {
  const Likes = sequelize.define("like", {
    total: {
      type: Sequelize.INTEGER,
    },
    username: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    postId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  });

  return Likes;
};
