import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import PostService from "../services/post.service";
import FollowService from "../services/follow.service";
import { AiOutlineMessage } from "react-icons/ai";
import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";
import { FaRegCommentAlt } from "react-icons/fa";
import moment from "moment";

const Profile = () => {
  const [userProfileData, setUserProfileData] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [keyIndex, setKeyIndex] = useState();
  const [isLoading, setIsLoading] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [newEmail, setNewEmail] = useState("");
  const [newAboutMe, setNewAboutMe] = useState("");
  const [newImgUrl, setNewImgUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const user = AuthService.getCurrentUser();
  const profileIdParams = window.location.pathname.slice(-1);
  const location = useLocation();
  const navigate = useNavigate();

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
  }, [location]);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // console.log(userProfileData);

  const handleFollowSubmit = async (e) => {
    e.preventDefault();

    const user = AuthService.getCurrentUser();
    const userId = user?.id;
    const name = user.username;

    const followerId = Number(profileIdParams);

    FollowService.createFollower(name, userId, followerId).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);

        fetchUserById(response.config.data.slice(-2, -1));
        // setIsLoading(false);
        // fetchAllPosts(response.config.data.slice(-2, -1));
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
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const userFollowersFiltered = userProfileData.userFollowers?.filter(
    (follower) => follower.id === currentUser.id
  );

  const handleCreateLike = async (e) => {
    e.preventDefault();

    const userId = user.id;
    const username = user.username;
    const fart = Number(keyIndex);
    const like = likeCount + 1;
    setIsLoading(true);

    PostService.createLike(like, username, fart, userId).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        setIsLoading(false);

        fetchUserById(profileIdParams);
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
        setIsLoading(false);
      }
    );
  };

  const getIndex = (e, index) => {
    setKeyIndex(e.target.value, index);
  };

  const handleNavigatePost = (url) => navigate(url);

  const onChangeEmailValue = (e) => {
    const email = e.target.value;
    setNewEmail(email);
  };
  const onChangeAboutMeValue = (e) => {
    const about_me = e.target.value;
    setNewAboutMe(about_me);
  };
  const onChangeImgUrlValue = (e) => {
    const img_url = e.target.files[0];
    setNewImgUrl(img_url);
  };

  const handleProfileEditSubmit = (e) => {
    e.preventDefault();
    let existingUser = currentUser;
    const newUpdatedUser = {
      ...existingUser,
      email: newEmail,
      // image_url: newImgUrl,
      about_me: newAboutMe,
    };

    localStorage.setItem("SMuser", JSON.stringify(newUpdatedUser));

    UserService.editProfile(newEmail, newAboutMe).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        fetchUserById(profileIdParams);
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

    setIsEditing(false);

    // window.location.reload();
  };
  const handleProfilePicEditSubmit = (e) => {
    e.preventDefault();
    let existingUser = currentUser;
    const newUpdatedUser = {
      ...existingUser,
      image_url: newImgUrl,
    };

    localStorage.setItem("SMuser", JSON.stringify(newUpdatedUser));

    UserService.editProfilePic(newImgUrl).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        fetchUserById(profileIdParams);
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

    setIsEditing(false);

    // window.location.reload();
  };

  const openEditPage = () => {
    setIsEditing(true);
    setNewEmail(userProfileData.email);
    setNewAboutMe(userProfileData.about_me);
    // setNewImgUrl(userProfileData.image_url);
  };

  console.log(userProfileData);

  return (
    <div className="bg-base-300 xl:pr-20">
      {isEditing ? (
        <div className="bg-base-300 h-screen xl:mx-[35%]  p-7 ">
          <button
            className="btn bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF] text-black"
            onClick={() => setIsEditing(false)}
          >
            Back
          </button>
          <div className="divider"></div>
          <div className="flex-column">
            <h2 className="text-2xl text-center mb-5">Edit Profile</h2>
            <form onSubmit={handleProfileEditSubmit} method="post">
              <div>
                <label
                  className="input input-bordered flex items-center gap-2 shadow-lg"
                  htmlFor=""
                >
                  <span className="btn bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-black ml-[-1rem]">
                    Email:
                  </span>
                  <input
                    type="text"
                    defaultValue={userProfileData.email}
                    onChange={onChangeEmailValue}
                    className="grow"
                  />
                </label>
              </div>
              {/* <div>
                <label
                  className="input input-bordered flex items-center gap-2 shadow-lg"
                  htmlFor=""
                >
                  <span className="btn bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-black ml-[-1rem]">
                    Profile Picture:
                  </span>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/png, image/jpeg"
                    onChange={onChangeImgUrlValue}
                    // defaultValue={userProfileData.image_url}
                  />
                </label>
              </div> */}

              <div className="mt-5">
                <label
                  className="textarea bg-transparent flex items-center shadow-lg"
                  htmlFor=""
                >
                  <span className="btn bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-black ml-[-1rem]">
                    About Me:
                  </span>
                  <textarea
                    className="textarea textarea-bordered"
                    onChange={onChangeAboutMeValue}
                    defaultValue={userProfileData.about_me}
                  ></textarea>
                </label>
              </div>

              <div className="mt-5">
                <button className="btn bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF] text-black mr-5">
                  Submit Info
                </button>
              </div>
            </form>
          </div>

          <div className="divider"></div>
          <div className="mt-10">
            <p className="text-2xl text-center mb-5">Edit Profile Picture</p>
            <form
              onSubmit={handleProfilePicEditSubmit}
              encType="multipart/form-data"
              method="post"
            >
              <div>
                <label
                  className="input input-bordered flex items-center gap-2 shadow-lg"
                  htmlFor=""
                >
                  <span className="btn bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-black ml-[-1rem]">
                    Profile Picture:
                  </span>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/png, image/jpeg"
                    onChange={onChangeImgUrlValue}
                    // defaultValue={userProfileData.image_url}
                  />
                </label>
              </div>

              <div className="mt-5">
                <button className="btn bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF] text-black mr-5">
                  Change Profile Picture
                </button>

                {/* <button
                  className="btn bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF] text-black"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button> */}
              </div>
            </form>
          </div>
        </div>
      ) : (
        // THIS IS SHOWN WHEN NOT EDITING
        <div className="min-h-screen xl:mx-[30rem] xl:border-x-2 xl:border-x-neutral-500/50">
          <div className="flex justify-between items-center mx-6 py-8 xl:justify-start ">
            <div className="avatar xl:mr-6">
              <div className="w-24 rounded-full">
                <img src={userProfileData.image_url} />
              </div>
            </div>
            <div className="xl:mr-10">
              <h2
                className={
                  userProfileData.username?.length > 10
                    ? "text-center text-md truncate"
                    : "text-3xl text-center "
                }
              >
                {userProfileData.username}
              </h2>
              <span className="text-xs font-light">
                {userProfileData.userFollowers?.length} Followers
              </span>
            </div>

            <div className="flex items-center mt-2 ">
              {profileIdParams == user.id && (
                <button
                  className="btn bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF] text-black shadow-lg"
                  onClick={openEditPage}
                >
                  Edit Profile
                </button>
              )}
              {/* <div className="xl:block hidden rounded-lg w-[18rem] h-[12rem] bg-black ml-20">
                <div className="flex flex-col">
                  <div className="border-b-[1px] border-neutral-500/50 py-2 mx-5">
                    <p className="text-xl ml-5 ">About Me</p>
                  </div>
                  <div className="pl-5 mt-5">
                    <p className=""> hello</p>
                  </div>
                </div>
              </div> */}
              <form onSubmit={handleFollowSubmit}>
                {userFollowersFiltered?.map((follower, i) => (
                  <div key={i} className="flex">
                    {follower.id === currentUser.id ? (
                      <>
                        <button className="btn bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF]  text-black">
                          Unfollow
                        </button>
                        <Link
                          to={`/messageDashboard/${currentUser.id}`}
                          className="btn text-2xl rounded-full ml-5  bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-black"
                        >
                          <AiOutlineMessage />
                        </Link>
                      </>
                    ) : (
                      ""
                      // <button>Follow</button>
                    )}
                  </div>
                ))}

                {/* {currentUser?.id === profileIdParams && ""} */}

                {userFollowersFiltered?.length === 0 ? (
                  <button
                    className={
                      currentUser?.id === Number(profileIdParams)
                        ? "hidden"
                        : "btn bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-black"
                    }
                  >
                    Follow
                  </button>
                ) : (
                  ""
                )}
              </form>
            </div>
          </div>

          <div className="">
            <details className="collapse collapse-arrow  bg-base-100 rounded-none ">
              <summary className="collapse-title text-xl font-medium">
                About Me
              </summary>
              <div className="collapse-content">
                <p>{userProfileData.about_me}</p>
              </div>
            </details>
          </div>

          <div className="divider"></div>
          <div className="ml-6 ">
            <p className="text-2xl ">Posts</p>
            <span className="text-xs font-light">
              {userProfileData.posts?.length} Posts
            </span>
          </div>

          <div className="divider"></div>

          {/* POSTS ON PROFILE */}
          <div>
            <ul>
              {userProfileData.posts?.map((post, i) => (
                <>
                  <li
                    className="bg-transparent text-white  w-full first:mt-3 xl:hover:bg-base-100 xl:py-2 xl:rounded-xl xl:cursor-pointer"
                    key={i}
                    onClick={() => handleNavigatePost(`/post/${post.id}`)}
                  >
                    <div className="flex ml-[1.7rem] mt-3 text-sm">
                      <Link
                        to={`/profile/${post.userId}`}
                        className={
                          post.owner === user.username
                            ? "link text-[#ACAAFF]"
                            : "link"
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        {post.owner}
                      </Link>
                      <p className="mx-2">•</p>
                      <p className="">{`${moment(post.createdAt).format(
                        "L"
                      )}`}</p>
                    </div>

                    <div className="ml-6 my-5 p-1">
                      <Link
                        to={`/post/${post.id}`}
                        // onClick={() => fetchPostById(post.id)}
                        className="text-xl font-bold"
                      >
                        {post.Title}
                      </Link>
                      <p className="break-words pr-5 text-neutral-400 mt-1 line-clamp-3">
                        {post.Text}
                      </p>
                    </div>
                    <div className="flex justify-start mr-10 mb-5">
                      <p className="btn rounded-3xl mx-5">
                        <FaRegCommentAlt className="text-lg" />
                        {post.comments?.length}
                      </p>

                      <form key={i} value={i} onSubmit={handleCreateLike}>
                        {post.likeCounts > 0 ? (
                          <button
                            key={i}
                            value={post.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              getIndex(e, i);
                            }}
                            className="btn rounded-full"
                          >
                            <HiMiniHeart className="pointer-events-none text-2xl text-[#de2a43]" />
                            <p className="">{post.likeCounts}</p>
                          </button>
                        ) : (
                          <button
                            key={i}
                            value={post.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              getIndex(e, i);
                            }}
                            className="btn rounded-full"
                          >
                            <HiOutlineHeart className="pointer-events-none text-2xl " />
                            <p className="">{post.likeCounts}</p>
                          </button>
                        )}
                      </form>
                    </div>
                  </li>
                  <hr className="border-b-solid border-b-[.0625rem] border-[#242c2e] xl:my-2" />
                </>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
