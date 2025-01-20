import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import CreateComment from "./pages/CreateComment";
import SignInModal from "./components/SignInModal";
import MessageDashboard from "./pages/MessageDashboard";
import CreateMessage from "./pages/CreateMessage";
import FindUsers from "./pages/FindUsers";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/main/:userId"
          element={<Home loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
        />
        <Route path="/" element={<Home />} />

        <Route path="/sign-in" element={<SignIn setLoggedIn={setLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/create-comment/:id" element={<CreateComment />} />
        <Route path="/messageDashboard/:id" element={<MessageDashboard />} />
        <Route path="/message/:id" element={<CreateMessage />} />
        <Route path="/find-users/:id" element={<FindUsers />} />
      </Routes>
    </div>
  );
}

export default App;
