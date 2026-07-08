import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import axios from "axios";
import SearchItem from "../../components/searchItem/SearchItem";
import { useLanguage } from "../../context/LanguageContext";

const List = () => {
  const { lang, t } = useLanguage();
  const location = useLocation();
  const [destination, setDestination] = useState(location.state?.destination || "");
  const [date, setDate] = useState(
    location.state?.date || [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]
  );
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(
    location.state?.options || {
      adult: 1,
      children: 0,
      room: 1,
    }
  );

  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [hotels, setHotels] = useState([]);

  const fetchHotels = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/hotels/search`,
        {
          params: {
            city: destination,
            startDate: date[0].startDate.toISOString(),
            endDate: date[0].endDate.toISOString(),
            room: options.room,
            min: minPrice || 0,
            max: maxPrice || 9999,
          },
        }
      );
      const hotelsData = Array.isArray(res.data) ? res.data : [];
      setHotels(hotelsData);
    } catch (err) {
      console.log(err);
      setHotels([]);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">{t("searchTitle")}</h1>
            <div className="lsItem">
              <label>{t("destinationLabel")}</label>
              <input
                placeholder={destination}
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="lsItem">
              <label>{t("checkInDate")}</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                lang === "vi" ? "dd/MM/yyyy" : "MM/dd/yyyy"
              )} ${lang === "vi" ? "đến" : "to"} ${format(date[0].endDate, lang === "vi" ? "dd/MM/yyyy" : "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="lsItem">
              <label>{t("optionsLabel")}</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    {lang === "vi" ? "Giá tối thiểu " : "Min price "}
                    <small>{lang === "vi" ? "(mỗi đêm)" : "(per night)"}</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    {lang === "vi" ? "Giá tối đa " : "Max price "}
                    <small>{lang === "vi" ? "(mỗi đêm)" : "(per night)"}</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">{t("adult")}</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        adult: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">{t("children")}</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        children: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">{t("room")}</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        room: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <button onClick={fetchHotels}>{t("searchBtn")}</button>
          </div>
          <div className="listResult">
            {hotels.length === 0 ? (
              <p className="noResults">{lang === "vi" ? "Không tìm thấy kết quả nào" : "No results found"}</p>
            ) : (
              hotels.map((hotel) => (
                <SearchItem
                  key={hotel._id}
                  id={hotel._id}
                  name={hotel.name}
                  distance={hotel.distance + "m"}
                  tag={hotel.tag}
                  type={hotel.type}
                  description={hotel.desc}
                  free_cancel={hotel.free_cancel}
                  price={hotel.cheapestPrice}
                  rate={hotel.rating}
                  img_url={
                    hotel.photos?.[0]?.startsWith("http")
                      ? hotel.photos[0]
                      : "https://via.placeholder.com/400x300?text=No+Image"
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default List;
