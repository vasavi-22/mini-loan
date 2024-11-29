import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import UserContext from "../../utils/UserContext";
import axios from "axios";

const Dashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(0);
  const [term, setTerm] = useState(0);

  const { loggedInUser } = useContext(UserContext);
  const token = loggedInUser.token;
  console.log(loggedInUser, "user");

  const location = useLocation();
  const data = JSON.parse(location?.state?.userData);
  console.log(data);

  const fetchLoans = async () => {
    try {
      if (data.role === "customer") {
        const response = await axios.get("/loan/my-loans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setLoans(response.data);      
      } else {
        const response = await axios.get("/loan/all-loans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setLoans(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLoans();
    }
  }, []);

  if (loading) return <div>Loading loans...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Loans</h2>
      {loans.length === 0 ? (
        <p>No loans found.</p>
      ) : (
        <ul>
          {loans.map((loan) => (
            <li key={loan._id}>
              <strong>Amount:</strong> ${loan.amount} <br />
              <strong>Term:</strong> {loan.term} weeks <br />
              <strong>Status:</strong> {loan.state} <br />
              <strong>Created On:</strong>{" "}
              {new Date(loan.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
