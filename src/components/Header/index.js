// @flow weak

import React, { useState, createContext, useContext, useCallback } from "react"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import LoginDrawer from "../LoginDrawer"
import CollaborativeDatasetManager from "udt-dataset-managers/dist/CollaborationServerDatasetManager"
import useEventCallback from "use-event-callback"

import HeaderToolbar from "../HeaderToolbar"
import HeaderDrawer from "../HeaderDrawer"

import useOpenTemplate from "../../hooks/use-open-template"
import useActiveDatasetManager from "../../hooks/use-active-dataset-manager"

export const HeaderContext = createContext({
  recentItems: [],
  changeRecentItems: () => null,
  onClickTemplate: () => null,
  onClickHome: () => null,
  onOpenFile: () => null,
  onOpenRecentItem: () => null,
  isDesktop: false,
  onLeaveSession: () => null,
  sessionBoxOpen: false,
  changeSessionBoxOpen: () => null,
  fileOpen: false,
  onDownload: () => null,
  authConfig: null,
  onUserChange: () => null,
  user: null,
  logoutUser: () => null,
})

const emptyArray = []

export default ({
  additionalButtons = emptyArray,
  title,
  currentTab,
  onChangeTab,
  tabs = emptyArray,
}) => {
  const [drawerOpen, changeDrawerOpen] = useState(false)
  const [loginDrawerOpen, changeLoginDrawerOpen] = useState(false)
  let headerContext = useContext(HeaderContext)
  const openTemplate = useOpenTemplate()
  if (!headerContext.recentItems) headerContext.recentItems = []

  const isSmall = useMediaQuery("(max-width: 800px)")

  const onOpenDrawer = useCallback(() => changeDrawerOpen(true), [])
  const onCloseDrawer = useCallback(() => changeDrawerOpen(false), [])
  const [dm, setActiveDatasetManager] = useActiveDatasetManager()
  const onCreateSession = useEventCallback(async () => {
    const previousUDTJSON = dm
      ? await dm.getDataset()
      : { interface: {}, samples: [] }
    const newDM = new CollaborativeDatasetManager()
    try {
      await newDM.setDataset(previousUDTJSON)
    } catch (e) {
      console.log(`Couldn't create collaborative session: ${e.toString()}`)
    }
    setActiveDatasetManager(newDM)
  })

  return (
    <>
      <HeaderToolbar
        key="headerToolbar"
        tabs={tabs}
        currentTab={currentTab}
        onChangeTab={onChangeTab}
        additionalButtons={additionalButtons}
        onOpenDrawer={onOpenDrawer}
        isSmall={isSmall}
        {...headerContext}
        inSession={dm && dm.type === "collaborative-session"}
        onCreateSession={onCreateSession}
        changeLoginDrawerOpen={changeLoginDrawerOpen}
        title={title}
      />
      <HeaderDrawer
        key="headerDrawer"
        drawerOpen={drawerOpen}
        onCloseDrawer={onCloseDrawer}
        onClickHome={headerContext.onClickHome}
        onClickManagePlugins={headerContext.onClickManagePlugins}
        recentItems={headerContext.recentItems}
        changeRecentItems={headerContext.changeRecentItems}
        onOpenFile={headerContext.onOpenFile}
        onClickTemplate={openTemplate}
        onOpenRecentItem={headerContext.onOpenRecentItem}
      />
      <LoginDrawer
        key="loginDrawer"
        authConfig={headerContext.authConfig}
        loginDrawerOpen={loginDrawerOpen}
        onClose={() => changeLoginDrawerOpen(false)}
        onUserChange={headerContext.onUserChange}
        logoutUser={headerContext.logoutUser}
      />
    </>
  )
}
