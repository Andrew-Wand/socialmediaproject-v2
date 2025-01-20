module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comment", {
    comment_text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    owner: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Comment;
};
