// @flow weak

import React from "react"
import Sentry from "../../utils/sentry.js"
import BadDataset from "../BadDataset"

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
        <BadDataset
          title="An error occurred loading the labeling interface"
          description={this.state.errorString}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
