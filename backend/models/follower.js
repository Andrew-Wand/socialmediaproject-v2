module.exports = (sequelize, Sequelize) => {
  const Follower = sequelize.define(
    "follower",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "user_followers",
    }
  );

  return Follower;
};
