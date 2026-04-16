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

const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [date, setDate] = useState(location.state.date);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);

  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
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
        setHotels(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchHotels();
  }, [destination, date, options, minPrice, maxPrice]);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input
                placeholder={destination}
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(date[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
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
                  <span className="lsOptionText">Children</span>
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
                  <span className="lsOptionText">Room</span>
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
          </div>
          <div className="listResult">
            {hotels.length === 0 ? (
              <p>No results found</p>
            ) : (
              hotels.map((hotel) => (
                <SearchItem
                  key={hotel._id}
                  name={hotel.name}
                  distance={hotel.distance + "m"}
                  tag={hotel.tag}
                  type={hotel.type}
                  description={hotel.desc}
                  free_cancel={hotel.free_cancel}
                  price={hotel.cheapestPrice}
                  rate={hotel.rating}
                  rate_text={hotel.rating > 9 ? "Exceptional" : "Excellent"}
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
