import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import UserContext from "../../utils/UserContext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axios from "axios";
import "./dashboard.css";

const Dashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(0);
  const [term, setTerm] = useState(0);
  const [visible, setVisible] = useState(false);

  const { loggedInUser } = useContext(UserContext);
  const token = loggedInUser?.token;
  console.log(loggedInUser, "user");

  const location = useLocation();
  const data = JSON.parse(location?.state?.userData);
  console.log(data);

  const [updatedStates, setUpdatedStates] = useState({});

  const handleStateChange = (e, loanId) => {
    const newState = e.target.value;
    setUpdatedStates((prev) => ({
      ...prev,
      [loanId]: newState,
    }));
  };

  const updateLoanState = async (loanId) => {
    console.log("updating...");
    try {
      const newState = updatedStates[loanId];
      if (!newState) return; // Skip if no new state is selected

      await axios.patch(`/loan/approve/${loanId}`, { state: newState }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // alert("Loan state updated successfully!");

      fetchLoans();
    } catch (err) {
      console.error(err);
      alert("Failed to update loan state.");
    }
  };

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

  const handleAddLoan = async (e) => {
    e.preventDefault();
    const newLoan = { amount, term };
    try {
      const response = await axios.post("/loan/create", newLoan, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      setLoans([...loans, response.data.loan]);
      setAmount(0);
      setTerm(0);
      setVisible(false);
    } catch (error) {
      console.log("Error adding loan: ", error);
    }
  };
  console.log(loans);

  if (loading) return <div>Loading loans...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-div">
      <button className="a-btn" onClick={() => setVisible(true)}>
        Create a loan
      </button>
      <Dialog
        className="create-loan"
        header="New Loan Details"
        visible={visible}
        style={{ width: "35vw", height: "35vw" }}
        onHide={() => {
          setVisible(false);
          setAmount(0);
          setTerm(0);
        }}
        footer={
          <div className="footer-div">
            <Button label="Save" onClick={handleAddLoan} autoFocus />
            <Button
              label="Cancel"
              onClick={() => {
                setVisible(false);
                setAmount(0);
                setTerm(0);
              }}
            />
          </div>
        }
      >
        <form>
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <br />
          <input
            type="number"
            placeholder="Enter Term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            required
          />
        </form>
      </Dialog>
      {loans.length === 0 ? (
        <p>No loans found.</p>
      ) : (
        <table className="data-table">
          <caption className="t-caption">Loans</caption>
          <thead>
            <th>S.No</th>
            <th>Amount</th>
            <th>Term</th>
            <th>Status</th>
            <th>Created On</th>
          </thead>
          <tbody>
            {loans.map((loan, index) => (
              <tr key={loan._id}>
                <td>{index + 1}</td>
                <td> ${loan.amount}</td>
                <td>{loan.term}</td>
                {/* <td>{loan.state}</td> */}
                {data.role === "customer" ? (
                  <td>{loan.state}</td>
                ) : (
                  <td>
                    <div>
                      <select
                        defaultValue={loan.state}
                        disabled={
                          loan.state === "APPROVED" || loan.state === "PAID"
                        }
                        onChange={(e) => handleStateChange(e, loan._id)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="PAID" disabled>PAID</option>
                      </select>
                      <button onClick={() => updateLoanState(loan._id)}>
                        Update
                      </button>
                    </div>
                  </td>
                )}
                <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
