// components/AdminLayout.jsx
import Sidebar from "./Sidebar/Sidebar";
import "./adminLayout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="adminApp">
      <div>
        <Sidebar />
      </div>

      <div className="adminPageContent">{children}</div>
    </div>
  );
};

export default AdminLayout;
