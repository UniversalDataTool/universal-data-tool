import React from "react"
import Survey from "material-survey/components/Survey"

const form = {
  questions: [
    {}
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