import React from "react"
import { styled } from "@material-ui/core/styles"
import MuiButton from "@material-ui/core/Button"
import * as colors from "@material-ui/core/colors"
import usePosthog from "../../hooks/use-posthog"
import useIsDesktop from "../../hooks/use-is-desktop"
import { useTranslation } from "react-i18next"
import classnames from "classnames"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"

import { SelectDialogContext } from "./"

const ButtonBase = styled(MuiButton)({
  width: 240,
  height: 140,
  display: "inline-flex",
  flexDirection: "column",
  "&.disabled": {
    backgroundColor: colors.grey[200],
  },
  margin: 8,
  "& .icon": {
    width: 36,
    height: 36,
    color: colors.grey[600],
    "&.disabled": {
      color: colors.grey[400],
    },
  },
})

const DesktopOnlyText = styled("div")({
  fontSize: 11,
  fontWeight: "bold",
  color: colors.grey[600],
  "&.disabled": {
    color: colors.grey[500],
  },
})

export const Button = ({
  Icon1,
  Icon2,
  desktopOnly,
  children,
  dialog,
  disabled,
  onClick,
}) => {
  const isDesktop = useIsDesktop()
  const posthog = usePosthog()
  const { t } = useTranslation()

  disabled =
    disabled === undefined ? (desktopOnly ? !isDesktop : false) : disabled
  return (
    <SelectDialogContext.Consumer>
      {({ onChangeDialog }) => {
        return (
          <ButtonBase
            onClick={() => {
              posthog.capture("transform_button_clicked", {
                transform_button: dialog || children,
              })
              if (onClick) return onClick()
              onChangeDialog(dialog)
            }}
            className={classnames({ disabled })}
            variant="outlined"
            disabled={disabled}
          >
            <div>
              {Icon1 && Icon2 ? (
                <>
                  <Icon1 className={classnames("icon", { disabled })} />
                  <ArrowForwardIcon
                    className={classnames("icon", { disabled })}
                  />
                  <Icon2 className={classnames("icon", { disabled })} />
                </>
              ) : (
                <Icon1 className={classnames("icon", { disabled })} />
              )}
              <div>{children}</div>
              {desktopOnly && (
                <DesktopOnlyText className={classnames({ disabled })}>
                  {t("desktop-only").toUpperCase()}
                </DesktopOnlyText>
              )}
            </div>
          </ButtonBase>
        )
      }}
    </SelectDialogContext.Consumer>
  )
}

export default Button
