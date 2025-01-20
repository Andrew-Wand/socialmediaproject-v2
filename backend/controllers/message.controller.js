const db = require("../models");

const Message = db.messages;

exports.sendMessage = async (req, res) => {
  const message = await Message.create({
    text: req.body.text,
    owner: req.body.owner,
    receiver: req.body.receiver,
  }).catch((error) => {
    error.statusCode = 400;
    next(error);
  });

  return res.send(message);
};

exports.messageList = async (req, res) => {
  try {
    const response = await Message.findAll();
    res.status(200).send(response);

    return response;
  } catch (error) {
    console.log(error);
  }
};
