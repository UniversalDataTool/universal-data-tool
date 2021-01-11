import React from "react"
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
  CircularProgress,
} from "@material-ui/core"
import Title from "./Title"
import CheckIcon from "@material-ui/icons/Check"
import SearchIcon from "@material-ui/icons/Search"
import moment from "moment"
import { useSampleSearch } from "udt-review-hooks"

export const ReviewSamplesTable = ({ selectedItem, onClickSample }) => {
  const searchOptions = React.useMemo(
    () => ({
      limit: 1000,
      filter:
        selectedItem === "Needs Review"
          ? "needs-review"
          : selectedItem === "Reviewed"
          ? "reviewed"
          : "",
    }),
    [selectedItem]
  )
  const { samples } = useSampleSearch(searchOptions)
  const [searchText, setSearchText] = React.useState("")

  return (
    <>
      <Title>Samples</Title>
      <Box display="flex" padding={2}>
        <TextField
          fullWidth
          disabled
          placeholder="Not Working Yet"
          variant="outlined"
          label="Search by sample number or labeler"
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: colors.grey[500] }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>SI</TableCell>
            <TableCell align="center">Consensus</TableCell>
            <TableCell align="center">Confidence</TableCell>
            <TableCell align="center">Reviewed</TableCell>
            <TableCell>Last Activity</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {samples &&
            samples
              .filter((s) =>
                selectedItem === "Needs Review"
                  ? !s.is_reviewed
                  : selectedItem === "Complete"
                  ? s.number_of_works >= s.number_of_times_to_be_labeled
                  : true
              )
              .map((s, i) => (
                <TableRow key={i}>
                  <TableCell>{s.sample_index}</TableCell>
                  <TableCell align="center">
                    {s.number_of_works} / {s.number_of_times_to_be_labeled}
                  </TableCell>
                  <TableCell align="center">
                    {s.confidence.toFixed(1)}%
                  </TableCell>
                  <TableCell align="center">
                    {s.is_reviewed ? <CheckIcon /> : null}
                  </TableCell>
                  <TableCell>
                    {!s.last_activity ? "" : moment(s.last_activity).fromNow()}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => onClickSample(s)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      {!samples && (
        <Box textAlign="center" pt="32px">
          <CircularProgress size={50} color="primary" />
        </Box>
      )}
    </>
  )
}

export default ReviewSamplesTable
