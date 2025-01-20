import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import Pagination from "@mui/material/Pagination";
// import Link from "@mui/material/Link";

const FindUsers = () => {
  const [myFollowers, setMyFollowers] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [allUserList, setAllUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalUsers, setTotalUsers] = useState();

  const userIdParam = window.location.pathname.slice(-1);

  const user = AuthService.getCurrentUser();

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

  const handlePageChange = (e, value) => {
    setPage(value);

    // fetchPostComments();
  };

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

  useEffect(() => {
    const fetchAllUsers = async () => {
      const params = getRequestParams(page, pageSize);
      try {
        // Search bar data
        const userListForSearch = await UserService.getAllUsers();
        const userListForSearchData = userListForSearch.data;
        const searchDataFilter = userListForSearchData?.filter(
          (j) => j.id !== user.id
        );

        // Main user list on page
        const userList = await UserService.getFindUsersPageData(params);
        const listData = userList.data;

        const { users, totalPages } = listData;

        setTotalUsers(users.totalItems);
        setCount(totalPages);
        setAllUserList(users);
        setFilteredList(searchDataFilter);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllUsers();
  }, [page]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    const filteredItems = allUserList?.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredList(filteredItems);
  };

  const StyledTextField = styled(TextField)({
    "& label, & label.Mui-focused": {
      color: "#fff",
    },
    "& input, & input.Mui-focused": {
      color: "#fff",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#434548",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline,  ": {
      borderColor: "#434548",
    },
    "& .MuiButtonBase-root": {
      color: "#434548",
    },
    "& .MuiAutocomplete-listbox": {
      "& .MuiAutocomplete-option[aria-selected='true']": {
        bgcolor: "purple",
        "&.Mui-focused": {
          bgcolor: "purple",
        },
      },
    },
    "& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused": {
      bgcolor: "red",
    },
  });

  return (
    <div className="bg-base-300 min-h-screen ">
      <div>
        <h2 className="text-3xl text-center pt-5">Find Users</h2>
      </div>

      <div className="flex justify-center mt-5">
        {/* <input
          type="text"
          placeholder="Search Users"
          className="input "
          onChange={handleInputChange}
        /> */}

        <Autocomplete
          disablePortal
          id="find-user-search"
          options={filteredList}
          getOptionLabel={(option) => option.username}
          sx={{
            width: 300,
            backgroundColor: "#000",
          }}
          renderInput={(params) => (
            <StyledTextField
              {...params}
              label="Search Users"
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
          renderOption={(props, option) => (
            <Link
              sx={{
                "& > img": { mr: 2, flexShrink: 0 },
              }}
              {...props}
              to={`/profile/${option.id}`}
            >
              <img
                loading="lazy"
                width="30"
                src={option.image_url}
                srcSet={option.image_url}
                className="mr-5"
              />
              {option.username}
            </Link>
          )}
        />
      </div>

      <div className="flex xl:justify-center xl:flex-row flex-col items-center xl:w-8/12 xl:flex-wrap xl:m-auto xl:pt-5 ">
        {allUserList?.map((user) => (
          <div className="card w-80 mx-2 bg-base-100 shadow-xl my-5 ">
            <div className="card-body">
              <div className="avatar justify-center">
                <div className="w-24 rounded-full">
                  <img src={user.image_url} />
                </div>
              </div>
              <h2 className="card-title justify-center mb-3">
                {user.username}
              </h2>
              <div className="card-actions justify-center">
                <Link
                  to={`/profile/${user.id}`}
                  className="btn btn-primary justify-center "
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        className={
          allUserList?.length > 0
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
    </div>
  );
};

export default FindUsers;
