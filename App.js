import React from "react";
import Theme from "./components/Theme";
import LocalStorageApp from "./components/LocalStorageApp";

function App() {
  return React.createElement(Theme, null, React.createElement(LocalStorageApp, null));
}

export default App;