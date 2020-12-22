import React from "react"
import { Box, styled, Button, colors } from "@material-ui/core"
import AuditTrail from "./AuditTrail.js"
import UniversalSampleEditor from "../UniversalSampleEditor"

export const ReviewSampleContent = () => {
  return (
    <Box display="flex">
      <Box flexGrow={1}>
        <Box display="flex" padding={1} paddingBottom={2}>
          <Button variant="outlined">Back</Button>
          <Box flexGrow={1} />
          <Button
            variant="outlined"
            style={{ color: colors.red[600], borderColor: colors.red[300] }}
          >
            Reject
          </Button>
          <Button
            variant="outlined"
            style={{
              marginLeft: 8,
              color: colors.green[800],
              borderColor: colors.green[600],
            }}
          >
            Approve
          </Button>
          <Button style={{ marginLeft: 8 }} variant="outlined">
            Next
          </Button>
        </Box>
        <UniversalSampleEditor
          sampleIndex={3}
          sample={{
            imageUrl:
              "https://s3.amazonaws.com/datasets.workaround.online/satimag.jpeg",
          }}
          interface={{
            type: "image_segmentation",
          }}
        />
      </Box>
      <Box width={320} flexShrink={0} paddingLeft={1}>
        <Box color={colors.grey[700]} padding={1}>
          History
        </Box>
        <AuditTrail />
        <Box padding={1} textAlign="right">
          <Button color="primary" variant="outlined">
            Submit Correction
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ReviewSampleContent
