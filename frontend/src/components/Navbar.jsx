import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import { TbHome } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { TbMessage } from "react-icons/tb";
import { HiUserGroup } from "react-icons/hi2";
import { BsPersonAdd } from "react-icons/bs";

const Navbar = ({ loggedIn }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const user = AuthService.getCurrentUser();
  let navigate = useNavigate();
  const userIdParam = window.location.pathname.slice(-1);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  const closeMobileSubMenu = () => {
    setIsSubMenuOpen(false);
  };

  const openMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMobileMenu = () => {
    if (isSubMenuOpen) {
      setIsSubMenuOpen(true);
    } else {
      setIsSubMenuOpen(false);
    }
    setIsOpen(false);
  };
  const openMobileSubMenu = (e) => {
    e.preventDefault();
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <nav className="bg-base-300 border-b-2 border-b-neutral-500/50">
      <div className="navbar shadow-lg xl:bg-transparent xl:shadow-none ">
        {/* Mobile */}
        <div className="navbar-start xl:navbar-start xl:ml-[27rem]">
          {user ? (
            <Link
              to={`/main/${user.id}`}
              className="btn btn-ghost text-xl xl:text-3xl  "
            >
              <span className=" ">
                <svg
                  width="35"
                  height="50"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {" "}
                  <g clipPath="url(#clip0_235_970)">
                    {" "}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 100L7.62939e-06 0H100H200V100C144.78 100 100.013 55.2417 100 0.0239258C99.987 55.2417 55.2204 100 0 100ZM100 200C100 144.771 144.772 100 200 100V200H100ZM100 200C100 144.771 55.2285 100 0 100V200H100Z"
                      fill="url(#paint0_linear_235_970)"
                    />{" "}
                  </g>{" "}
                  <defs>
                    {" "}
                    <linearGradient
                      id="paint0_linear_235_970"
                      x1="20.5"
                      y1="16"
                      x2="100"
                      y2="200"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#ACAAFF" />{" "}
                      <stop offset="1" stopColor="#C0E8FF" />{" "}
                    </linearGradient>{" "}
                    <clipPath id="clip0_235_970">
                      {" "}
                      <rect width="200" height="200" fill="white" />{" "}
                    </clipPath>{" "}
                  </defs>{" "}
                </svg>
              </span>
              <div>
                <span className=" bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
                  MyBlog
                </span>
              </div>
            </Link>
          ) : (
            <Link to={`/`} className="btn btn-ghost text-xl xl:text-3xl  ">
              <span className=" ">
                <svg
                  width="35"
                  height="50"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {" "}
                  <g clipPath="url(#clip0_235_970)">
                    {" "}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 100L7.62939e-06 0H100H200V100C144.78 100 100.013 55.2417 100 0.0239258C99.987 55.2417 55.2204 100 0 100ZM100 200C100 144.771 144.772 100 200 100V200H100ZM100 200C100 144.771 55.2285 100 0 100V200H100Z"
                      fill="url(#paint0_linear_235_970)"
                    />{" "}
                  </g>{" "}
                  <defs>
                    {" "}
                    <linearGradient
                      id="paint0_linear_235_970"
                      x1="20.5"
                      y1="16"
                      x2="100"
                      y2="200"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#ACAAFF" />{" "}
                      <stop offset="1" stopColor="#C0E8FF" />{" "}
                    </linearGradient>{" "}
                    <clipPath id="clip0_235_970">
                      {" "}
                      <rect width="200" height="200" fill="white" />{" "}
                    </clipPath>{" "}
                  </defs>{" "}
                </svg>
              </span>
              <div>
                <span className=" bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
                  MyBlog
                </span>
              </div>
            </Link>
          )}
        </div>
        <div className="navbar-end">
          <label
            className={
              user
                ? "btn btn-ghost text-white swap swap-rotate lg:hidden "
                : "btn btn-ghost text-white swap swap-rotate lg:hidden hidden "
            }
          >
            {/* this hidden checkbox controls the state */}
            {!isOpen ? (
              <input type="checkbox" onClick={openMobileMenu} id="hamburger" />
            ) : (
              <input
                type="checkbox"
                onClick={openMobileMenu}
                checked
                id="hamburger"
              />
            )}

            {/* hamburger icon */}
            <svg
              className="swap-off "
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
              fill="none"
            >
              <defs>
                <linearGradient
                  id="paint0_linear_235_980"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ACAAFF" />{" "}
                  <stop offset="100%" stopColor="#C0E8FF" />{" "}
                </linearGradient>
              </defs>{" "}
              <path
                d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"
                fill="url(#paint0_linear_235_980)"
              />
            </svg>

            {/* close icon */}
            <svg
              className="swap-on "
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
              fill="none"
            >
              <defs>
                <linearGradient
                  id="paint0_linear_235_990"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ACAAFF" />{" "}
                  <stop offset="100%" stopColor="#C0E8FF" />{" "}
                </linearGradient>
              </defs>
              <polygon
                fillRule="evenodd"
                clipRule="evenodd"
                fill="url(#paint0_linear_235_990)"
                points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
              />
            </svg>
          </label>
        </div>
        {/* DESKTOP */}
        <div className="xl:navbar-center xl:item hidden xl:flex xl:mr-[27rem] ">
          <ul className="menu menu-horizontal px-1 xl:text-[1.1rem] dropdown-content">
            {user ? (
              // User is logged in
              <>
                <li className="bg-gradient-to-l from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
                  <Link
                    to={`/main/${user?.id}`}
                    onClick={closeMobileMenu}
                    className="nav-item "
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
                  <Link to={`/profile/${user.id}`} className="nav-link ">
                    Profile
                  </Link>
                </li>

                <li>
                  <details
                    onClick={openMobileSubMenu}
                    open={isSubMenuOpen}
                    className="bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent"
                  >
                    <summary className="after:text-[#C0E8FF]">Social</summary>
                    <ul className="w-[9rem]">
                      <li className="nav-item bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent ">
                        <Link
                          to={`/messageDashboard/${user.id}`}
                          className="nav-link "
                          onClick={closeMobileMenu}
                        >
                          Messages
                        </Link>
                      </li>
                      <li className="nav-item bg-gradient-to-l from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
                        <Link
                          onClick={closeMobileMenu}
                          to={`/find-users/${user?.id}`}
                          className=" nav-link "
                        >
                          Find Users
                        </Link>
                      </li>
                    </ul>
                  </details>
                </li>

                <li className="nav-item bg-gradient-to-r from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent">
                  <a href="/" className="nav-link" onClick={logOut}>
                    Log Out
                  </a>
                </li>
              </>
            ) : (
              // No user logged in
              <>
                <li className="nav-item  xl:hidden">
                  <Link to={"/sign-in"} className="nav-link">
                    Login
                  </Link>
                </li>

                <li className="nav-item  xl:hidden">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      {/* MOBILE */}
      <div
        className={
          isOpen && !isSubMenuOpen
            ? "text-center h-[12rem] overflow-hidden transition-[height] ease duration-[350ms] lg:hidden  bg-base-200 w-full z-0 text-[#b8c5c9]"
            : isSubMenuOpen && isOpen
            ? "text-center h-[17.5rem] overflow-hidden transition-[height] ease duration-[350ms] lg:hidden  bg-base-200 w-full z-0 text-[#b8c5c9]"
            : "text-center h-0 overflow-hidden transition-[height] ease duration-[350ms] lg:hidden  bg-base-200 w-full z-0 shadow-md"
        }
      >
        <ul className="menu text-lg ">
          <li className="">
            {user ? (
              <Link
                to={`/main/${user?.id}`}
                onClick={closeMobileMenu}
                className="bg-gradient-to-l from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent"
              >
                <span className="mr-2 ">
                  <TbHome
                    className="text-2xl"
                    fill="url(#paint0_linear_235_990)"
                  />
                </span>
                Home
              </Link>
            ) : (
              <Link
                to={`/`}
                onClick={closeMobileMenu}
                className="bg-gradient-to-l from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent"
              >
                <span className="mr-2 ">
                  <TbHome
                    className="text-2xl "
                    fill="url(#paint0_linear_235_990)"
                  />
                </span>
                Home
              </Link>
            )}
          </li>

          <li className="">
            <Link
              to={`/profile/${user?.id}`}
              className="bg-gradient-to-l from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent"
              onClick={closeMobileMenu}
            >
              <span className="mr-2">
                <svg
                  stroke="currentColor"
                  fill="url(#paint0_linear_235_990)"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="text-2xl"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
                    fill=""
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z"
                    fill=""
                  ></path>
                </svg>
              </span>
              Profile
            </Link>
          </li>
          <li>
            <details onClick={openMobileSubMenu} open={isSubMenuOpen}>
              <summary className=" text-[#ACAAFF] ">
                <span className="mr-2">
                  <HiUserGroup
                    className="text-2xl"
                    fill="url(#paint0_linear_235_990)"
                  />
                </span>
                Social
              </summary>
              <ul>
                <li>
                  <Link
                    onClick={closeMobileMenu}
                    to={`/messageDashboard/${userIdParam}`}
                    className="bg-gradient-to-l from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent"
                  >
                    <span className="mr-2">
                      <TbMessage
                        className="text-2xl"
                        fill="url(#paint0_linear_235_990)"
                      />
                    </span>
                    Messages
                  </Link>
                </li>
                <li>
                  {" "}
                  <Link
                    onClick={closeMobileMenu}
                    to={`/find-users/${user?.id}`}
                    className="bg-gradient-to-l from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent"
                  >
                    <span className="mr-2">
                      <BsPersonAdd
                        className="text-2xl"
                        fill="url(#paint0_linear_235_990)"
                      />
                    </span>
                    Find Users
                  </Link>
                </li>
              </ul>
            </details>
          </li>
          <li className="">
            <a
              className="cursor-pointer bg-gradient-to-l from-[#C0E8FF] to-[#ACAAFF] bg-clip-text text-transparent"
              href="/"
              onClick={logOut}
            >
              <span className="mr-1 ml-1">
                <MdLogout
                  className="text-2xl"
                  fill="url(#paint0_linear_235_990)"
                />
              </span>
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
