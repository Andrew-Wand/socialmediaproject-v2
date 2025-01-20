import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Loading from "../components/Loading";

import AuthService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="label">
        <span className="label-text text-[#bd5664]">
          Please fill out this field
        </span>
      </div>
    );
  }
};

const SignInModal = ({ onLogin }) => {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);

  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };
  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const closeModal = () => {
    document.getElementById("my_modal_5").close();
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(username, password).then(
        (response) => {
          setMessage(response.data);
          setSuccessful(true);
          if (response) {
            closeModal();

            setLoading(true);

            navigate(`/main/${response}`);
            // window.location.reload();
          }
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
    // navigate(`/main/${currentUser.id}`);
    // window.location.reload();
  };

  const openSignUpModal = () => {
    document.getElementById("my_modal_5").close();
    document.getElementById("my_modal_6").showModal();
  };

  return (
    <>
      <button
        className="btn text-black btn-wide xl:btn-sm xl:h-[2.5rem] xl:w-[18rem] w-[20rem] rounded-full bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] "
        onClick={() => document.getElementById("my_modal_5").showModal()}
      >
        Sign In
      </button>
      <dialog
        id="my_modal_5"
        className="modal modal-bottom sm:modal-middle"
        open=""
      >
        <div className="modal-box h-[60%] xl:h-[37rem] xl:w-[50rem] ">
          <h3 className="font-bold text-2xl ml-[3.5rem] xl:ml-[6.5rem] bg-gradient-to-t from-[#B8DBFC] to-[#F8FBFE] bg-clip-text text-transparent  ">
            Log In
          </h3>

          {/* <p className="py-4">
            Press ESC key or click the button below to close
          </p> */}
          <div className="modal-action justify-center ">
            <Form onSubmit={handleLogin} ref={form}>
              <div>
                <label
                  htmlFor="username"
                  className="text-xl bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent"
                >
                  Username
                </label>
                <Input
                  type="text"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required]}
                  autoComplete="off"
                  className="input input-bordered shadow-lg mt-2 w-full"
                />
              </div>
              <div className="mt-3">
                <label
                  htmlFor="password"
                  className="text-xl bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent"
                >
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required]}
                  className="input input-bordered shadow-lg mt-2 w-full "
                />
              </div>

              <div className="mt-10">
                <button className="btn btn-wide text-black bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF]">
                  <span>Login</span>
                </button>
              </div>
              <div className="divider">or</div>
              <div className="">
                {/* <Link to={"/register"} className="btn btn-wide btn-neutral">
                  Sign Up
                </Link> */}
                <button
                  className="btn btn-wide bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF] text-black"
                  onClick={openSignUpModal}
                >
                  Sign Up
                </button>
              </div>

              <CheckButton ref={checkBtn} style={{ display: "none" }} />
            </Form>

            <form method="dialog" className="absolute top-5 right-5">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-circle bg-gradient-to-t from-[#C0E8FF] to-[#ACAAFF] text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
        {message && (
          <div className="toast toast-center">
            <div className="alert alert-info">
              <span>{message}</span>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
};

export default SignInModal;
