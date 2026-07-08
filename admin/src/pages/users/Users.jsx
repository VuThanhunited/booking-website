import { useEffect, useState } from "react";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users`);
      const data = await res.json();
      setUsers(data); // API đã lọc isDeleted=false
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa user này?");
    if (!confirm) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${id}/delete`,
        {
          method: "PUT",
        }
      );

      if (res.ok) {
        setUsers(users.filter((user) => user._id !== id)); // chỉ xóa khỏi UI
      } else {
        const result = await res.text();
        alert("Xoá thất bại: " + result);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Đã xảy ra lỗi khi xoá user!");
    }
  };

  const toggleActiveStatus = async (id, isActive) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !isActive }),
        }
      );

      if (res.ok) {
        fetchUsers(); // refresh list
      } else {
        alert("Không thể cập nhật trạng thái!");
      }
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  return (
    <div className="user-container">
      <h2>Quản lý người dùng</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? "✔️" : "❌"}</td>
              <td>{user.isActive ? "Active" : "Inactive"}</td>
              <td>
                <button
                  onClick={() => toggleActiveStatus(user._id, user.isActive)}
                  style={{ marginRight: "8px" }}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
