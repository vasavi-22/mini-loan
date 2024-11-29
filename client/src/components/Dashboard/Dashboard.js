import React from "react";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
    const location = useLocation();
    console.log(location?.state?.userData);
    return(
        <div>this is dashboard...</div>
    );
};

export default Dashboard;