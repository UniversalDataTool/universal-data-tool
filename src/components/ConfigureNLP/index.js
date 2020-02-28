import React, { useMemo } from "react"
import Survey from "material-survey/components/Survey"

const form = {
  questions: [
    {
        name: "description",
        title: "Description",
        type: "multiline-text",
    },
    {
        name: "overlapAllowed",
        title: "Overlap Allowed",
        type: "boolean"
    }
  ]
}

export default ({ iface, onChange }) => {    
    return(
        <Survey
            noActions
            variant="flat"
            onQuestionChange={(questionId, newValue, answers) =>{
                onChange({...iface, [questionId]: newValue})
            }}
            form={form}
        />
    )
}