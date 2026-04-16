import { useEffect, useState } from "react";
import "./propertyList.css";
import axios from "axios";

const images = {
  hotel:
    "https://cf.bstatic.com/xdata/images/xphoto/square300/57584488.webp?k=bf724e4e9b9b75480bbe7fc675460a089ba6414fe4693b83ea3fdd8e938832a6&o=",
  apartment:
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-apartments_300/9f60235dc09a3ac3f0a93adbc901c61ecd1ce72e.jpg",
  resort:
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/bg_resorts/6f87c6143fbd51a0bb5d15ca3b9cf84211ab0884.jpg",
  villa:
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-villas_300/dd0d7f8202676306a661aa4f0cf1ffab31286211.jpg",
  cabin:
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-chalet_300/8ee014fcc493cb3334e25893a1dee8c6d36ed0ba.jpg",
};

const PropertyList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/hotels/countByType`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="pList">
      {data.map((item) => (
        <div className="pListItem" key={item.type}>
          <img src={images[item.type]} alt={item.type} className="pListImg" />
          <div className="pListTitles">
            <h1>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}s</h1>
            <h2>
              {item.count} {item.type}s
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
