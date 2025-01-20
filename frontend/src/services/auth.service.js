import axios from "axios";

const API_URL = "http://localhost:8080/auth/";

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("SMuser", JSON.stringify(response.data));
        return response.data.id;
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("SMuser");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("SMuser"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
