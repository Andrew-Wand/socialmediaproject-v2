const db = require("../models");
const User = db.users;
const Follower = db.followers;

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: "userFollowers",
    });
    if (!user) throw new Error("User not found!");
    res.send(user.userFollowers);
  } catch (error) {
    res.send(error.message);
  }
};

exports.createFollower = async (req, res) => {
  // fetch created and post at the same time
  const [created] = await Promise.all([
    Follower.findOne({
      where: {
        userId: req.body.userId,
        followerId: req.body.followerId,
      },
    }),
  ]);

  // we are going to make updates, so use a transaction, you will need to reference sequelize
  let transaction;
  try {
    transaction = await db.sequelize.transaction();

    if (!created) {
      // use Promise.all() for concurrency
      await Promise.all([
        Follower.create(
          {
            name: req.body.name,
            userId: req.body.userId,
            followerId: req.body.followerId,
          },
          { transaction }
        ),
      ]);

      await transaction.commit();

      return res.status(200).send({
        message: "You followed this user",
      });
    }

    await Promise.all([
      Follower.destroy(
        {
          where: {
            userId: req.body.userId,
            followerId: req.body.followerId,
          },
        },
        { transaction }
      ),
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
  // return Follower.create({
  //   name: req.body.name,
  //   userId: req.body.userId,
  //   followerId: req.body.followerId,
  // })
  //   .then((follower) => {
  //     console.log(">> Created follower: " + JSON.stringify(follower, null, 2));
  //     res.send(follower);
  //     return follower;
  //   })
  //   .catch((err) => {
  //     console.log(">> Error while creating Tag: ", err);
  //   });
};
// exports.findAllFollowers = () => {
//   return Follower.findAll({
//     include: [
//       {
//         model: User,
//         as: "users",
//       },
//     ],
//   })
//     .then((followers) => {
//       return followers;
//     })
//     .catch((err) => {
//       console.log(">> Error while retrieving followers: ", err);
//     });
// };

// exports.findFollowerById = (id) => {
//   return Follower.findByPk(id, {
//     include: [
//       {
//         model: User,
//         as: "users",
//       },
//     ],
//   })
//     .then((follower) => {
//       return follower;
//     })
//     .catch((err) => {
//       console.log(">> Error while finding followers: ", err);
//     });
// };

// exports.addUser = (followerId, userId) => {
//   return Follower.findByPk(followerId)
//     .then((follower) => {
//       if (!follower) {
//         console.log("Tag not found!");
//         return null;
//       }
//       return User.findByPk(userId).then((user) => {
//         if (!user) {
//           console.log("Tutorial not found!");
//           return null;
//         }

//         follower.addUser(user);
//         console.log(`>> added Tutorial id=${user.id} to Tag id=${follower.id}`);
//         return tag;
//       });
//     })
//     .catch((err) => {
//       console.log(">> Error while adding Tutorial to Tag: ", err);
//     });
// };
