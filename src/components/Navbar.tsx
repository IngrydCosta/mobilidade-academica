import { IoSchoolOutline } from "react-icons/io5";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoLanguageOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";



function Navbar() {

  const { t, i18n } = useTranslation();

  function changeLanguage() {
    i18n.changeLanguage(
      i18n.language === "pt" ? "en" : "pt"
    );
  }


  return (
    <nav className="flex flex-row w-full min-h-[5rem] items-center gap-4 bg-[#173764] text-[#d4d3ce] justify-between px-4 md:px-10 py-3 shadow-md">
      <div className="flex flex-row items-center gap-3">
        <div className="bg-[#E1B56F] rounded-md p-3 shrink-0">
          <IoSchoolOutline className="text-[#0E284E] h-7 w-7 md:h-8 md:w-8" />
        </div>
        <div>
          <p className="font-medium text-xl md:text-2xl leading-tight">
            <span>{t("headerTitle")}</span>
          </p>
          <p className="font-light text-xs md:text-sm text-gray-300">
            <span>{t("headerSubtitle")}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-3 items-center">
        <div>
          <button
            onClick={changeLanguage}
            className="bg-[#FAFCFD] hover:bg-gray-100 cursor-pointer rounded-md px-4 py-2 flex flex-row items-center gap-2 transition-colors text-sm font-medium"
          >
            <IoLanguageOutline className="text-[#404c4e]" />
            <span className="text-[#000000]">PT/EN</span>
          </button>
        </div>
        <div>
          <Link
            to="/login"
            className="bg-[#E1B56F] hover:bg-[#d4a259] rounded-md px-5 py-2 cursor-pointer text-[#0E284E] font-medium flex items-center gap-2 transition-colors text-sm"
          >
            <span>{t("login")}</span>
            <IoIosArrowRoundForward className="text-[#0E284E] h-5 w-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;