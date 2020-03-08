// @flow weak

import React, { memo, useCallback, useReducer, useEffect } from "react"
import useEventCallback from "use-event-callback"
import { useLocalStorage } from "react-use"
import { styled } from "@material-ui/core/styles"
import range from "lodash/range"
import * as colors from "@material-ui/core/colors"
import classNames from "classnames"
import TablePagination from "@material-ui/core/TablePagination"

const Container = styled("div")({
  flexWrap: "wrap"
})
const SampleDiv = styled("div")({
  margin: 4,
  padding: 4,
  backgroundColor: colors.grey[300],
  display: "inline-flex",
  fontSize: 11,
  textAlign: "center",
  justifyContent: "center",
  minWidth: "3em",
  borderRadius: 3,
  cursor: "pointer",
  userSelect: "none",
  transition: "box-shadow 200ms ease, transform 200ms ease",
  "&.completed": {
    backgroundColor: colors.blue[500],
    color: "#fff"
  },
  "&.selected": {
    boxShadow: `0px 0px 2px 1px ${colors.blue[400]}`,
    transform: "scale(1.05,1.05)"
  }
})

const Sample = memo(
  ({
    index,
    onClick,
    completed,
    selected,
    onMouseDown,
    onMouseUp,
    onMouseEnter
  }) => {
    return (
      <SampleDiv
        className={classNames({ completed, selected })}
        onClick={() => onClick(index)}
        onMouseDown={() => onMouseDown(index)}
        onMouseUp={() => onMouseUp(index)}
        onMouseEnter={() => onMouseEnter(index)}
      >
        {index}
      </SampleDiv>
    )
  },
  function(p, n) {
    return (
      p.index === n.index &&
      p.completed === n.completed &&
      p.selected === n.selected
    )
  }
)

export default ({ count, completed = [], onClick }) => {
  const [samplesPerPage, changeSamplesPerPage] = useLocalStorage(
    "samplesPerPage",
    100
  )
  const [sampleOffset, changeSampleOffset] = useLocalStorage("sampleOffset", 0)

  useEffect(() => {
    if (sampleOffset > count) {
      changeSampleOffset(0)
    }
  }, [])

  const [selectRange, changeSelectRange] = useReducer((state, newValue) => {
    if (newValue === null) return null
    if (typeof newValue === "number") {
      if (!state) return null
      return [Math.min(newValue, state[0]), Math.max(newValue + 1, state[1])]
    }
    return newValue
  }, null)

  const startSelectRange = useCallback(
    index => changeSelectRange([index, index + 1]),
    [changeSelectRange]
  )
  const moveSelectRange = useCallback(index => changeSelectRange(index), [
    changeSelectRange
  ])
  const endSelectRange = useCallback(() => {}, [changeSelectRange])
  const checkAndNullifySelectRange = useCallback(
    e => {
      if (e.buttons !== 1) {
        changeSelectRange(null)
      }
    },
    [changeSelectRange]
  )
  const onClickMemo = useEventCallback(onClick)

  return (
    <Container
      onMouseUp={checkAndNullifySelectRange}
      onMouseEnter={checkAndNullifySelectRange}
    >
      {range(sampleOffset, Math.min(count, sampleOffset + samplesPerPage)).map(
        i => (
          <Sample
            onClick={onClickMemo}
            key={i}
            index={i}
            completed={completed[i]}
            selected={selectRange && i >= selectRange[0] && i < selectRange[1]}
            onMouseDown={startSelectRange}
            onMouseEnter={moveSelectRange}
            onMouseUp={endSelectRange}
          />
        )
      )}
      <TablePagination
        rowsPerPageOptions={[100, 250, 500, 1000, 2000, 10000]}
        component="div"
        count={count}
        rowsPerPage={samplesPerPage}
        page={Math.floor(sampleOffset / samplesPerPage)}
        labelRowsPerPage="Samples per Page:"
        onChangePage={(e, newPage) =>
          changeSampleOffset(newPage * samplesPerPage)
        }
        onChangeRowsPerPage={e => changeSamplesPerPage(+e.target.value)}
      />
    </Container>
  )
}
