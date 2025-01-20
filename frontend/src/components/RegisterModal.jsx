import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

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

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const RegisterModal = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(false);

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };
  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };
  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const closeModal = () => {
    document.getElementById("my_modal_6").close();
  };
  const openSignInModal = () => {
    document.getElementById("my_modal_6").close();
    document.getElementById("my_modal_5").showModal();
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(username, email, password).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
          closeModal();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <>
      <button
        className="btn btn-wide xl:btn-sm xl:w-[18rem] xl:h-[2.5rem] w-[20rem] rounded-full bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF] text-black "
        onClick={() => document.getElementById("my_modal_6").showModal()}
      >
        Sign Up
      </button>
      <dialog
        id="my_modal_6"
        className="modal modal-bottom sm:modal-middle"
        open=""
      >
        <div className="modal-box h-[75%] xl:h-[42rem] xl:w-[50rem]">
          <h3 className="font-bold text-2xl ml-[2rem] xl:ml-[6.2rem] bg-gradient-to-t from-[#B8DBFC] to-[#F8FBFE] bg-clip-text text-transparent ">
            Register
          </h3>
          {/* <p className="py-4">
            Press ESC key or click the button below to close
          </p> */}
          <div className="modal-action justify-center ">
            <Form onSubmit={handleRegister} ref={form}>
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
                  validations={[required, vusername]}
                  autoComplete="off"
                  autoFocus={isFirstRender ? true : false}
                  className="input input-bordered  shadow-lg mt-2 h-[2.5rem] w-full "
                />
              </div>
              <div className="mt-3">
                <label
                  htmlFor="email"
                  className="text-xl bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent"
                >
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                  autoComplete="off"
                  className="input input-bordered  shadow-lg mt-2 h-[2.5rem] w-full "
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
                  validations={[required, vpassword]}
                  className="input input-bordered  shadow-lg mt-2 h-[2.5rem] w-full"
                />
              </div>

              <div className="mt-6">
                <button className="btn btn-wide bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-black">
                  <span>Sign Up</span>
                </button>
              </div>
              <div className="divider">or</div>
              <div className="">
                {/* <Link to={"/"} className="btn btn-wide btn-neutral">
                  Sign In
                </Link> */}
                <button
                  className="btn btn-wide bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF] text-black"
                  onClick={openSignInModal}
                >
                  Sign In
                </button>
              </div>

              {message && <div>{message}</div>}
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
      </dialog>
    </>
  );
};

export default RegisterModal;
