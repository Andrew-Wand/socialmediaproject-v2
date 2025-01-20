require("dotenv").config();
const Sequelize = require("sequelize");

// const db_url =

const db_name = "postgres";

const db_user = "postgres.nyghrdxtnpowbwajnqmu";

const db_host = "aws-0-us-east-1.pooler.supabase.com";

const db_password = "M00shym00m001!";

// const db_name = "socialmediaproject";

// const db_user = "postgres";

// const db_host = "165.232.148.251";

// const db_password = "m00shym00m00321";
// let sequelize;

// if (process.env.DB_URL) {
//   sequelize = new Sequelize(process.env.DB_URL);
// } else {
//   sequelize = new Sequelize(
//     process.env.VITE_DATABASE_NAME,
//     process.env.VITE_DATABASE_USER,
//     process.env.VITE_DATABASE_PASSWORD,
//     {
//       host: "localhost",
//       dialect: "postgres",
//     }
//   );
// }

// const sequelize = new Sequelize(
//   "postgresdb_eocs",
//   "postgresdb_eocs_user",
//   "bzV5avV0fFiFvOiw069FXWXX0hDhYinP",
//   {
//     dialect: "postgres",
//   }
// );

// const sequelize = new Sequelize(
//   process.env.VITE_DATABASE_NAME,
//   process.env.VITE_DATABASE_USER,
//   process.env.VITE_DATABASE_PASSWORD,
//   {
//     dialect: "postgres",
//   }
// );

const sequelize = new Sequelize(db_name, db_user, db_password, {
  dialect: "postgres",
  host: db_host,
});

// const sequelize = new Sequelize(
//   "postgresql://postgresdb_eocs_user:bzV5avV0fFiFvOiw069FXWXX0hDhYinP@dpg-crce44t2ng1s739roh90-a/postgresdb_eocs",
//   {
//     dialect: "postgres",
//   }
// );

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("../models/user")(sequelize, Sequelize);
db.posts = require("../models/post")(sequelize, Sequelize);
db.comments = require("../models/comment")(sequelize, Sequelize);
db.likes = require("../models/likes")(sequelize, Sequelize);
db.followers = require("../models/follower")(sequelize, Sequelize);
db.messages = require("../models/message")(sequelize, Sequelize);

db.users.hasMany(db.posts, { as: "posts" });
db.users.hasMany(db.likes, { as: "likes" });

db.posts.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

db.posts.hasMany(db.comments, { as: "comments" });
db.posts.hasMany(db.likes, { as: "likes" });

db.likes.belongsTo(db.posts, {
  foreignKey: "postId",
  as: "post",
});

db.likes.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

db.comments.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

db.comments.belongsTo(db.posts, {
  foreignKey: "postId",
  as: "post",
});

db.users.belongsToMany(db.users, {
  as: "followers",
  foreignKey: "userId",
  through: db.followers,
});

db.users.belongsToMany(db.users, {
  as: "userFollowers",
  foreignKey: "followerId",
  through: db.followers,
});

module.exports = db;
