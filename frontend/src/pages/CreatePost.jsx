import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PostService from "../services/post.service";
import AuthService from "../services/auth.service";

const CreatePost = () => {
  const queryString = window.location.pathname;
  const userId = queryString.slice(-1);
  const [userSelected, setUserSelected] = useState([]);
  const [postText, setPostText] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [likes, setLikes] = useState(0);

  const navigate = useNavigate();

  // const currentUser = AuthService.getCurrentUser();
  // useEffect(() => {
  //   const fetchUserList = async () => {
  //     try {
  //       const userList = await UserService.getUserList();
  //       setUserSelected(userList.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchUserList();
  // }, []);

  const postTitleOnChange = (e) => {
    const title = e.target.value;
    setPostTitle(title);
  };

  const postTextOnChange = (e) => {
    const post = e.target.value;
    setPostText(post);
  };

  const currentUser = AuthService.getCurrentUser();
  const username = currentUser.username;
  const id = currentUser.id;

  const handleCreatePost = (e) => {
    e.preventDefault();
    //   let owner = currentUser.id;

    PostService.postCreatePost(postTitle, postText, id, username).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        if (response) {
          navigate(`/post/${response.data.id}`);
        }
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

  // const filteredUserList = userSelected.filter((user) => user.id == userId);
  // const receiverId = filteredUserList.map((user) => {
  //   return user.id.toString();
  // });

  return (
    <div className="bg-base-300">
      <div className="min-h-screen xl:mx-[30rem] xl:pt-10 xl:border-x-2 xl:border-x-neutral-500/50 xl:px-5">
        <div>
          <h2 className="text-3xl mt-10 mb-5 ml-2 hidden xl:block xl:underline bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
            Create Post
          </h2>
        </div>

        <div className="flex flex-col items-start max-w-screen xl:w-full  xl:ml-0 xl:bg-base-100 xl:rounded-xl xl:shadow-lg xl:p-5">
          <form onSubmit={handleCreatePost} className="w-full">
            <div className="flex justify-between items-center  xl:hidden pt-2 pb-1 px-6 ml-2">
              <Link to={`/main/${id}`} className="">
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
                    strokeWidth="3"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Link>
              <button className=" btn btn-default rounded-full  right-5 xl:hidden bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF] text-black">
                Create Post
              </button>
            </div>
            <div className="divider m-0 xl:p-0 xl:mb-3"></div>

            <div className="">
              <input
                type="text "
                placeholder="Add title here"
                onChange={postTitleOnChange}
                className="w-full p-2 outline-none bg-transparent xl:input xl:input-bordered xl:mb-2 text-white xl:focus:outline-white"
              />
            </div>
            <div className="divider m-0 xl:hidden"></div>
            <div className="">
              <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                onChange={postTextOnChange}
                placeholder="Type message here..."
                className=" w-full p-2  text-white outline-none bg-transparent xl:textarea xl:textarea-bordered xl:text-md xl:focus:outline-white "
              ></textarea>
            </div>
            <div className="divider"></div>
            {/* <div className="flex justify-center">
            <button className=" btn mt-5 btn-secondary">Send</button>
          </div> */}
            <div className="justify-end hidden xl:flex">
              <Link to={`/main/${id}`} className="">
                <button className="btn rounded-full btn-neutral mr-5">
                  Cancel
                </button>
              </Link>
              <button className="btn btn-default rounded-full bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF] text-black ">
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
