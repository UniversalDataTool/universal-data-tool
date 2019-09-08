import React from "react";
import BadOHA from "../BadOHA";
export default (function () {
  return React.createElement(BadOHA, {
    title: "No Samples to Show"
  }, "Make sure that ", React.createElement("code", null, "taskData"), " is defined and not empty.", React.createElement("br", null), React.createElement("br", null), "Need help setting up? ", React.createElement("a", {
    href: "#"
  }, "Check out this tutorial."));
});