import React, { createContext, useMemo, useState } from "react"

import { useAppConfig } from "../AppConfig"
export const LabelHelpContext = createContext({})

export const LabelHelpProvider = ({ children }) => {
  const { fromConfig, setInConfig } = useAppConfig()
  const [loadingPricingConfig, setLoadingPricingConfig] = useState(false)
  const [pricingConfig, setPricingConfig] = useState(false)
  const [loadingMyTeam, setLoadingMyTeam] = useState(false)
  const [myCredits, setMyCredits] = useState(null)
  const contextValue = useMemo(
    () => ({
      pricingConfig,
      myCredits,
      loadPricingConfig: async () => {
        if (loadingPricingConfig) return
        setLoadingPricingConfig(true)
        const pricingConfig = await fetch(
          "https://labelhelp.universaldatatool.com/api/price"
        ).then((r) => r.json())
        setLoadingPricingConfig(false)
        setPricingConfig(pricingConfig)
      },
      loadMyCredits: async () => {
        if (loadingMyTeam) return
        setLoadingMyTeam(true)
        const apiKey = fromConfig("labelhelp.apikey")
        if (!apiKey) return
        let response
        try {
          response = await fetch(
            `https://labelhelp.universaldatatool.com/api/me`,
            {
              headers: { apikey: apiKey },
            }
          )
          response = await response.json()
        } catch (e) {
          console.error(e)
          setLoadingMyTeam(false)
          return Promise.reject(e)
        }
        if (response.status >= 400) {
          setInConfig("labelhelp.apikey", null)
        }

        setMyCredits(response.credit)
        setLoadingMyTeam(false)
      },
    }),
    [
      pricingConfig,
      loadingPricingConfig,
      // eslint-disable-next-line
      fromConfig("labelhelp.apikey"),
      loadingMyTeam,
      myCredits,
      fromConfig,
      setInConfig,
    ]
  )
  return (
    <LabelHelpContext.Provider value={contextValue}>
      {children}
    </LabelHelpContext.Provider>
  )
}
