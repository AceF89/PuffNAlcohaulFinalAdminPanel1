import { FunctionComponent } from "react";
import "../../assets/scss/custom/components/_languageselection.scss";
import { useNavigate } from "react-router-dom";

const LanguageSelection: FunctionComponent = () => {
  const nevigate  = useNavigate()

  const handleLanguageSelect = ()=>{
    nevigate('/auth/login')
  }
  return (
    <section className="language-selection">
      <div className="input-field-container">
        <div className="choose-language">Choose Language</div>
        <div className="textfield-language">
          {/* <div className="english">English</div> */}

          {/* <img
            className="chevron-down-large"
            alt=""
            src="/chevron-down-large.svg"
          /> */}
            <select className="english">
            <option>English</option>
            <option>Arabic</option>
          </select>
        </div>
      </div>
      <footer role="presentation" onClick={handleLanguageSelect} className="button-2">
        <div  className="get-started">Get Started</div>
        <img
          className="arrow-right-icon"
          loading="eager"
          alt=""
          src="/arrow-right.svg"
        />
      </footer>
    </section>
  );
};

export default LanguageSelection;
