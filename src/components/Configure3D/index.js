import React from 'react';
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"


const ExplanationTextHeader = styled("div")({
    textAlign: "center",
    paddingTop: 30,
    paddingBottom: 50,
    userSelect: "none"
})


const ExplanationText = styled("h3")({
    fontWeight: "bold",
    color: colors.grey[500],
})

const GithubLink = styled("a")({
    color: colors.blue[500]
})

const Configure3D = () => {
    return (
        <ExplanationTextHeader>
            <ExplanationText>
                Hey, this isn't currently available, but if you'd like this functionality please let us know by leaving a thumbs up on <GithubLink target="_blank" rel="noopener noreferrer" href="https://github.com/UniversalDataTool/universal-data-tool/issues/20">this</GithubLink> github issue.
            </ExplanationText>
        </ExplanationTextHeader>
    );
}

export default Configure3D;
