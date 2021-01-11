import React, { useState } from "react"
import Title from "./Title"
import SimpleSidebar from "./SimpleSidebar"
import {
  TextField,
  InputAdornment,
  colors,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Button,
} from "@material-ui/core"
import CheckIcon from "@material-ui/icons/Check"
import SearchIcon from "@material-ui/icons/Search"
import moment from "moment"
import ReviewSamplesTable from "./ReviewSamplesTable"
import ReviewSampleContent from "./ReviewSampleContent"

const sidebarItems = [
  {
    name: "All Samples",
  },
  {
    name: "Needs Review",
  },
  {
    name: "Reviewed",
  },
]

export const Review = () => {
  const [selectedItem, setSelectedItem] = useState("All Samples")
  const [selectedSampleId, setSelectedSampleId] = useState(null)
  return (
    <SimpleSidebar
      sidebarItems={sidebarItems.concat(
        [
          selectedItem.includes("Sample ") && {
            name: selectedItem,
          },
        ].filter(Boolean)
      )}
      onSelectItem={setSelectedItem}
      selectedItem={selectedItem}
    >
      {!selectedItem.startsWith("Sample ") && (
        <ReviewSamplesTable
          selectedItem={selectedItem}
          onClickSample={(sample) => {
            setSelectedItem(`Sample ${sample.sample_index}`)
            setSelectedSampleId(sample.sample_id)
          }}
        />
      )}
      {selectedItem.startsWith("Sample ") && (
        <ReviewSampleContent sampleId={selectedSampleId} />
      )}
    </SimpleSidebar>
  )
}

export default Review
