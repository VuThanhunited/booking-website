import React from "react";
import "./Services.css";

const CarRentalsService = () => {
  const cars = [
    {
      id: 1,
      name: "Toyota Camry",
      type: "Standard Sedan",
      specs: ["5 Seats", "Automatic", "2 Bags", "A/C"],
      price: "$45",
      img: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      name: "Honda CR-V",
      type: "Medium SUV",
      specs: ["5 Seats", "Automatic", "4 Bags", "A/C"],
      price: "$60",
      img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      name: "Ford Transit",
      type: "Passenger Van",
      specs: ["12 Seats", "Manual", "6 Bags", "A/C"],
      price: "$95",
      img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const handleRent = (carName) => {
    alert(`Car rental reserved: ${carName}! Confirmation details have been emailed.`);
  };

  return (
    <div className="serviceSection">
      <h2 className="serviceTitle">Car rentals for any kind of trip</h2>
      <div className="serviceGrid">
        {cars.map((car) => (
          <div className="serviceCard" key={car.id}>
            <img src={car.img} alt={car.name} className="serviceCardImg" />
            <div className="serviceCardContent">
              <h3>{car.name}</h3>
              <p className="serviceCardDesc">{car.type}</p>
              <div className="serviceCardSpecs">
                {car.specs.map((spec, i) => (
                  <span className="serviceSpecBadge" key={i}>{spec}</span>
                ))}
              </div>
              <div className="serviceCardPriceBlock">
                <div className="serviceCardPrice">{car.price} <small>/day</small></div>
                <button className="serviceCardBtn" onClick={() => handleRent(car.name)}>
                  Rent Car
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarRentalsService;
