import axios from "axios";

const API_URL = "http://localhost:8080/test/";

const postCreatePost = (Title, Text, userId, owner) => {
  return axios
    .post(API_URL + "create-post", {
      Title,
      Text,
      userId,
      owner,
    })
    .then((response) => {
      return response;
    });
};

const deletePost = (postId) => {
  return axios.delete(API_URL + "delete-post", {
    data: {
      postId,
    },
  });
};

const getMyHomeFeed = (userId, params) => {
  return axios.get(API_URL + `getMyHomeFeed/${userId}`, { params });
};
const getAllPosts = (userId, params) => {
  return axios.get(API_URL + `getAllPosts/${userId}`, { params });
};

const getSinglePost = (postId) => {
  return axios.get(API_URL + `post/${postId}`);
};

const createLike = (total, username, postId, userId) => {
  return axios.post(API_URL + "create-like", {
    total,
    username,
    postId,
    userId,
  });
};

const getAllLikes = () => {
  return axios.get(API_URL + "getLikes");
};

// Comments
const postCreateComment = (comment_text, postId, userId, owner) => {
  return axios
    .post(API_URL + "create-comment", {
      comment_text,
      postId,
      userId,
      owner,
    })
    .then((response) => {
      return response.data;
    });
};
const deleteComment = (commentId) => {
  return axios.delete(API_URL + "delete-comment", {
    data: {
      commentId,
    },
  });
};

const getPostComments = (postId, params) => {
  return axios.get(API_URL + `getPostComments/${postId}`, { params });
};

const PostService = {
  postCreatePost,
  getMyHomeFeed,
  getSinglePost,
  postCreateComment,
  createLike,
  getAllLikes,
  getAllPosts,
  deletePost,
  getPostComments,
  deleteComment,
};

export default PostService;
