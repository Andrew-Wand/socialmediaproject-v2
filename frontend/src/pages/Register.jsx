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
      <div className="alert alert-danger" role="alert">
        This field is required!
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

const Register = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

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
    <div className="min-h-screen flex justify-center items-start bg-base-300">
      <div className="card w-96 bg-base-300  h-[45rem]">
        <header className="mt-5 ml-5">
          <h1 className="card-title justify-start text-2xl">Log In</h1>
        </header>

        <div className="card-body items-center justify-center text-center">
          <div className="card-actions">
            <div>
              <Form onSubmit={handleRegister} ref={form}>
                <div className="mt-3">
                  <label htmlFor="username" className="text-xl">
                    Username
                  </label>
                  <Input
                    type="text"
                    name="username"
                    value={username}
                    onChange={onChangeUsername}
                    validations={[required, vusername]}
                    className="input input-bordered bg-slate-100 shadow-lg mt-2 h-[2.5rem]"
                  />
                </div>
                <div className="mt-3">
                  <label htmlFor="email" className="text-xl">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChangeEmail}
                    validations={[required, validEmail]}
                    className="input input-bordered bg-slate-100 shadow-lg mt-2 h-[2.5rem]"
                  />
                </div>
                <div className="mt-3">
                  <label htmlFor="password" className="text-xl">
                    Password
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChangePassword}
                    validations={[required, vpassword]}
                    className="input input-bordered bg-slate-100 shadow-lg mt-2 h-[2.5rem]"
                  />
                </div>

                <div className="mt-6">
                  <button className="btn btn-wide btn-info">
                    <span>Sign up</span>
                  </button>
                </div>
                <div className="divider">or</div>

                <div className="mt-5">
                  <Link to={"/sign-in"} className="btn btn-wide btn-neutral">
                    Sign In
                  </Link>
                </div>

                {message && <div>{message}</div>}
                <CheckButton ref={checkBtn} style={{ display: "none" }} />
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>

    // <div>
    //   <div>
    // <Form onSubmit={handleRegister} ref={form}>
    //   <div>
    //     <label htmlFor="first_name">First Name</label>
    //     <Input
    //       type="text"
    //       name="first_name"
    //       value={firstName}
    //       onChange={onChangeFirstName}
    //       validations={[required]}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="last_name">Last Name</label>
    //     <Input
    //       type="text"
    //       name="last_name"
    //       value={lastName}
    //       onChange={onChangeLastName}
    //       validations={[required]}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="username">Username</label>
    //     <Input
    //       type="text"
    //       name="username"
    //       value={username}
    //       onChange={onChangeUsername}
    //       validations={[required, vusername]}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="email">Email</label>
    //     <Input
    //       type="email"
    //       name="email"
    //       value={email}
    //       onChange={onChangeEmail}
    //       validations={[required, validEmail]}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="password">Password</label>
    //     <Input
    //       type="password"
    //       name="password"
    //       value={password}
    //       onChange={onChangePassword}
    //       validations={[required, vpassword]}
    //     />
    //   </div>

    //   <div>
    //     <button>
    //       <span>Sign up</span>
    //     </button>
    //   </div>

    //   {message && <div>{message}</div>}
    //   <CheckButton ref={checkBtn} style={{ display: "none" }} />
    // </Form>
    //   </div>
    // </div>
  );
};

export default Register;
