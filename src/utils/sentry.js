import * as Sentry from "@sentry/browser"

Sentry.init({
  dsn: "https://bc19fbac222243f08f0abaf6d66f2034@sentry.io/5182632",
  whitelistUrls: ["https://universaldatatool.com", "^file:?:"],
})

export default Sentry
