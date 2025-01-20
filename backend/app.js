const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const models = require("./models");
const controller = require("./controllers/post.controller");
const userController = require("./controllers/user.controller");
const commentController = require("./controllers/comment.controller");
const followerController = require("./controllers/follower.controller");
const messageController = require("./controllers/message.controller");
const session = require("express-session");

const db = require("./models");

const app = express();
const bodyParser = require("body-parser");
app.use(
  session({
    secret: "my test secret",
    cookie: {},
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

db.sequelize.sync().then(() => {});

// set port, listen for requests
const PORT = process.env.VITE_PORT || process.env.PORT || 8080 || 3001;
// const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/post.routes")(app);
require("./routes/comment.routes")(app);
require("./routes/follower.routes")(app);
require("./routes/message.routes")(app);

module.exports = app;
