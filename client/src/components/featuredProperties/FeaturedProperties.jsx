import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./featuredProperties.css";

const FeaturedProperties = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/hotels/top-rated`)
      .then((res) => {
        const sorted = res.data.sort((a, b) => b.rating - a.rating);
        setData(sorted);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="fp">
      {data.map((hotel) => (
        <div className="fpItem" key={hotel._id}>
          <img
            src={
              hotel.photos?.[0]?.startsWith("http")
                ? hotel.photos[0]
                : `${process.env.REACT_APP_API_URL}/images/no-image.jpg`
            }
            alt={hotel.name}
            className="fpImg"
          />
          <span className="fpName">
            <Link to={`/hotels/${hotel._id}`}>{hotel.name}</Link>
          </span>
          <span className="fpCity">{hotel.city}</span>
          <span className="fpPrice">Starting from ${hotel.cheapestPrice}</span>
          <div className="fpRating">
            <button>{hotel.rating}</button>
            <span>{hotel.rating > 9 ? "Exceptional" : "Excellent"}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProperties;
