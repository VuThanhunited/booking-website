import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Transaction.css";
import Headers from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";

const Transactions = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = user?.id || user?._id;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/transactions/user/${userId}`
        );
        setTransactions(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchTransactions();
  }, [userId]);

  const handleCancel = async (transactionId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy giao dịch này?")) return;
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/transactions/cancel/${transactionId}`
      );
      alert("Đã cập nhật trạng thái thành 'Canceled'");
      setTransactions((prev) =>
        prev.map((tx) =>
          tx._id === transactionId ? { ...tx, status: "Canceled" } : tx
        )
      );
    } catch (err) {
      alert("Không thể hủy giao dịch");
    }
  };

  const handleDeleteCanceled = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/transactions/canceled`,
        {
          method: "DELETE",
        }
      );
      const result = await res.json();
      setTransactions((prev) => prev.filter((t) => t.status !== "Canceled"));
      alert(`Đã xóa ${result.count} giao dịch đã huỷ.`);
    } catch (err) {
      console.error("❌ Delete canceled error:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <Headers />
      <div className="transaction-page">
        <div className="header-actions">
          <h2>Your Transactions</h2>
        </div>
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : transactions.length === 0 ? (
          <p>Không có giao dịch</p>
        ) : (
          <div>
            <button className="delete-btn" onClick={handleDeleteCanceled}>
              Xóa giao dịch đã hủy
            </button>
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Hotel</th>
                  <th>Room</th>
                  <th>Room Number</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={tx._id}>
                    <td>{String(index + 1).padStart(2, "0")}</td>
                    <td>{tx.hotel?.name || "N/A"}</td>
                    <td>{tx.roomTitles?.join(", ") || "N/A"}</td>
                    <td>{tx.roomNumbers?.map((r) => r.number).join(", ")}</td>
                    <td>
                      {new Date(tx.dateStart).toLocaleDateString()} -{" "}
                      {new Date(tx.dateEnd).toLocaleDateString()}
                    </td>
                    <td>${tx.totalPrice}</td>
                    <td>{tx.payment}</td>
                    <td>
                      <span className={`status ${tx.status}`}>{tx.status}</span>
                      {tx.status !== "Canceled" && (
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancel(tx._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
