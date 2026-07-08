import React from "react";
import "./Services.css";

const TaxisService = () => {
  const taxis = [
    {
      id: 1,
      name: "Standard Sedan Transfer",
      type: "Toyota Vios or equivalent",
      specs: ["4 Passengers", "2 Bags", "Meet & Greet", "Fixed Price"],
      price: "$15",
      img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      name: "Executive SUV Transfer",
      type: "Toyota Fortuner or equivalent",
      specs: ["6 Passengers", "4 Bags", "Meet & Greet", "Flight tracking"],
      price: "$22",
      img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      name: "Premium Passenger Van",
      type: "Ford Transit or equivalent",
      specs: ["12 Passengers", "8 Bags", "Meet & Greet", "Flight tracking"],
      price: "$35",
      img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const handleBook = (name) => {
    alert(`Airport taxi booked: ${name}! Driver details will be sent via SMS.`);
  };

  return (
    <div className="serviceSection">
      <h2 className="serviceTitle">Airport transfers made simple</h2>
      <div className="serviceGrid">
        {taxis.map((taxi) => (
          <div className="serviceCard" key={taxi.id}>
            <img src={taxi.img} alt={taxi.name} className="serviceCardImg" />
            <div className="serviceCardContent">
              <h3>{taxi.name}</h3>
              <p className="serviceCardDesc">{taxi.type}</p>
              <div className="serviceCardSpecs">
                {taxi.specs.map((spec, i) => (
                  <span className="serviceSpecBadge" key={i}>{spec}</span>
                ))}
              </div>
              <div className="serviceCardPriceBlock">
                <div className="serviceCardPrice">{taxi.price} <small>/transfer</small></div>
                <button className="serviceCardBtn" onClick={() => handleBook(taxi.name)}>
                  Book Taxi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaxisService;
