import Sidebar from "../../components/Sidebar/Sidebar";
import InfoBoard from "../../components/infoboard/InfoBoard";
import TableTransaction from "../../components/table/TableTransaction";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboardContainer">
        <InfoBoard />
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <TableTransaction />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
