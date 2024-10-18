import React from "react";
import "../../assets/scss/custom/components/_splashscreen.scss";
import LanguageSelection from "../../components/LanguageDropdown/LanguageSelection";

export const SplashScreen = (): JSX.Element => {

  return (
    <>
    <div className="splash-screen">
      <div className="frame-parent">
        <div className="symbol-parent">
          <img
            className="symbol-icon"
            loading="eager"
            alt=""
            src="/symbol@2x.png"
          />
          <h1 className="Alcohol-booking-app-container">
            <span className="hassle-free">Joud</span>
            <span className="Alcohol">ma</span>
          </h1>
        </div>
        <h1 className="enjoy-your-hassle-free-container">
          <span>{`Enjoy your `}</span>
          <span className="hassle-free">hassle-free</span>
          <span> journey.</span>
        </h1>
      </div>
      <section className="page-frame-wrapper">
        <div className="page-frame">
          <img
            className="page-1-icon"
            loading="eager"
            alt=""
            src="/page-1@2x.png"
          />
        </div>
      </section>
      <LanguageSelection />
    </div>
    </>
  );
};
