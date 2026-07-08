import "./searchItem.css";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const SearchItem = ({
  id,
  name,
  distance,
  tag,
  type,
  description,
  free_cancel,
  price,
  rate,
  img_url,
}) => {
  const { lang, t } = useLanguage();

  const getRatingText = (ratingScore) => {
    const num = Number(ratingScore);
    if (num >= 9) return t("exceptional");
    if (num >= 8) return t("excellent");
    return lang === "vi" ? "Tốt" : "Good";
  };

  const reviewCount = Math.floor((id ? id.charCodeAt(id.length - 1) : 5) * 12 + 15);

  return (
    <div className="searchItem">
      <img src={img_url} alt="" className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">
          <Link to={`/hotels/${id}`}>{name}</Link>
        </h1>
        <span className="siDistance">
          {distance} {lang === "vi" ? "từ trung tâm" : "from center"}
        </span>
        {tag && <span className="siTaxiOp">{tag}</span>}
        <span className="siSubtitle">{description}</span>
        <span className="siFeatures">{type}</span>
        
        {free_cancel && (
          <div className="siCancelOpContainer">
            <span className="siCancelOp">
              {lang === "vi" ? "Miễn phí hủy phòng" : "Free cancellation"}
            </span>
            <span className="siCancelOpSubtitle">
              {t("freeCancelSubtitle")}
            </span>
          </div>
        )}
      </div>
      <div className="siDetails">
        <div className="siRating">
          <div className="siRatingTexts">
            <span className="siRatingText">{getRatingText(rate)}</span>
            <span className="siReviewCount">
              {reviewCount} {t("reviewsCount")}
            </span>
          </div>
          <div className="siRatingScore">{rate}</div>
        </div>
        <div className="siDetailTexts">
          <span className="siPrice">${price}</span>
          <span className="siTaxOp">{t("taxesAndFees")}</span>
          <Link to={`/hotels/${id}`} className="siCheckButton">
            {t("seeAvailability")} &gt;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
