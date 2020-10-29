import React from "react"
import { configure, addDecorator } from "@storybook/react"
import Theme from "../src/components/Theme"
import { RecoilRoot } from "recoil"
import "../src/App.css"
import "./storybook.css"
import "../src/i18n"

export const themeDecorator = (storyFn) => {
  // TODO wrap w/ theme
  return React.createElement(
    Theme,
    {},
    React.createElement(
      "div",
      {
        className: "universaldatatool",
        style: { height: "100vh" },
      },
      storyFn()
    )
  )
}

export const recoilDecorator = (storyFn) => {
  return React.createElement(RecoilRoot, {}, storyFn())
}

function loadStories() {
  addDecorator(themeDecorator)
  addDecorator(recoilDecorator)
  const importAll = (r) => r.keys().map(r)
  importAll(require.context("../src/components", true, /\.story\.js$/))
  importAll(require.context("../src/vanilla", true, /\.story\.js$/))
}

configure(loadStories, module)
