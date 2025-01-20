import axios from "axios";

const API_URL = "http://localhost:8080/test/";

const createFollower = (name, userId, followerId) => {
  return axios
    .post(API_URL + "createFollower", {
      name,
      userId,
      followerId,
    })
    .then((response) => {
      return response;
    });
};

const FollowService = {
  createFollower,
};

export default FollowService;
