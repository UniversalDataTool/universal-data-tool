import React from "react"
import Survey from "material-survey/components/Survey"

const form = {
  questions: [
    {
        name: "transcriptionType",
        title: "Transcription Type",
        type: "dropdown",
        choices: [
            "simple",
            "proper"
        ]
    },
    {
        name: "phraseBank",
        title: "Phrase Bank",
        description: "URL of single-column CSV or TXT file with allowed phrases",
        type: "text",
    },
    {
        name: "onlyUseWordsInPhraseBank",
        title: "Only Use Words In Phrase Bank",
        type: "boolean",
    },
    {
        name: "languange",
        title: "Language",
        type: "dropdown",
        choices: [
            "en",
            "es",
            "tr",
            "gb"
        ]
    },
    {
        name: "description",
        title: "Description",
        type: "multiline-text"
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