import "./widgets.css";
import {
  PersonOutline,
  ShoppingCart,
  MonetizationOn,
  AccountBalanceWallet,
} from "@mui/icons-material"; // <-- dùng icons MUI

const Widgets = ({ type, amount, loading }) => {
  let data;

  const displayAmount = loading ? "..." : amount !== undefined ? amount : 0;

  switch (type) {
    case "user":
      data = {
        title: "Users",
        amount: displayAmount,
        icon: (
          <PersonOutline
            className="icon"
            style={{
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              color: "crimson",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "Orders",
        amount: displayAmount,
        icon: (
          <ShoppingCart
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "Earnings",
        amount: displayAmount,
        icon: (
          <MonetizationOn
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "Balance",
        amount: displayAmount,
        icon: (
          <AccountBalanceWallet
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{data.amount}</span>
      </div>
      <div className="right">{data.icon}</div>
    </div>
  );
};

export default Widgets;
