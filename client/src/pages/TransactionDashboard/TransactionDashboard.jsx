import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Transaction.css";
import Headers from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const Transactions = () => {
  const { user } = useContext(AuthContext);
  const { lang, t } = useLanguage();
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
        setError(lang === "vi" ? "Lỗi tải lịch sử giao dịch" : "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchTransactions();
  }, [userId, lang]);

  const handleCancel = async (transactionId) => {
    const confirmMsg = lang === "vi" 
      ? "Bạn có chắc chắn muốn hủy giao dịch này?" 
      : "Are you sure you want to cancel this transaction?";
    if (!window.confirm(confirmMsg)) return;
    
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/transactions/cancel/${transactionId}`
      );
      alert(lang === "vi" ? "Đã hủy giao dịch thành công" : "Transaction canceled successfully.");
      setTransactions((prev) =>
        prev.map((tx) =>
          tx._id === transactionId ? { ...tx, status: "Canceled" } : tx
        )
      );
    } catch (err) {
      alert(lang === "vi" ? "Không thể hủy giao dịch" : "Could not cancel transaction.");
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
      
      const successMsg = lang === "vi"
        ? `Đã xóa ${result.count} giao dịch đã huỷ.`
        : `Deleted ${result.count} canceled transactions.`;
      alert(successMsg);
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
          <h2>{t("yourTransactions")}</h2>
        </div>
        {loading ? (
          <p>{t("loading")}</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : transactions.length === 0 ? (
          <p>{t("noTransactions")}</p>
        ) : (
          <div>
            <button className="delete-btn" onClick={handleDeleteCanceled}>
              {t("deleteCanceled")}
            </button>
            <div className="table-container">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t("hotel")}</th>
                    <th>{t("roomLabel")}</th>
                    <th>{t("roomNumbersLabel")}</th>
                    <th>{t("date")}</th>
                    <th>{t("price")}</th>
                    <th>{t("paymentMethod")}</th>
                    <th>{t("status")}</th>
                    <th>{t("action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={tx._id}>
                      <td>{index + 1}</td>
                      <td>{tx.hotelName || "Loading..."}</td>
                      <td>{tx.roomTypes || "N/A"}</td>
                      <td>{tx.roomNumbers.join(", ")}</td>
                      <td>
                        {new Date(tx.dateStart).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")} -{" "}
                        {new Date(tx.dateEnd).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")}
                      </td>
                      <td>${tx.totalPrice}</td>
                      <td>{tx.payment}</td>
                      <td>
                        <span className={`status ${tx.status}`}>{tx.status}</span>
                      </td>
                      <td>
                        {tx.status !== "Canceled" && (
                          <button
                            className="cancel-btn"
                            onClick={() => handleCancel(tx._id)}
                          >
                            {t("cancel")}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
