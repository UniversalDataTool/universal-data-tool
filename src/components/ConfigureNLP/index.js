import React from "react"
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
    },
    {   
        name: "labels",
        title: "Labels",
        type: "matrixdynamic",
        hasOther: true,
        columns: [
            {
                cellType: "text",
                name: "id",
                title: "ID"
            },
            {
                cellType: "text",
                name: "displayName",
                title: "Display Name"
            },
            {
                cellType: "text",
                name: "description",
                title: "Description"
            },
        ],
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