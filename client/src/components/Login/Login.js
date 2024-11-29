import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import UserContext from "../../utils/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { loggedInUser, setUser} = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/login", {
        email,
        password,
      },{
        withCredentials: true, // This ensures cookies are sent with the request
      });
      const token = response.data.token; // Assuming token is returned in the response
      console.log(response, "response");
      setUser(response.data);

      const userData = JSON.stringify(response.data.user);
      console.log(userData, "userdata");
      navigate("/dashboard", { state: { userData } });

    } catch (error) {
      alert("Login failed!");
    }
  };

  return (
    <div className="login-div">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        /><br/>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        /><br/>
        <button type="submit">Log In</button>
        <p>
          Don't have an account? <Link to="/signup"> Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
