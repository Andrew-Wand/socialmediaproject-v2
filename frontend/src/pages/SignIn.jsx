import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Loading from "../components/Loading";

import AuthService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return <div role="alert">This field is required!</div>;
  }
};

const SignIn = ({ setLoggedIn }) => {
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

  // const updateState = () => {
  //   const user = AuthService.getCurrentUser();
  //   if (user) {
  //     setCurrentUser(user);
  //   }
  // };

  // useEffect(() => {
  //   console.log("new state", currentUser);
  //   if (currentUser) {
  //     navigate(`/main/${currentUser.id}`);
  //   }
  // }, [currentUser]);

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
            navigate(`/main/${response}`);
            setLoading(true);
            setLoggedIn(true);
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

  return (
    <div className="min-h-screen flex justify-center items-start bg-base-300">
      <div className="card w-96 bg-base-300  h-[32rem]">
        <header className="mt-48">
          <h1 className="card-title justify-center text-2xl">Log In</h1>
        </header>

        <div className="card-body items-center justify-center text-center">
          <div className="card-actions">
            <div>
              <Form onSubmit={handleLogin} ref={form}>
                <div>
                  <label htmlFor="username" className="text-xl">
                    Username
                  </label>
                  <Input
                    type="text"
                    name="username"
                    value={username}
                    onChange={onChangeUsername}
                    validations={[required]}
                    className="input input-bordered bg-slate-100 shadow-lg mt-2"
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
                    validations={[required]}
                    className="input input-bordered bg-slate-100 shadow-lg mt-2"
                  />
                </div>

                <div className="mt-10">
                  <button
                    // onClick={updateState}
                    className="btn btn-wide btn-info"
                  >
                    <span>Login</span>
                  </button>
                </div>
                <div className="divider">or</div>
                <div className="">
                  <Link to={"/register"} className="btn btn-wide btn-neutral">
                    Sign Up
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
    //     <Form onSubmit={handleLogin} ref={form}>
    //       <div>
    //         <label htmlFor="username">Username</label>
    //         <Input
    //           type="text"
    //           name="username"
    //           value={username}
    //           onChange={onChangeUsername}
    //           validations={[required]}
    //         />
    //       </div>
    //       <div>
    //         <label htmlFor="password">Password</label>
    //         <Input
    //           type="password"
    //           name="password"
    //           value={password}
    //           onChange={onChangePassword}
    //           validations={[required]}
    //         />
    //       </div>

    //       <div>
    //         <button>
    //           <span>Login</span>
    //         </button>
    //       </div>

    //       {message && <div>{message}</div>}
    //       <CheckButton ref={checkBtn} style={{ display: "none" }} />
    //     </Form>
    //   </div>
    // </div>
  );
};

export default SignIn;
