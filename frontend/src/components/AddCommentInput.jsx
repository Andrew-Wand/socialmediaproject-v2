import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostService from "../services/post.service";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router";

const AddCommentInput = () => {
  const [commentInput, setCommentInput] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const queryString = window.location.pathname;
  const postId = queryString.slice(-1);

  const currentUser = AuthService.getCurrentUser();
  const owner = currentUser.username;
  const id = currentUser.id;
  const handleAddComment = (e) => {
    e.preventDefault();
    PostService.postCreateComment(commentInput, postId, id, owner).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        setLoading(true);
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

    navigate(`/post/${postId}`);
  };

  const commentInputOnChange = (e) => {
    setCommentInput(e.target.value);
  };

  return (
    <>
      {loading ? (
        "loading"
      ) : (
        <div className="bg-base-300">
          <div className="min-h-screen xl:mx-[30rem] xl:pt-10 xl:border-x-2 xl:border-x-neutral-500/50 xl:px-5">
            <div>
              <h2 className="text-3xl mt-10 mb-5 ml-2 hidden xl:block xl:underline bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
                Create Comment
              </h2>
            </div>

            <div className="flex flex-col items-start max-w-screen xl:w-full  xl:ml-0 xl:bg-base-100 xl:rounded-xl xl:shadow-lg xl:p-5">
              <form onSubmit={handleAddComment} className="w-full">
                <div className="flex justify-between items-center  xl:hidden pt-2 pb-1 px-6 ml-2">
                  <Link to={`/post/${postId}`} className="">
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
                    Submit
                  </button>
                </div>

                <div className="divider m-0 xl:hidden"></div>
                <div className="">
                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                    value={commentInput}
                    onChange={commentInputOnChange}
                    placeholder="Type comment here..."
                    className=" w-full p-2  text-white outline-none bg-transparent xl:textarea xl:textarea-bordered xl:text-md xl:focus:outline-white "
                  ></textarea>
                </div>
                <div className="divider"></div>

                <div className="justify-end hidden xl:flex">
                  <Link to={`/post/${postId}`} className="">
                    <button className="btn rounded-full btn-neutral mr-5">
                      Cancel
                    </button>
                  </Link>
                  <button className="btn btn-default rounded-full bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF] text-black ">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCommentInput;
