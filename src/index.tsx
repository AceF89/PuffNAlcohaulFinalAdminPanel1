import React from "react";
import ReactDOM from "react-dom/client";

import "./i18n";
import './assets/scss/config/_global.scss';
import "react-datepicker/dist/react-datepicker.css";

import App from "./App";

import { Provider } from "react-redux";
import { configureStore } from "./redux/store";
import { HashRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <Provider store={configureStore({})}>
    <React.Fragment>
      <Router basename={process.env.PUBLIC_URL}>
        <App />
      </Router>
    </React.Fragment>
  </Provider>
);
