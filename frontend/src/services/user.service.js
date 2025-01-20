import axios from "axios";

import AuthService from "./auth.service";

const currentUser = AuthService.getCurrentUser();
const id = currentUser ? currentUser.id : "";

const API_URL = "http://localhost:8080/test/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getAllUsers = () => {
  return axios.get(API_URL + "findAllUsers");
};
const getFindUsersPageData = (params) => {
  return axios.get(API_URL + "findUsersPage", { params });
};
const getUserById = (profileId) => {
  return axios.get(API_URL + `findProfileDataById/${profileId}`);
};
const findMyFollowers = (id) => {
  return axios.post(API_URL + `findMyFollowers`, {
    id,
  });
};

const editProfile = (email, about_me) => {
  return axios.put(API_URL + `updateProfile/${id}`, {
    email,
    about_me,
  });
};
const editProfilePic = (image_url) => {
  const data = new FormData();
  data.append("_method", "put");
  data.append("file", image_url);

  return axios.post(API_URL + `updateProfilePic/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const UserService = {
  getPublicContent,
  getAllUsers,
  getUserById,
  findMyFollowers,
  editProfile,
  editProfilePic,
  getFindUsersPageData,
};

export default UserService;
