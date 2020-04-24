// @flow weak

import React, { memo, useCallback, useReducer, useEffect } from "react"
import useEventCallback from "use-event-callback"
import { useLocalStorage } from "react-use"
import { styled } from "@material-ui/core/styles"
import range from "lodash/range"
import * as colors from "@material-ui/core/colors"
import classNames from "classnames"
import TablePagination from "@material-ui/core/TablePagination"
import getBrushColorPalette from "../../utils/get-brush-color-palette"

const Container = styled("div")({
  flexWrap: "wrap",
})
const EmptyState = styled("div")({
  fontSize: 24,
  color: colors.grey[500],
  padding: 30,
  textAlign: "center",
})
const SampleDiv = styled("div")(({ color }) => ({
  margin: 4,
  padding: 4,
  backgroundColor: color[500],
  display: "inline-flex",
  fontSize: 11,
  textAlign: "center",
  justifyContent: "center",
  minWidth: "3em",
  borderRadius: 3,
  cursor: "pointer",
  userSelect: "none",
  transition: "box-shadow 200ms ease, transform 200ms ease",
  color: color.isFaded ? "#000" : "#fff",
  "&.selected": {
    boxShadow: `0px 0px 2px 1px ${color["A200"]}`,
    transform: "scale(1.05,1.05)",
  },
}))

const Sample = memo(
  ({
    index,
    onClick,
    completed,
    selected,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    brush,
  }) => {
    return (
      <SampleDiv
        className={classNames({ completed, selected })}
        onClick={() => onClick(index)}
        onMouseDown={() => onMouseDown(index)}
        onMouseUp={() => onMouseUp(index)}
        onMouseEnter={() => onMouseEnter(index)}
        color={getBrushColorPalette(brush)}
      >
        {index}
      </SampleDiv>
    )
  },
  function (p, n) {
    return (
      p.index === n.index &&
      p.completed === n.completed &&
      p.selected === n.selected &&
      p.brush === n.brush
    )
  }
)

export default ({ count, completed = [], taskData, onClick }) => {
  const [samplesPerPage, changeSamplesPerPage] = useLocalStorage(
    "samplesPerPage",
    100
  )
  const [sampleOffset, changeSampleOffset] = useLocalStorage("sampleOffset", 0)

  useEffect(() => {
    if (sampleOffset > count) {
      changeSampleOffset(0)
    }
  }, [changeSampleOffset,sampleOffset,count])

  const [selectRange, changeSelectRange] = useReducer((state, newValue) => {
    if (newValue === null) return null
    if (typeof newValue === "number") {
      if (!state) return null
      return [Math.min(newValue, state[0]), Math.max(newValue + 1, state[1])]
    }
    return newValue
  }, null)

  const startSelectRange = useCallback(
    (index) => changeSelectRange([index, index + 1]),
    [changeSelectRange]
  )
  const moveSelectRange = useCallback((index) => changeSelectRange(index), [
    changeSelectRange,
  ])
  const checkAndNullifySelectRange = useCallback(
    (e) => {
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
      {count === 0 && (
        <EmptyState>
          No samples, try using "Import Toy Dataset" in Samples > Import
        </EmptyState>
      )}
      {range(sampleOffset, Math.min(count, sampleOffset + samplesPerPage)).map(
        (i) => (
          <Sample
            onClick={onClickMemo}
            key={i}
            index={i}
            completed={completed[i]}
            brush={
              completed[i] ? taskData[i].brush || "complete" : "incomplete"
            }
            selected={selectRange && i >= selectRange[0] && i < selectRange[1]}
            onMouseDown={startSelectRange}
            onMouseEnter={moveSelectRange}
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
        onChangeRowsPerPage={(e) => changeSamplesPerPage(+e.target.value)}
      />
    </Container>
  )
}
