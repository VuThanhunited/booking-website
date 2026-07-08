import React from "react";
import "./Services.css";

const FlightHotelService = () => {
  const packages = [
    {
      id: 1,
      name: "Sol by Meliá Phu Quoc Package",
      desc: "Round-trip flights from HAN/SGN + 3 Nights stay at 4-star beachfront resort Sol Phu Quoc.",
      specs: ["Flight Included", "Breakfast Free", "Beachfront View"],
      price: "$290",
      img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      name: "Hyatt Regency Da Nang Resort Package",
      desc: "Round-trip flights + 4 Nights stay at premium luxury villa Hyatt Regency Da Nang.",
      specs: ["Flight Included", "Spa discount 20%", "Infinity Pool access"],
      price: "$380",
      img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      name: "Swiss-Belresort Tuyen Lam Da Lat Package",
      desc: "Round-trip flights + 3 Nights stay at golf resort Swiss-Belresort Tuyen Lam.",
      specs: ["Flight Included", "Mountain View Room", "Shuttle bus free"],
      price: "$210",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const handleBook = (name) => {
    alert(`Vacation package booked: ${name}! Vouchers and flight itinerary sent via email.`);
  };

  return (
    <div className="serviceSection">
      <h2 className="serviceTitle">Flight + Hotel packages for your getaway</h2>
      <div className="serviceGrid">
        {packages.map((pkg) => (
          <div className="serviceCard" key={pkg.id}>
            <img src={pkg.img} alt={pkg.name} className="serviceCardImg" />
            <div className="serviceCardContent">
              <h3>{pkg.name}</h3>
              <p className="serviceCardDesc">{pkg.desc}</p>
              <div className="serviceCardSpecs">
                {pkg.specs.map((spec, i) => (
                  <span className="serviceSpecBadge" key={i}>{spec}</span>
                ))}
              </div>
              <div className="serviceCardPriceBlock">
                <div className="serviceCardPrice">{pkg.price} <small>/person</small></div>
                <button className="serviceCardBtn" onClick={() => handleBook(pkg.name)}>
                  Book Package
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightHotelService;
