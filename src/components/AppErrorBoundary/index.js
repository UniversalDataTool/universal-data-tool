// @flow weak

import React from "react"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import { detect } from "detect-browser"
import Button from "@material-ui/core/Button"
import LaunchIcon from "@material-ui/icons/Launch"
import Sentry from "../../utils/sentry.js"

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
    return {
      hasError: true,
      errorDetails: JSON.stringify(detect()) + "\n\n" + error.stack,
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
        <Container>
          <div className="title">An error has occurred</div>
          <div className="subtitle">All the details are below:</div>
          <div className="info">
            <textarea>{this.state.errorDetails}</textarea>
          </div>
          <Buttons>
            <StyledButton
              variant="outlined"
              target="_blank"
              href="https://github.com/Universal/universal-data-tool/issues"
            >
              <LaunchIcon style={{ color: "#fff", marginRight: 8 }} /> View
              Issues on Github
            </StyledButton>
            {/* <StyledButton
              variant="outlined"
              onClick={this.props.revertLastChange}
            >
              Revert Last File Change
            </StyledButton> */}
            <StyledButton
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Reload (unsaved progress will be lost)
            </StyledButton>
          </Buttons>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
