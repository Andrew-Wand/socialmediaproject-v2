import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import MessageService from "../services/message.service";

const CreateMessage = () => {
  const queryString = window.location.pathname;
  const userId = queryString.slice(-1);
  const [userSelected, setUserSelected] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const currentUser = AuthService.getCurrentUser();
  const id = currentUser.id;
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const userList = await UserService.getAllUsers();
        setUserSelected(userList.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserList();
  }, []);

  const messageTextOnChange = (e) => {
    const message = e.target.value;
    setMessageText(message);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    let owner = currentUser.id;

    MessageService.postSendMessage(
      messageText,
      owner,
      receiverId.toString()
    ).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        navigate(`/messageDashboard/${id}`);
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

  const filteredUserList = userSelected.filter((user) => user.id == userId);
  const receiverId = filteredUserList.map((user) => {
    return user.id.toString();
  });

  return (
    <div className="bg-base-300">
      <div className="min-h-screen xl:mx-[30rem] xl:pt-10 xl:border-x-2 xl:border-x-neutral-500/50 xl:px-5">
        <header>
          {filteredUserList.map((user, i) => (
            <h1
              className="text-center text-3xl mb-5 pt-5 bg-gradient-to-t from-[#B8DBFC] to-[#F8FBFE] bg-clip-text text-transparent "
              key={i}
            >
              Message {user.username}
            </h1>
          ))}
        </header>

        <div className="flex flex-col items-start max-w-screen xl:w-full  xl:ml-0 xl:bg-base-100 xl:rounded-xl xl:shadow-lg xl:p-5">
          <form onSubmit={handleSendMessage} className="w-full">
            <div className="flex justify-between items-center  xl:hidden pt-2 pb-1 px-6 ml-2">
              <Link to={`/messageDashboard/${id}`} className="">
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
                Create
              </button>
            </div>

            <div className="divider m-0 xl:hidden"></div>
            <div className="">
              <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                onChange={messageTextOnChange}
                placeholder="Type message here..."
                className=" w-full p-2  text-white outline-none bg-transparent xl:textarea xl:textarea-bordered xl:text-md xl:focus:outline-white "
              ></textarea>
            </div>
            <div className="divider"></div>
            {/* <div className="flex justify-center">
            <button className=" btn mt-5 btn-secondary">Send</button>
          </div> */}
            <div className="justify-end hidden xl:flex">
              <Link to={`/messageDashboard/${id}`} className="">
                <button className="btn rounded-full btn-neutral mr-5">
                  Cancel
                </button>
              </Link>
              <button className="btn btn-default rounded-full bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF] text-black ">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    // <div className="min-h-screen bg-base-300">
    //   <header>
    //     {filteredUserList.map((user, i) => (
    //       <h1
    //         className="text-center text-3xl mb-5 pt-5 bg-gradient-to-t from-[#B8DBFC] to-[#F8FBFE] bg-clip-text text-transparent "
    //         key={i}
    //       >
    //         Message {user.username}
    //       </h1>
    //     ))}
    //   </header>

    //   <form onSubmit={handleSendMessage}>
    //     <div className="divider m-0 xl:hidden"></div>
    //     <div className="flex justify-center">
    //       <textarea
    //         name=""
    //         id=""
    //         cols="30"
    //         rows="10"
    //         onChange={messageTextOnChange}
    //         placeholder="Type message here..."
    //         className="w-full p-2 text-lg text-white outline-none bg-transparent xl:textarea xl:textarea-bordered xl:text-md xl:focus:outline-white"
    //       ></textarea>
    //     </div>
    //     <div className="divider m-0 xl:hidden"></div>
    //     <div className="flex justify-center mt-5">
    //       <button className=" btn text-black bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF]">
    //         Send
    //       </button>
    //       <Link
    //         to="/"
    //         className="btn text-black  mb-5 ml-[3.4rem] bg-gradient-to-t from-[#A7B5FF] to-[#F3ACFF] "
    //       >
    //         Cancel
    //       </Link>
    //     </div>
    //   </form>
    // </div>
  );
};

export default CreateMessage;
