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
            'ab','aa','af','ak','sq','am','ar','an','hy','as','av','ae','ay','az','bm','ba','eu','be','bn','bh','bi','bs','br','bg','my','ca','km','ch','ce','ny','zh','cu','cv','kw','co','cr','hr','cs','da','dv','nl','dz','en','eo','et','ee','fo','fj','fi','fr','ff','gd','gl','lg','ka','de','ki','el','kl','gn','gu','ht','ha','he','hz','hi','ho','hu','is','io','ig','id','ia','ie','iu','ik','ga','it','ja','jv','kn','kr','ks','kk','rw','kv','kg','ko','kj','ku','ky','lo','la','lv','lb','li','ln','lt','lu','mk','mg','ms','ml','mt','gv','mi','mr','mh','ro','mn','na','nv','nd','ng','ne','se','no','nb','nn','ii','oc','oj','or','om','os','pi','pa','ps','fa','pl','pt','qu','rm','rn','ru','sm','sg','sa','sc','sr','sn','sd','si','sk','sl','so','st','nr','es','su','sw','ss','sv','tl','ty','tg','ta','tt','te','th','bo','ti','to','ts','tn','tr','tk','tw','ug','uk','ur','uz','ve','vi','vo','wa','cy','fy','wo','xh','yi','yo','za','zu'
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