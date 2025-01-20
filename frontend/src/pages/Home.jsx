import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import PostService from "../services/post.service";
import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";
import UserFeed from "../components/UserFeed";
import AllPosts from "../components/AllPosts";
import Pic from "../assets/undraw_blog_post_re_fy5x.svg";
import SignInModal from "../components/SignInModal";
import RegisterModal from "../components/RegisterModal";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

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

const Home = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userProfileData, setUserProfileData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [keyIndex, setKeyIndex] = useState();
  const [isLoading, setIsLoading] = useState(null);
  const [homeFeed, setHomeFeed] = useState("myFeed");
  const [isOpen, setIsOpen] = useState(false);
  const [mouseHoverActive, setMouseHoverActive] = useState(false);
  const checkBtn = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useRef();
  const guestUsername = import.meta.env.VITE_GUEST_USERNAME;
  const guestPassword = import.meta.env.VITE_GUEST_PASSWORD;
  const navigate = useNavigate();

  const profileIdParams = window.location.pathname.slice(-1);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    setUsername(guestUsername);
    setPassword(guestPassword);
  }, []);

  const user = AuthService.getCurrentUser();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const allUserList = await UserService.getAllUsers();
        setAllUsers(allUserList.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllUsers();
  }, []);

  const handleGuestLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(username, password).then(
        (response) => {
          setMessage(response.data);

          setSuccessful(true);
          if (response) {
            setLoading(true);

            navigate(`/main/${response}`);
            window.location.reload();
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
  };

  // Follow list stuff
  const [myFollowers, setMyFollowers] = useState([]);
  const fetchMyFollowers = async (id) => {
    try {
      const myFollowList = await UserService.findMyFollowers(id);
      setMyFollowers(myFollowList.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyFollowers(user.id);
    }
  }, []);

  const newUserArr = allUsers?.filter((user) => user.id === currentUser?.id);

  const handleFollowListMenu = () => {
    setIsOpen(!isOpen);
  };

  const fetchUserById = async (id) => {
    try {
      const currentUserProfile = await UserService.getUserById(id);
      setUserProfileData(currentUserProfile.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserById(profileIdParams);
  }, []);

  console.log(userProfileData);

  return (
    <div className="  bg-base-300 min-h-screen xl:min-h-screen  xl:w-full     ">
      {user ? (
        <>
          <div
            onMouseEnter={() => setMouseHoverActive(true)}
            onMouseLeave={() => setMouseHoverActive(false)}
          >
            <button
              onClick={handleFollowListMenu}
              className={
                isOpen
                  ? "hidden xl:opacity-0 text-3xl absolute top-[6.5rem]  transition ease duration-[200ms]  translate-x-[28.5rem] border-l-8 border-[#ACAAFF] h-[364px]  "
                  : "hidden xl:opacity-1 xl:block text-3xl fixed top-[6.5rem]  transition ease duration-[200ms]  translate-x-[0rem] border-l-[8px] border-[#ACAAFF] h-[364px] hoverEffect"
              }
            >
              <IoIosArrowForward className={isOpen ? "hidden" : "block"} />
            </button>
          </div>

          <p
            className={
              mouseHoverActive && !isOpen
                ? "fixed text-[14px] top-[17.1rem] left-6 text-neutral-400 cursor-default rotate-[90deg] opacity-1 transition ease duration-300 delay-100   "
                : "opacity-0 fixed text-[14px] top-[17.1rem] left-6 rotate-[90deg] cursor-default transition ease duration-200 translate-x-[-1rem] "
            }
          >
            Follow List
          </p>
        </>
      ) : (
        ""
      )}

      <div
        className={
          !isOpen
            ? "hidden xl:block fixed translate-x-[-27rem] bg-black/25 w-[400px] h-[364px] mt-8  overflow-y-scroll transition ease  opacity-0 duration-500 "
            : "hidden xl:block fixed translate-x-14 bg-black/25 w-[400px] h-[364px] mt-8  overflow-y-scroll  transition ease  opacity-1 duration-500 rounded-xl  "
        }
      >
        <div className="flex justify-between border-b-[1px] border-neutral-500/50">
          <p className="text-xl font-bold p-5  bg-gradient-to-t from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
            Follow List
          </p>
          <button
            className="btn btn-circle mr-5 mt-2 btn-ghost"
            onClick={() => setIsOpen(false)}
          >
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
          {/* <button className="mr-5">Close</button> */}
        </div>
        <div className="mt-2">
          {myFollowers?.map((user, i) => (
            <div
              key={i}
              className="flex justify-between mb-2 px-3 py-2 items-center hover:bg-base-300 rounded-md  "
            >
              <div className="flex items-center">
                <img
                  className="avatar rounded-full w-10"
                  src={user.image_url}
                  alt="Profile Picture"
                />
                <Link
                  className="ml-2 text-white truncate"
                  to={`/profile/${user.id}`}
                >
                  {user.username}
                </Link>
              </div>

              <div>
                <Link
                  to={`/profile/${user.id}`}
                  className=" bg-gradient-to-l from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent hover:border-b-[1px]"
                >
                  Profile
                </Link>
                <Link
                  to={`/messageDashboard/${currentUser?.id}`}
                  className="mr-1 ml-2 bg-gradient-to-t from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent hover:border-b-[1px]"
                >
                  Message
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {user ? (
        // HOME PAGE if user is logged in

        <div className="min-h-screen pb-5 xl:mx-[32rem] xl:border-x-2 xl:border-x-neutral-500/50    ">
          <div className="px-5 pt-8">
            <div className="avatar mr-2">
              <div className="w-20 rounded-full">
                <img src={userProfileData?.image_url} />
              </div>
            </div>

            <h1 className="ml-2 mb-5 text-3xl text-white xl:pt-1 bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
              {user?.username}'s Feed
            </h1>

            <div className="flex justify-between">
              <div className="">
                <div
                  role="tablist"
                  className="tabs tabs-boxed [--rounded-btn:3px] "
                >
                  <a
                    role="tab"
                    className={
                      homeFeed === "myFeed"
                        ? "tab bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-[1rem] text-black "
                        : "tab text-[1rem]"
                    }
                    onClick={() => setHomeFeed("myFeed")}
                  >
                    My Feed
                  </a>
                  <a
                    role="tab"
                    className={
                      homeFeed === "allPosts"
                        ? "tab bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-[1rem] text-black "
                        : "tab text-[1rem] "
                    }
                    onClick={() => setHomeFeed("allPosts")}
                  >
                    All Posts
                  </a>
                </div>
              </div>

              <div className="mt-2">
                <Link
                  to="/create-post"
                  className="px-3 py-2 rounded-2xl shadow-xl text-black bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF]  "
                >
                  <span className="text-lg">+ </span>Create Post
                </Link>
              </div>
            </div>
          </div>
          <div className="relative z-[99]">
            <div className="divider h-0 mb-0 "></div>
            {homeFeed === "myFeed" ? <UserFeed /> : <AllPosts />}
          </div>
        </div>
      ) : (
        // HOME PAGE if user is logged out

        <div className="hero bg-base-300 text-white requires-no-scroll ">
          <div className="hero-content flex-col lg:flex-row text-left xl:mt-48">
            <div className="text-center lg:text-right lg:mr-[10rem] lg:ml-[10rem]">
              <div className="xl:w-[22rem] xl:top-[30%] w-[15rem] mr-[5rem] xl:block">
                <img
                  className="xl:h-[22rem] h-[15rem] ml-10 bg-gradient-to-b from-[#C0E8FF] to-[#ACAAFF]  rounded-[10%] shadow-xl p-2 "
                  src={Pic}
                  alt=""
                />
              </div>
            </div>
            <div className="card shrink-0 w-full max-w-md xl:min-w-fit bg-base-300">
              <div className="card-body p-0">
                <div className="bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
                  <header className="mt-5 mb-10  ">
                    <h1 className="text-4xl xl:text-[4.3rem] ">
                      Welcome to MyBlog!
                    </h1>
                  </header>
                </div>
                <div className="xl:flex">
                  <ul>
                    <p className="text-2xl mb-5">Blog today.</p>
                    <li className="">
                      <SignInModal />
                    </li>
                    <div className="divider">or</div>
                    <li className="">
                      <RegisterModal />
                    </li>
                    <li className="mt-4">
                      <Form onSubmit={handleGuestLogin} ref={form} className="">
                        <div className="hidden">
                          <div>
                            <Input
                              type="text"
                              name="username"
                              value={username}
                              // validations={[required]}
                              autoComplete="off"
                              className="input input-bordered shadow-lg mt-2 w-full"
                            />
                          </div>
                          <div className="mt-3">
                            <Input
                              type="password"
                              name="password"
                              value={password}
                              // validations={[required]}
                              className="input input-bordered shadow-lg mt-2 w-full "
                            />
                          </div>
                        </div>

                        <div className="xl:h-[2.5rem] xl:w-[18rem] w-[20rem] h-[3rem] rounded-full bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] p-[.2rem] ">
                          <div className="flex h-full w-full items-center justify-center bg-base-300 back rounded-full hover:bg-transparent transition duration-500  ">
                            <button className="text-[#C0E8FF]/90 text-sm  hover:text-black w-full h-full font-bold">
                              Example User Sign In
                            </button>
                          </div>
                        </div>

                        <CheckButton
                          ref={checkBtn}
                          style={{ display: "none" }}
                        />
                      </Form>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
