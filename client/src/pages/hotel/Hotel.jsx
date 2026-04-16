import "./hotel.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import BookHotel from "./BookHotel";
import { useParams } from "react-router-dom";
import axios from "axios";

const Hotel = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [hotel, setHotel] = useState(null);

  // Call API to get hotel details by ID
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/hotels/${id}`
        );
        setHotel(res.data);
      } catch (err) {
        console.error("Failed to fetch hotel:", err);
      }
    };
    fetchHotel();
  }, [id]);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber =
        slideNumber === 0 ? hotel.photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber =
        slideNumber === hotel.photos.length - 1 ? 0 : slideNumber + 1;
    }
    setSlideNumber(newSlideNumber);
  };

  if (!hotel) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="hotelContainer">
        {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img
                src={hotel.photos[slideNumber]}
                alt=""
                className="sliderImg"
              />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )}
        <div className="hotelWrapper">
          <div className="hotelHeader">
            <h1 className="hotelTitle">{hotel.name}</h1>

            <button
              className="bookNow"
              onClick={() => setShowBookingForm(!showBookingForm)}
            >
              Book Now!
            </button>
          </div>

          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{hotel.address}</span>
          </div>
          <span className="hotelDistance">{hotel.locationHighlight}</span>
          <span className="hotelPriceHighlight">{hotel.promotion}</span>
          <div className="hotelImages">
            {hotel.photos.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">Stay at {hotel.name}</h1>
              <p className="hotelDesc">{hotel.description}</p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a stay!</h1>
              <span>{hotel.locationHighlight}</span>
              <h2>
                <b>${hotel.cheapestPrice}</b> (1 night)
              </h2>
              {/* ADD this button below */}
              <button
                className="bookNow"
                onClick={() => setShowBookingForm(!showBookingForm)}
              >
                Book Now!
              </button>
            </div>
          </div>
        </div>
        {showBookingForm && (
          <BookHotel hotelId={id} hotelName={hotel.name} userInfo={user} />
        )}
        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Hotel;
