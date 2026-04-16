import { useEffect, useState } from "react";
import "./featured.css";
import axios from "axios";

const Featured = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/hotels/countByCity`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="featured">
      {data.map((item) => {
        return (
          <div className="featuredItem" key={item.city}>
            <img src={item.image} alt={item.city} className="featuredImg" />
            <div className="featuredTitles">
              <h1>{item.city}</h1>
              <h2>{item.count} properties</h2>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Featured;
