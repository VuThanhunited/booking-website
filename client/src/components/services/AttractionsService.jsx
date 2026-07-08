import React from "react";
import "./Services.css";

const AttractionsService = () => {
  const attractions = [
    {
      id: 1,
      name: "VinWonders Theme Park Nha Trang",
      desc: "Instant booking, free cancellation, access to all rides & water park.",
      specs: ["Fast Track", "E-Ticket", "Water Park Included"],
      price: "$38",
      img: "https://images.unsplash.com/photo-1513885045263-c2d1265ec147?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      name: "Sun World Ba Na Hills Da Nang",
      desc: "Cable car tickets, Golden Bridge access, and Fantasy Park entrance.",
      specs: ["Instant Voucher", "Golden Bridge access", "All rides access"],
      price: "$35",
      img: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      name: "Hanoi Street Food Tour by Motorbike",
      desc: "Experience Hanoi culinary culture on a guided vintage motorcycle tour.",
      specs: ["English Guide", "Food & Drinks Included", "Hotel Pickup"],
      price: "$28",
      img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const handleBook = (name) => {
    alert(`Attraction booked successfully: ${name}! E-ticket sent via email.`);
  };

  return (
    <div className="serviceSection">
      <h2 className="serviceTitle">Top attractions and experiences</h2>
      <div className="serviceGrid">
        {attractions.map((attr) => (
          <div className="serviceCard" key={attr.id}>
            <img src={attr.img} alt={attr.name} className="serviceCardImg" />
            <div className="serviceCardContent">
              <h3>{attr.name}</h3>
              <p className="serviceCardDesc">{attr.desc}</p>
              <div className="serviceCardSpecs">
                {attr.specs.map((spec, i) => (
                  <span className="serviceSpecBadge" key={i}>{spec}</span>
                ))}
              </div>
              <div className="serviceCardPriceBlock">
                <div className="serviceCardPrice">{attr.price} <small>/person</small></div>
                <button className="serviceCardBtn" onClick={() => handleBook(attr.name)}>
                  Book Tickets
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttractionsService;
