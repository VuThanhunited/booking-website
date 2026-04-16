import Widgets from "../widgets/Widgets";
import "./infoboard.css";

const InfoBoard = () => {
  return (
    <div className="infoBoard">
      <Widgets type="user" />
      <Widgets type="order" />
      <Widgets type="earning" />
      <Widgets type="balance" />
    </div>
  );
};

export default InfoBoard;
