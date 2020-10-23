import { useEffect } from "react"
import useActiveDatasetManager from "../use-active-dataset-manager"
import CollaborativeDatasetManager from "udt-dataset-managers/dist/CollaborationServerDatasetManager"
import useAppConfig from "../use-app-config"
import qs from "qs"

export default () => {
  const { fromConfig } = useAppConfig()
  const [dm, setActiveDatasetManager] = useActiveDatasetManager()
  useEffect(() => {
    if (dm) return
    const queryParams = qs.parse(window.location.search.substr(1))
    async function goIntoCollaborativeSession(sessionId) {
      const dm = new CollaborativeDatasetManager({
        serverUrl: fromConfig("collaborationServer.url"),
      })
      await dm.loadSession(sessionId)
      setActiveDatasetManager(dm)
    }
    if (queryParams.s) {
      goIntoCollaborativeSession(queryParams.s)
    }
    // Only run on first call (or when the dataset manager can be sent)
    // eslint-disable-next-line
  }, [setActiveDatasetManager])
}
