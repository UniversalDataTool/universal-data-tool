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
    name: "Complete",
  },
]

export const Review = () => {
  const [selectedItem, setSelectedItem] = useState("All Samples")
  return (
    <SimpleSidebar
      sidebarItems={sidebarItems}
      onSelectItem={setSelectedItem}
      selectedItem={selectedItem}
    >
      {!selectedItem.startsWith("Sample ") && (
        <ReviewSamplesTable
          selectedItem={selectedItem}
          onClickSample={(sampleIndex) => {
            setSelectedItem(`Sample ${sampleIndex}`)
          }}
        />
      )}
      {selectedItem.startsWith("Sample ") && <ReviewSampleContent />}
    </SimpleSidebar>
  )
}

export default Review
