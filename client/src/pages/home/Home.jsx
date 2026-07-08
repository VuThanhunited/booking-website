import React, { useState, useEffect } from "react";
import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import { useLanguage } from "../../context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faThumbsUp,
  faGlobe,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

// Import custom services
import FlightsService from "../../components/services/FlightsService";
import FlightHotelService from "../../components/services/FlightHotelService";
import CarRentalsService from "../../components/services/CarRentalsService";
import AttractionsService from "../../components/services/AttractionsService";
import TaxisService from "../../components/services/TaxisService";
import "./home.css";

const Home = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.initialTab || "stays");

  useEffect(() => {
    if (location.state?.initialTab) {
      setActiveTab(location.state.initialTab);
    }
  }, [location.state]);

  return (
    <div>
      <Navbar />
      <Header type="home" activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="homeContainer">
        {activeTab === "stays" ? (
          <>
            <div className="featuresSection">
              <h2 className="featuresTitle">{t("whyBookingTitle")}</h2>
              <div className="featuresContainer">
                <div className="featureItem">
                  <FontAwesomeIcon icon={faCalendarCheck} className="featureIcon icon-date" />
                  <div className="featureText">
                    <h4>{t("feature1Title")}</h4>
                    <p>{t("feature1Desc")}</p>
                  </div>
                </div>
                <div className="featureItem">
                  <FontAwesomeIcon icon={faThumbsUp} className="featureIcon icon-thumbs" />
                  <div className="featureText">
                    <h4>{t("feature2Title")}</h4>
                    <p>{t("feature2Desc")}</p>
                  </div>
                </div>
                <div className="featureItem">
                  <FontAwesomeIcon icon={faGlobe} className="featureIcon icon-globe" />
                  <div className="featureText">
                    <h4>{t("feature3Title")}</h4>
                    <p>{t("feature3Desc")}</p>
                  </div>
                </div>
                <div className="featureItem">
                  <FontAwesomeIcon icon={faHeadset} className="featureIcon icon-support" />
                  <div className="featureText">
                    <h4>{t("feature4Title")}</h4>
                    <p>{t("feature4Desc")}</p>
                  </div>
                </div>
              </div>
            </div>

            <Featured/>
            <h1 className="homeTitle">{t("browseType")}</h1>
            <PropertyList/>
            <h1 className="homeTitle">{t("homesLove")}</h1>
            <FeaturedProperties/>
          </>
        ) : activeTab === "flights" ? (
          <FlightsService />
        ) : activeTab === "flightHotel" ? (
          <FlightHotelService />
        ) : activeTab === "carRentals" ? (
          <CarRentalsService />
        ) : activeTab === "attractions" ? (
          <AttractionsService />
        ) : (
          <TaxisService />
        )}
        <MailList />
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
