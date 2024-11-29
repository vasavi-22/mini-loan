import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes";
import UserContext from "./utils/UserContext";

function App() {
  const [user, setUser] = useState({});
  return (
    <UserContext.Provider value={{loggedInUser: user, setUser}}>
      <div className="App">
        <Router>
          <AppRoutes />
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
