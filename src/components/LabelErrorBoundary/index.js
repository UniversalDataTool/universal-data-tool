// @flow weak

import React from "react"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import { detect } from "detect-browser"
import Button from "@material-ui/core/Button"
import Sentry from "../../utils/sentry.js"
import BadOHA from "../BadOHA"

const Container = styled("div")({
  width: "100vw",
  minHeight: "100vh",
  backgroundColor: colors.grey[900],
  padding: 32,
  "& .title": {
    color: colors.grey[200],
    fontSize: 24,
    fontWeight: "bold",
  },
  "& .subtitle": {
    color: colors.grey[300],
    fontSize: 18,
    marginTop: 8,
  },
  "& .info": {
    width: "100%",
    boxSizing: "border-box",
    padding: 32,
    "& textarea": {
      width: "calc(100% - 64px)",
      boxSizing: "border-box",
      minHeight: 300,
      fontSize: 12,
    },
  },
})
const Buttons = styled("div")({
  padding: 8,
})
const StyledButton = styled(Button)({
  color: "#fff",
  borderColor: "rgba(255,255,255,0.5)",
  margin: 8,
})

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.error(
      "The following error occurred when loading a labeling interface:",
      error
    )
    return {
      hasError: true,
      errorString: error.toString(),
    }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo)
      const eventId = Sentry.captureException(error)
      this.setState({ eventId })
    })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <BadOHA
          title="An error occurred loading the labeling interface"
          description={this.state.errorString}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
