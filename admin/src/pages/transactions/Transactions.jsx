import { useEffect, useState } from "react";
import "./transactions.css";
import { useAdminAuth } from "../../context/AdminAuthContext";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const { token } = useAdminAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/transactions`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        setTransactions(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
  }, [token]);

  return (
    <div className="transactionListContainer">
      <div className="transactionListTop">
        <h2>Transactions List</h2>
      </div>
      <table className="transactionTable">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>ID</th>
            <th>User</th>
            <th>Hotel</th>
            <th>Room</th>
            <th>Date</th>
            <th>Price</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{t._id}</td>
              <td>{t.fullName}</td>
              <td>{t.hotel.name}</td>
              <td>{t.roomTitles}</td>
              <td>
                {new Date(t.dateStart).toLocaleDateString()} -{" "}
                {new Date(t.dateEnd).toLocaleDateString()}
              </td>
              <td>${t.totalPrice}</td>
              <td>{t.payment}</td>
              <td>
                <span className={`status ${t.status.toLowerCase()}`}>
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        1–{transactions.length} of {transactions.length}
      </div>
    </div>
  );
};

export default TransactionList;
