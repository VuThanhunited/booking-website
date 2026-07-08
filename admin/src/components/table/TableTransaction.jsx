import "./table.css";
import { useEffect, useState } from "react";

const TableTransaction = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/transactions`
        );
        const data = await res.json();
        console.log(data);
        setTransactions(data.slice(0, 8)); // lấy 8 giao dịch mới nhất
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="transactionTableContainer">
      <h2 className="transactionTitle">Latest Transactions</h2>
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
              <td>{t.roomNumbers.map((r) => r.number).join(", ")}</td>
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
      <div className="pagination">1–8 of 8</div>
    </div>
  );
};

export default TableTransaction;
