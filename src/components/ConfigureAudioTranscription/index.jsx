import React, { useMemo } from "react"
import Survey from "material-survey/components/Survey"

const form = {
  questions: [
    {
        name: "transcriptionType",
        title: "Region Types Allowed",
        description: "What types of regions can be drawn on the image.",
        type: "dropdown",
        choices: ["simple", "proper"]
    },
    {
        name: "phraseBank",
        title: "Region Types Allowed",
        description: "What types of regions can be drawn on the image.",
        hasOther: true,
        type: "checkbox",
        choices: [
            "bounding-box",
            "polygon",
            "point"
        ],
    },
    {
        name: "onlyUseWordsInPhraseBank",
        title: "Region Types Allowed",
        description: "What types of regions can be drawn on the image.",
        type: "dropdown",
        choices: ["bounding-box", "polygon", "point"]
    },
  ]
}

export default ({ iface, onChange }) => {
    // const defaultAnswers = useMemo(
    //     () =>({
    //         transcriptionType: '',
    //         phraseBank: '',
    //         onlyUseWordsInPhraseBank: ''
    //     }),
    //     []
    // )
    
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