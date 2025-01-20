import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import MessageService from "../services/message.service";
import moment from "moment";

const Chat = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [allMessageList, setAllMessageList] = useState([]);
  const [allUserList, setAllUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [btnvisible, setBtnVisible] = useState(false);
  const [drawerVisible, setDrawerVisibile] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [userInfo, setUserInfo] = useState([]);

  const [myFollowers, setMyFollowers] = useState([]);
  const userIdParam = window.location.pathname.slice(-1);
  const user = AuthService.getCurrentUser();
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const allUserList = await UserService.getAllUsers();
        setAllUserList(allUserList.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllUsers();
  }, []);

  const fetchUserById = async (id) => {
    try {
      const currentUserInfo = await UserService.getUserById(id);
      setUserInfo(currentUserInfo.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserById(userIdParam);
  }, []);

  const fetchMyFollowers = async (id) => {
    try {
      const myFollowList = await UserService.findMyFollowers(id);
      setMyFollowers(myFollowList.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyFollowers(Number(userIdParam));
  }, []);

  // Fetch all messages from DB
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messageList = await MessageService.getMessageList();
        setAllMessageList(messageList.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, []);

  const filters = {
    owner: [selectedUser, user.id.toString()],
    receiver: [selectedUser, user.id.toString()],
  };

  const filteredMessageList = allMessageList?.filter((obj) =>
    Object.entries(filters).every(
      ([key, filterArr]) =>
        filterArr.length === 0 || filterArr.includes(obj[key])
    )
  );

  const userListFiltered = allUserList.filter((j) => j.id !== user.id);
  const followers = userListFiltered.flatMap((follower) => {
    return follower.userFollowers;
  });

  const userFilteredOnSelect = allUserList.filter(
    (user) => user.id.toString() === selectedUser
  );

  const onChangeSelect = (e) => {
    const selection = e.target.value;
    setSelectedUser(selection);
    setMessageId(selection);
    setDrawerVisibile(false);
    setBtnVisible(true);
  };
  const messageURL = "/message/" + selectedUser;

  //
  const myFollowersIdArr = userInfo.userFollowers?.map((user) => {
    return user;
  });

  const myFollowsIdArr = myFollowers.map((user) => {
    return user;
  });

  const newArr = myFollowersIdArr?.concat(myFollowsIdArr);
  const userInfoArr = newArr?.map((j) => {
    let id = j.id;
    let username = j.username;
    let info = [
      {
        id: id,
        username: username,
      },
    ];
    return info;
  });

  const flatUserInfoArr = userInfoArr?.flatMap((j) => {
    return j;
  });
  const jsonObject = flatUserInfoArr?.map(JSON.stringify);
  const uniqueSet = new Set(jsonObject);
  const uniqueChatArr = Array.from(uniqueSet).map(JSON.parse);
  // Get clicked follower id
  const filteredFollowerList = uniqueChatArr?.filter(
    (j) => j.id === Number(selectedUser)
  );

  console.log(userFilteredOnSelect);

  return (
    <div className="min-h-screen bg-base-300 ">
      {user ? (
        <>
          <div className="flex ">
            <div className="xl:h-[75vh] xl:w-fit  ">
              <div className="flex justify-center text-xl lg:border-b-2 lg:border-b-neutral-500/50 lg:border-r-2 lg:border-r-neutral-500/50 ">
                <p className="my-[1.53rem] ">Followers List</p>
              </div>

              <div className="h-full">
                <select
                  className="hidden xl:block xl:w-96 xl:min-h-full  bg-base-300 text-base-content lg:border-b-2 lg:border-b-neutral-500/50 lg:border-r-2 lg:border-r-neutral-500/50  "
                  size={5}
                  name=""
                  id=""
                  onChange={onChangeSelect}
                >
                  {uniqueChatArr?.map((user, i) => (
                    <option
                      key={i}
                      value={user.id}
                      className="text-2xl border-solid border-b-[1px] border-slate-500 bg-base-300  bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent h-[5rem]"
                    >
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content border-2 rounded-full w-16 mr-10 mt-2">
                          <span className="text-xl">
                            {user.username.slice(0, 1)}
                          </span>
                        </div>
                      </div>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="xl:w-screen hidden xl:block ">
              <div className="flex justify-center shadow-lg lg:border-b-2 lg:border-b-neutral-500/50 ">
                <div className="flex justify-between items-center text-xl  p-[.89rem] w-6/12 ml-10 rounded-xl">
                  <div className="">
                    {selectedUser ? (
                      <div className="">
                        {userFilteredOnSelect.map((user) => (
                          <Link
                            to={`/profile/${user.id}`}
                            className="text-2xl  bg-base-300  bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent item flex"
                          >
                            <div className="avatar mr-3 items-center">
                              <div className="w-10 rounded-full">
                                <img src={user.image_url} />
                              </div>
                            </div>
                            <span>{user.username}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      ""
                      // <div className="invisible">
                      //   <div className="avatar placeholder">
                      //     <div className="bg-neutral text-neutral-content border-2 rounded-full w-16 mr-10 ">
                      //       <span className="text-xl">
                      //         {user.username.slice(0, 1)}
                      //       </span>
                      //     </div>
                      //   </div>

                      //   <span className="text-2xl  bg-base-300  bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent ">
                      //     {user.username}
                      //   </span>
                      // </div>
                    )}
                  </div>

                  <div>
                    {btnvisible ? (
                      <div className=" ">
                        <Link
                          className="btn btn-wide bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-black"
                          to={messageURL}
                        >
                          Reply
                        </Link>
                      </div>
                    ) : (
                      <div className=" ">
                        <button className="btn btn-secondary btn-wide" disabled>
                          Reply
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className=" artboard artboard-horizontal bg-base-200 shadow-lg overflow-auto flex flex-col-reverse lg:h-full lg:border-b-2 lg:border-b-neutral-500/50 lg:border-r-2 lg:border-r-neutral-500/50">
                {/* Messages in chat room box */}

                <ul className="lg:mx-20 ">
                  {filteredMessageList.map((message, i) => (
                    <div key={i}>
                      {message.receiver !== selectedUser ? (
                        <div className="chat chat-start">
                          {filteredFollowerList.map((user, i) => (
                            <>
                              <div key={i} className="chat-header ml-1">
                                {user.username}
                              </div>
                              <div className="chat-footer">
                                <span className=" text-[10px]">
                                  {`${moment(message.createdAt).format("l")} ` +
                                    `${moment(message.createdAt).format("LT")}`}
                                </span>
                              </div>
                            </>
                          ))}

                          <div className="chat-bubble before:hidden static text-black bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF]">
                            {message.text}
                          </div>
                        </div>
                      ) : (
                        <div className="chat chat-end">
                          <div className="chat-header mr-1">
                            {currentUser.username}
                          </div>
                          <div className="chat-bubble  text-black before:hidden   bg-gradient-to-t from-[#C0E8FF] to-[#ACAAFF] static">
                            {message.text}
                          </div>
                          <div className="chat-footer">
                            <span className=" text-[10px]">
                              {`${moment(message.createdAt).format("l")} ` +
                                `${moment(message.createdAt).format("LT")}`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {!selectedUser && <p>Please select a user to message</p>}
                </ul>
              </div>
            </div>
          </div>

          <div className="xl:hidden">
            {/* MOBILE friends list */}
            <div>
              <div className="drawer xl:hidden">
                {userFilteredOnSelect.map((user, i) => (
                  <h1
                    key={i}
                    className="text-2xl mt-7 ml-5 bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent "
                  >
                    <Link
                      to={`/profile/${user.id}`}
                      className="text-2xl  bg-base-300  bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent item flex"
                    >
                      <div className="avatar mr-3 items-center">
                        <div className="w-10 rounded-full">
                          <img src={user.image_url} />
                        </div>
                      </div>
                      <span>{user.username}</span>
                    </Link>
                  </h1>
                ))}

                {drawerVisible ? (
                  <input
                    id="my-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                    checked
                  />
                ) : (
                  <input
                    id="my-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                  />
                )}

                <div className="drawer-content flex justify-end mr-2">
                  {/* Page content here */}

                  <label
                    htmlFor="my-drawer"
                    className="btn bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] drawer-button mb-2 mt-5 text-black"
                    onClick={() => {
                      drawerVisible
                        ? setDrawerVisibile(false)
                        : setDrawerVisibile(true);
                    }}
                  >
                    Followers List
                  </label>
                </div>
                <div className="drawer-side">
                  <label
                    htmlFor="my-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                  ></label>

                  <div className="bg-base-300 h-[4rem] w-full text-center flex items-center">
                    <div className="">
                      <button
                        onClick={() => setDrawerVisibile(false)}
                        className="btn btn-sm text-black mt-1  bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF]"
                      >
                        Back
                      </button>
                    </div>

                    <div>
                      <h3 className="text-2xl mt-1 ml-20 text-[#C0E8FF]">
                        Followers List
                      </h3>
                    </div>
                  </div>
                  <select
                    className="xl:block w-full min-h-full bg-base-300 text-base-content p-0 mt-[4rem] "
                    size={10}
                    name=""
                    id=""
                    onChange={onChangeSelect}
                  >
                    {uniqueChatArr?.map((user, i) => (
                      <>
                        <option
                          className="text-2xl border-solid border-y-[1px] border-slate-500 bg-base-300 text-[#C0E8FF] h-[5rem]"
                          value={user.id}
                          key={i}
                        >
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-16 mr-10 mt-2">
                              <span className="text-xl">
                                {user.username.slice(0, 1)}
                              </span>
                            </div>
                          </div>
                          {user.username}
                        </option>
                      </>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* MOBILE Chat area */}
            <div className="xl:pt-12 lg:hidden">
              <div className="flex justify-center xl:mx-[9%] xl:rounded-xl xl:shadow-lg xl:pb-5">
                <select
                  className="hidden xl:block xl:w-60 min-h-full bg-base-300 text-base-content p-0 xl:mt-5"
                  size={5}
                  name=""
                  id=""
                  onChange={onChangeSelect}
                >
                  {uniqueChatArr?.map((user, i) => (
                    <option
                      value={user.id}
                      key={i}
                      className="text-2xl border-solid border-b-[1px] border-slate-500 bg-base-300  bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent h-[5rem]"
                      selected
                    >
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content border-2 rounded-full w-16 mr-10 mt-2">
                          <span className="text-xl">
                            {user.username.slice(0, 1)}
                          </span>
                        </div>
                      </div>
                      {user.username}
                    </option>
                  ))}
                </select>

                <div className="w-full h-[26rem] xl:w-[80rem] xl:h-[45rem] xl:mt-5 artboard artboard-horizontal bg-base-200 shadow-lg overflow-auto flex flex-col-reverse">
                  {/* Messages in chat room box */}

                  <ul>
                    {filteredMessageList.map((message, i) => (
                      <div key={i}>
                        {message.receiver !== selectedUser ? (
                          <div className="chat chat-start">
                            {filteredFollowerList.map((user, i) => (
                              <>
                                <div key={i} className="chat-header ml-1">
                                  {user.username}
                                </div>
                                <div className="chat-footer">
                                  <span className=" text-[10px]">
                                    {`${moment(message.createdAt).format(
                                      "l"
                                    )} ` +
                                      `${moment(message.createdAt).format(
                                        "LT"
                                      )}`}
                                  </span>
                                </div>
                              </>
                            ))}

                            <div className="chat-bubble before:hidden static text-black bg-gradient-to-r from-[#A7B5FF] to-[#F3ACFF]">
                              {message.text}
                            </div>
                          </div>
                        ) : (
                          <div className="chat chat-end">
                            <div className="chat-header mr-1">
                              {currentUser.username}
                            </div>
                            <div className="chat-bubble  text-black before:hidden   bg-gradient-to-t from-[#C0E8FF] to-[#ACAAFF] static">
                              {message.text}
                            </div>
                            <div className="chat-footer">
                              <span className=" text-[10px]">
                                {`${moment(message.createdAt).format("l")} ` +
                                  `${moment(message.createdAt).format("LT")}`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {!selectedUser && <p>Please select a user to message</p>}
                  </ul>
                </div>
              </div>
              {btnvisible ? (
                <div className="xl:flex xl:mr-96 xl:mt-10 xl:justify-end  mt-10 flex justify-center ">
                  <Link
                    className="btn bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] text-black"
                    to={messageURL}
                  >
                    Reply
                  </Link>
                </div>
              ) : (
                <div className="xl:flex xl:mr-10 xl:mt-10 xl:justify-end mt-10 ml-5 ">
                  <button className="btn btn-secondary" disabled>
                    Reply
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Chat;
