import React from "react";
import "./Services.css";

const FlightsService = () => {
  const flightDeals = [
    {
      id: 1,
      from: "Hanoi (HAN)",
      to: "Ho Chi Minh City (SGN)",
      airline: "Vietnam Airlines",
      date: "Jul 15 - Jul 20",
      class: "Economy Class",
      price: "$85",
      img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      from: "Da Nang (DAD)",
      to: "Bangkok (BKK)",
      airline: "VietJet Air",
      date: "Jul 18 - Jul 22",
      class: "Economy Class",
      price: "$110",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      from: "Ho Chi Minh City (SGN)",
      to: "Singapore (SIN)",
      airline: "Bamboo Airways",
      date: "Aug 02 - Aug 07",
      class: "Economy Class",
      price: "$145",
      img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const handleBook = (route) => {
    alert(`Successfully booked flight: ${route}! Confirmation sent via email.`);
  };

  return (
    <div className="serviceSection">
      <h2 className="serviceTitle">Popular flights near you</h2>
      <div className="serviceGrid">
        {flightDeals.map((flight) => (
          <div className="serviceCard" key={flight.id}>
            <img src={flight.img} alt={flight.from} className="serviceCardImg" />
            <div className="serviceCardContent">
              <div className="flightDetails">
                <div className="flightRoute">
                  <span>{flight.from}</span>
                  <span className="flightArrow">➔</span>
                  <span>{flight.to}</span>
                </div>
                <div className="flightInfo">{flight.airline} · {flight.date}</div>
              </div>
              <div className="serviceCardSpecs">
                <span className="serviceSpecBadge">{flight.class}</span>
                <span className="serviceSpecBadge">Round Trip</span>
              </div>
              <div className="serviceCardPriceBlock">
                <div className="serviceCardPrice">{flight.price} <small>/person</small></div>
                <button className="serviceCardBtn" onClick={() => handleBook(`${flight.from} to ${flight.to}`)}>
                  Book Flight
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightsService;
