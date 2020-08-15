import React from "react";
import ReactDOM from "react-dom";
import "@reach/slider/styles.css";
import "./index.css";
import ReactGA from "react-ga";

const render = () => {
  const App = require("./App").default;

  ReactGA.initialize("UA-175428550-1");
  ReactGA.pageview(window.location.pathname + window.location.search);

  ReactDOM.render(<App />, document.getElementById("root"));
};

render();

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./App", render);
}
