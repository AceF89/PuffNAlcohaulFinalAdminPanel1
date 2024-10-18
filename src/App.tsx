import React from "react";

import AllRoutes from "./routes/Routes";
import { SnackbarProvider } from "notistack";
// import { configureFakeBackend } from "./helpers";

// Themes
// For Default import Theme.scss
import "./assets/scss/Theme.scss";

// For Dark import Theme-Dark.scss
// import './assets/scss/Theme-Dark.scss';

// configure fake backend
// configureFakeBackend();

const App = () => {
  return (
    <>
    <React.Fragment>
    <SnackbarProvider>
    <AllRoutes />
    </SnackbarProvider>
    </React.Fragment>
  </>
  );
};

export default App;
