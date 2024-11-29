import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import UserContext from "../../utils/UserContext";

const Header = () => {
  const { loggedInUser, setUser } = useContext(UserContext);
  const [loginStatus, setLoginStatus] = useState(false);
  const location = useLocation();

  // Debugging output for loggedInUser and token
  console.log(loggedInUser, "user");
  console.log(loggedInUser.token, "token");

  // Update loginStatus when loggedInUser changes
  useEffect(() => {
    setLoginStatus(!!loggedInUser.token); // If token exists, set loginStatus to true
  }, [loggedInUser]);

  // Logout handler
  const handleLogout = () => {
    const token = loggedInUser?.token;
    if (!token) {
      console.error("No token found for logout");
      return;
    }

    axios
      .post("/user/logout", { token }, { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        setLoginStatus(false); // Reset login status
        setUser({}); // Clear user in context
        console.log("logged out successfully");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <div className="header">
      <Link to="/" onClick={handleLogout}>
        <FontAwesomeIcon icon={faClipboardList} style={{ fontSize: "2em" }} />
      </Link>
      {loginStatus ? (
        <ul className="nav-items">
          <li className="logout">
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="nav-items">
          <li>
            <Link
              to="/login"
              className={location.pathname === "/login" ? "active" : ""}
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className={location.pathname === "/signup" ? "active" : ""}
            >
              Signup
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Header;
