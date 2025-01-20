import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import PostService from "../services/post.service";
import { Link, useNavigate } from "react-router-dom";
import { HiMiniHeart, HiOutlineHeart } from "react-icons/hi2";
import { HiOutlineTrash } from "react-icons/hi";
import { FaRegCommentAlt } from "react-icons/fa";
import moment from "moment";
import Pagination from "@mui/material/Pagination";

const UserFeed = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [allPosts, setAllPosts] = useState();
  const [allUsers, setAllUsers] = useState([]);
  const [allLikes, setAllLikes] = useState();
  const [singlePost, setSinglePost] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [totalLikes, setTotalLikes] = useState();
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [keyIndex, setKeyIndex] = useState();
  const [isLoading, setIsLoading] = useState(null);
  const [postClick, setPostClick] = useState();

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPosts, setTotalPosts] = useState();

  const navigate = useNavigate();
  const userIdParam = window.location.pathname.slice(-1);
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // console.log(currentUser);
  const fetchAllPosts = async () => {
    const params = getRequestParams(page, pageSize);
    try {
      const allPostList = await PostService.getMyHomeFeed(userIdParam, params);
      const { posts, totalPages } = allPostList.data;
      // console.log(allPostList);
      setAllPosts(posts);
      setCount(totalPages);
      setTotalPosts(allPostList.data.totalItems);
      if (
        userIdParam !== user.id ||
        window.location.pathname === "http://localhost:5173"
      ) {
        navigate(`/main/${user.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   const fetchAllLikes = async () => {
  //     try {
  //       const allLikesList = await PostService.getAllLikes();
  //       setAllLikes(allLikesList.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchAllLikes();
  // });

  useEffect(() => {
    fetchAllPosts(userIdParam);
  }, [page]);

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

  const handleCreateLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // setKeyIndex(e.target.getAttribute("key"));
    // console.log(e.target.entry, index);
    const userId = user.id;
    const fart = Number(keyIndex);
    const like = likeCount + 1;
    const username = user.username;
    setIsLoading(true);
    // console.log(fart);

    PostService.createLike(like, username, fart, userId).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        setIsLoading(false);
        // console.log(response.config.data.slice(-2, -1));
        fetchAllPosts(response.config.data.slice(-2, -1));
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

  const handleDeletePost = async (e) => {
    e.preventDefault();
    const postId = Number(postClick);

    if (window.confirm("Are you sure you want to delete this post?")) {
      PostService.deletePost(postId).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
          setIsLoading(false);
          // console.log(response.config.data.slice(-2, -1));
          fetchAllPosts(userIdParam);
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
    }
  };

  // const getKey = (index) => {
  //   let id = index;
  //   setKeyIndex(id);
  // };

  const getIndex = (e, index) => {
    setKeyIndex(e.target.value, index);
  };
  const handleNavigatePost = (url) => {
    navigate(url);
  };

  // console.log(allPosts);
  // console.log(postClick);

  // console.log(compareTwoArrayOfObjects(usernameId, postUserId));

  const getRequestParams = (page, pageSize) => {
    let params = {};

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  };

  // Pagination handling
  const handlePageChange = (e, value) => {
    setPage(value);

    // fetchPostComments();
  };

  const postLikesArr = allPosts?.map((post) => post.likes);
  const flatPostLikesArr = postLikesArr?.flatMap((likes) => likes);
  const postUserLiked = flatPostLikesArr?.find(
    (element) => element.userId === user.id
  );

  // console.log(lerp);

  return (
    <ul>
      {allPosts?.map((post, i) => (
        <>
          <li
            className="bg-transparent text-white  w-full first:mt-3 xl:hover:bg-base-100 xl:py-2 xl:rounded-xl xl:cursor-pointer"
            key={i}
            onClick={() => {
              handleNavigatePost(`/post/${post.id}`);
            }}
          >
            <div className="flex items-center ml-6 mt-3 text-sm">
              <div className="avatar mr-3 ml-1">
                <div className="w-10 rounded-full">
                  <img src={post.user.image_url} />
                </div>
              </div>
              <Link
                to={`/profile/${post.userId}`}
                className={
                  post.owner === user.username ? "link text-[#ACAAFF]" : "link"
                }
                onClick={(e) => e.stopPropagation()}
              >
                {post.owner}
              </Link>
              <p className="mx-2">•</p>
              <p className="">{`${moment(post.createdAt).format("L")}`}</p>
            </div>

            <div className=" ml-6 my-5 p-1">
              <Link to={`/post/${post.id}`} className="text-xl font-bold ">
                {post.Title}
              </Link>
              <p className="break-words pr-5 text-neutral-400 mt-1 line-clamp-3">
                {post.Text}
              </p>
            </div>
            <div className="flex justify-start mr-10 mb-5">
              <p className="btn rounded-3xl mx-5">
                <FaRegCommentAlt className="text-lg" />
                {post.comments.length}
              </p>

              <form key={i} value={i} onSubmit={handleCreateLike}>
                {post.likes.length > 0 && postUserLiked !== undefined ? (
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
                    <p className="">{post.likes.length}</p>
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
                    <HiOutlineHeart className="pointer-events-none text-2xl  " />
                    <p className="">{post.likes.length}</p>
                  </button>
                )}
              </form>
              {post.userId === user.id ? (
                <div className="ml-20">
                  <form key={i} value={post.id} onSubmit={handleDeletePost}>
                    <button
                      className="btn rounded-full"
                      value={post.id}
                      onClick={(e, index) => {
                        e.stopPropagation();

                        setPostClick(e.currentTarget.value, index);
                      }}
                    >
                      <HiOutlineTrash className="text-2xl " />
                    </button>
                  </form>
                </div>
              ) : (
                ""
              )}
            </div>
          </li>
          <hr className="border-b-solid border-b-[.0625rem] border-[#242c2e] xl:my-2" />
        </>
      ))}
      <Pagination
        className={
          allPosts?.length > 0
            ? "flex justify-center mt-2"
            : "flex justify-center hidden"
        }
        count={count}
        page={page}
        siblingCount={1}
        boundaryCount={1}
        variant="outlined"
        shape="rounded"
        color="primary"
        onChange={handlePageChange}
      />
      {allPosts?.length === 0 ? (
        <div className="p-5">
          <p>Click create post to add a new post!</p>
          <p>
            Or
            <Link to={`/find-users/${user?.id}`} className="link link-info">
              <span className="mx-1">follow</span>
            </Link>
            someone to see their posts here!
          </p>
        </div>
      ) : (
        ""
      )}
    </ul>
  );
};

export default UserFeed;
