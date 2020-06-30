import React from "react"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"

import { useTranslation } from "react-i18next"

const ExplanationTextHeader = styled("div")({
  textAlign: "center",
  paddingTop: 30,
  paddingBottom: 50,
  userSelect: "none",
})

const ExplanationText = styled("h3")({
  fontWeight: "bold",
  color: colors.grey[500],
})

const GithubLink = styled("a")({
  color: colors.blue[500],
})

const Configure3D = () => {
  const { t } = useTranslation()

  return (
    <ExplanationTextHeader>
      <ExplanationText>
        {t("configure-3d-explanation-text-part-1")}{" "}
        <GithubLink
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/UniversalDataTool/universal-data-tool/issues/20"
        >
          this
        </GithubLink>{" "}
        {t("github-issue")}.
      </ExplanationText>
    </ExplanationTextHeader>
  )
}

export default Configure3D
