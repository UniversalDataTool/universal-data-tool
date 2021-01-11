import React from "react"
import {
  CircularProgress,
  Box,
  styled,
  Button,
  colors,
} from "@material-ui/core"
import AuditTrail from "./AuditTrail.js"
import UniversalSampleEditor from "../UniversalSampleEditor"
import { useSample, useReviewWork } from "udt-review-hooks"

export const ReviewSampleContent = ({ sampleId, onBack, onNext }) => {
  const [mode, setMode] = React.useState("view-best") // correct, view-audit-item
  const [selectedAuditItem, setSelectedAuditItem] = React.useState()
  const {
    sample,
    auditTrail,
    loading,
    reloadSample,
    submitAnnotation,
  } = useSample({
    sampleId,
    withAuditTrail: true,
  })
  const work_id =
    mode === "view-best" ? sample?.best_work_id : selectedAuditItem?.work_id
  const { reviewWork } = useReviewWork(work_id)

  const sampleBeingViewed = React.useMemo(
    () => ({
      ...sample?.sample_data,
      annotation:
        mode === "correct"
          ? null
          : mode === "view-best"
          ? sample?.best_annotation
          : mode === "view-audit-item"
          ? selectedAuditItem?.annotation
          : null,
    }),
    [sample, mode, selectedAuditItem]
  )

  return (
    <Box display="flex">
      <Box flexGrow={1}>
        <Box display="flex" padding={1} paddingBottom={2}>
          <Button onClick={onBack} variant="outlined">
            Back
          </Button>
          <Box flexGrow={1} />
          <Button
            variant="outlined"
            style={{ color: colors.red[600], borderColor: colors.red[300] }}
            onClick={async () => {
              if (!work_id) {
                window.alert("There is no work to review.")
                return
              }
              await reviewWork({
                reject: true,
                message: window.prompt("Leave a rejection message?"),
              })
              await reloadSample()
            }}
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
            onClick={async () => {
              if (!work_id) {
                window.alert("There is no work to review.")
                return
              }
              await reviewWork({ accept: true })
              await reloadSample()
            }}
          >
            Approve
          </Button>
          <Button onClick={onNext} style={{ marginLeft: 8 }} variant="outlined">
            Next
          </Button>
        </Box>
        {loading || !sample ? (
          <Box textAlign="center" pt="32px">
            <CircularProgress />
          </Box>
        ) : mode === "view-audit-item" && selectedAuditItem.type !== "work" ? (
          <pre>{JSON.stringify(selectedAuditItem, null, "  ")}</pre>
        ) : (
          <UniversalSampleEditor
            sampleIndex={sample.sample_index}
            sample={sampleBeingViewed}
            interface={sample.interface}
            onModifySample={async (sample) => {
              await submitAnnotation(sample.annotation)
            }}
          />
        )}
      </Box>
      <Box width={320} flexShrink={0} paddingLeft={1}>
        <Box color={colors.grey[700]} padding={1}>
          History
        </Box>
        <AuditTrail
          selectedItem={selectedAuditItem}
          items={auditTrail}
          bestWorkId={sample?.best_work_id}
          onSelectItem={(item) => {
            setSelectedAuditItem(item)
            setMode("view-audit-item")
          }}
        />
        <Box padding={1} textAlign="right" display="flex">
          <Button
            disabled={mode === "view-best"}
            variant="outlined"
            onClick={() => setMode("view-best")}
          >
            {mode === "view-best" ? "Viewing Best Labels" : "View Best Labels"}
          </Button>
          <Button
            onClick={() => setMode("correct")}
            color="primary"
            variant="outlined"
            style={{ marginLeft: 8 }}
          >
            Submit Correction
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ReviewSampleContent
