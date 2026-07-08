import "./mailList.css"
import { useLanguage } from "../../context/LanguageContext";

const MailList = () => {
  const { t } = useLanguage();

  return (
    <div className="mail">
      <h1 className="mailTitle">{t("mailTitle")}</h1>
      <span className="mailDesc">{t("mailDesc")}</span>
      <div className="mailInputContainer">
        <input type="text" placeholder={t("mailPlaceholder")} />
        <button>{t("subscribeBtn")}</button>
      </div>
    </div>
  )
}

export default MailList