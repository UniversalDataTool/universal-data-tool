import React, { useEffect, useState } from "react"
import SimpleDialog from "../SimpleDialog"
import { setIn } from "seamless-immutable"

export default ({
  open,
  onChangeDataset,
  onClose,
  dataset,
  name,
  renderDialog,
}) => {
  const [ref, setRef] = useState()
  const [actions, setActions] = useState([])
  useEffect(() => {
    if (!open) return
    if (!ref) return

    let actions = []

    renderDialog({
      elm: ref,
      onSuccess: () => {
        onClose()
      },
      addAction: (action) => {
        actions.push(action)
        setActions(actions)
      },
      removeAction: (action) => {
        actions = actions.filter((a) => a !== action)
        setActions(actions)
      },
      dataset,
      setInDataset: (path, val) => {
        onChangeDataset(setIn(dataset, path, val))
      },
    })
    //eslint-disable-next-line
  }, [open, ref])

  return (
    <SimpleDialog title={name} open={open} onClose={onClose} actions={actions}>
      <div ref={(newRef) => setRef(newRef)} />
    </SimpleDialog>
  )
}
