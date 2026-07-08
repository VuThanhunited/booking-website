import {
  faBed,
  faCalendarDays,
  faPerson,
  faPlane,
  faCar,
  faTaxi,
  faTicket,
  faSuitcase,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { DateRange } from "react-date-range";
import { useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const Header = ({ type, activeTab = "stays", setActiveTab }) => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });

  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const handleTabClick = (tabName) => {
    if (setActiveTab) {
      setActiveTab(tabName);
    } else {
      navigate("/", { state: { initialTab: tabName } });
    }
  };

  const handleSearch = () => {
    if (activeTab === "stays") {
      navigate("/hotels", { state: { destination, date, options } });
    } else {
      alert(lang === "vi" ? "Tính năng tìm kiếm đang được xử lý..." : "Search action is processing...");
    }
  };

  const formatShortDate = (d) => {
    if (lang === "vi") {
      const days = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
      const dayName = days[d.getDay()];
      const dayNum = d.getDate();
      const monthNum = d.getMonth() + 1;
      return `${dayName}, ${dayNum} thg ${monthNum}`;
    } else {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
    }
  };

  const dateStr = date[0].startDate.toDateString() === date[0].endDate.toDateString()
    ? (lang === "vi" ? "Nhận phòng — Trả phòng" : "Check-in — Check-out")
    : `${formatShortDate(date[0].startDate)} — ${formatShortDate(date[0].endDate)}`;

  const optionsStr = lang === "vi"
    ? `${options.adult} người lớn · ${options.children} trẻ em · ${options.room} phòng`
    : `${options.adult} ${options.adult > 1 ? "adults" : "adult"} · ${options.children} ${options.children > 1 ? "children" : "child"} · ${options.room} ${options.room > 1 ? "rooms" : "room"}`;

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        <div className="headerList">
          <div
            className={`headerListItem ${activeTab === "stays" ? "active" : ""}`}
            onClick={() => handleTabClick("stays")}
          >
            <FontAwesomeIcon icon={faBed} />
            <span>{t("stays")}</span>
          </div>
          <div
            className={`headerListItem ${activeTab === "flights" ? "active" : ""}`}
            onClick={() => handleTabClick("flights")}
          >
            <FontAwesomeIcon icon={faPlane} />
            <span>{t("flights")}</span>
          </div>
          <div
            className={`headerListItem ${activeTab === "carRentals" ? "active" : ""}`}
            onClick={() => handleTabClick("carRentals")}
          >
            <FontAwesomeIcon icon={faCar} />
            <span>{t("carRentals")}</span>
          </div>
          <div
            className={`headerListItem ${activeTab === "attractions" ? "active" : ""}`}
            onClick={() => handleTabClick("attractions")}
          >
            <FontAwesomeIcon icon={faTicket} />
            <span>{t("attractions")}</span>
          </div>
          <div
            className={`headerListItem ${activeTab === "taxis" ? "active" : ""}`}
            onClick={() => handleTabClick("taxis")}
          >
            <FontAwesomeIcon icon={faTaxi} />
            <span>{t("airportTaxis")}</span>
          </div>
        </div>

        {type !== "list" && (
          <>
            <h1 className="headerTitle">
              {t("heroTitle")}
            </h1>
            <p className="headerDesc">
              {t("heroDesc")}
            </p>

            <div className="headerSearch">
              {activeTab === "stays" && (
                <>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faBed} className="headerIcon" />
                    <input
                      type="text"
                      placeholder={t("searchPlaceholder")}
                      className="headerSearchInput"
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                    <span
                      onClick={() => setOpenDate(!openDate)}
                      className="headerSearchText"
                    >{dateStr}</span>
                    {openDate && (
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDate([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        className="date"
                        minDate={new Date()}
                      />
                    )}
                  </div>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                    <span
                      onClick={() => setOpenOptions(!openOptions)}
                      className="headerSearchText"
                    >{optionsStr}</span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="headerChevronIcon"
                      onClick={() => setOpenOptions(!openOptions)}
                    />
                    {openOptions && (
                      <div className="options">
                        <div className="optionItem">
                          <span className="optionText">{t("adult")}</span>
                          <div className="optionCounter">
                            <button
                              disabled={options.adult <= 1}
                              className="optionCounterButton"
                              onClick={() => handleOption("adult", "d")}
                            >
                              -
                            </button>
                            <span className="optionCounterNumber">
                              {options.adult}
                            </span>
                            <button
                              className="optionCounterButton"
                              onClick={() => handleOption("adult", "i")}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="optionItem">
                          <span className="optionText">{t("children")}</span>
                          <div className="optionCounter">
                            <button
                              disabled={options.children <= 0}
                              className="optionCounterButton"
                              onClick={() => handleOption("children", "d")}
                            >
                              -
                            </button>
                            <span className="optionCounterNumber">
                              {options.children}
                            </span>
                            <button
                              className="optionCounterButton"
                              onClick={() => handleOption("children", "i")}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="optionItem">
                          <span className="optionText">{t("room")}</span>
                          <div className="optionCounter">
                            <button
                              disabled={options.room <= 1}
                              className="optionCounterButton"
                              onClick={() => handleOption("room", "d")}
                            >
                              -
                            </button>
                            <span className="optionCounterNumber">
                              {options.room}
                            </span>
                            <button
                              className="optionCounterButton"
                              onClick={() => handleOption("room", "i")}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === "flights" && (
                <>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faPlane} className="headerIcon" />
                    <input
                      type="text"
                      placeholder={lang === "vi" ? "Điểm khởi hành?" : "Where from?"}
                      className="headerSearchInput"
                    />
                  </div>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faPlane} className="headerIcon" />
                    <input
                      type="text"
                      placeholder={lang === "vi" ? "Điểm đến?" : "Where to?"}
                      className="headerSearchInput"
                    />
                  </div>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                    <span
                      onClick={() => setOpenDate(!openDate)}
                      className="headerSearchText"
                    >{dateStr}</span>
                    {openDate && (
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDate([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        className="date"
                        minDate={new Date()}
                      />
                    )}
                  </div>
                </>
              )}

              {activeTab === "flightHotel" && (
                <>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faSuitcase} className="headerIcon" />
                    <input
                      type="text"
                      placeholder={lang === "vi" ? "Khởi hành từ?" : "Departure airport?"}
                      className="headerSearchInput"
                    />
                  </div>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faBed} className="headerIcon" />
                    <input
                      type="text"
                      placeholder={lang === "vi" ? "Điểm đến?" : "Destination?"}
                      className="headerSearchInput"
                    />
                  </div>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                    <span
                      onClick={() => setOpenDate(!openDate)}
                      className="headerSearchText"
                    >{dateStr}</span>
                    {openDate && (
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDate([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        className="date"
                        minDate={new Date()}
                      />
                    )}
                  </div>
                </>
              )}

              {activeTab === "carRentals" && (
                <>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faCar} className="headerIcon" />
                    <input
                      type="text"
                      placeholder={lang === "vi" ? "Địa điểm nhận xe?" : "Pickup location?"}
                      className="headerSearchInput"
                    />
                  </div>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                    <span
                      onClick={() => setOpenDate(!openDate)}
                      className="headerSearchText"
                    >{dateStr}</span>
                    {openDate && (
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDate([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        className="date"
                        minDate={new Date()}
                      />
                    )}
                  </div>
                </>
              )}

              {activeTab === "attractions" && (
                <>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faTicket} className="headerIcon" />
                    <input
                      type="text"
                      placeholder={lang === "vi" ? "Bạn muốn đi đâu?" : "Search attractions?"}
                      className="headerSearchInput"
                    />
                  </div>
                  <div className="headerSearchItem" style={{ flex: 1.5 }}>
                    <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                    <span
                      onClick={() => setOpenDate(!openDate)}
                      className="headerSearchText"
                    >{dateStr}</span>
                    {openDate && (
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDate([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        className="date"
                        minDate={new Date()}
                      />
                    )}
                  </div>
                </>
              )}

              {activeTab === "taxis" && (
                <>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faTaxi} className="headerIcon" />
                    <input
                      type="text"
                      placeholder={lang === "vi" ? "Địa điểm đón?" : "Pickup location?"}
                      className="headerSearchInput"
                    />
                  </div>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faTaxi} className="headerIcon" />
                    <input
                      type="text"
                      placeholder={lang === "vi" ? "Điểm đến (khách sạn, địa chỉ)?" : "Dropoff destination?"}
                      className="headerSearchInput"
                    />
                  </div>
                  <div className="headerSearchItem">
                    <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                    <span
                      onClick={() => setOpenDate(!openDate)}
                      className="headerSearchText"
                    >{dateStr}</span>
                    {openDate && (
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDate([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        className="date"
                        minDate={new Date()}
                      />
                    )}
                  </div>
                </>
              )}

              <div className="headerSearchItem">
                <button className="headerBtn" onClick={handleSearch}>
                  {t("searchBtnShort")}
                </button>
              </div>
            </div>
            <div className="headerSearchCheckbox">
              <div className="checkboxItem">
                <input type="checkbox" id="workTripSearch" />
                <label htmlFor="workTripSearch">{t("workTrip")}</label>
              </div>
              <div className="checkboxItem">
                <input type="checkbox" id="addFlightsSearch" />
                <label htmlFor="addFlightsSearch">{t("addFlights")}</label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
