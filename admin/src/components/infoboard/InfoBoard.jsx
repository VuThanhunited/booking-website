import { useEffect, useState } from "react";
import Widgets from "../widgets/Widgets";
import "./infoboard.css";

const InfoBoard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  return (
    <div className="infoBoard">
      <Widgets type="user" amount={stats?.users} loading={loading} />
      <Widgets type="order" amount={stats?.orders} loading={loading} />
      <Widgets type="earning" amount={stats?.earnings} loading={loading} />
      <Widgets type="balance" amount={stats?.balance} loading={loading} />
    </div>
  );
};

export default InfoBoard;
