# Universal Data Tool

Try it out at [universaldatatool.com](https://universaldatatool.com) or [download it here](https://github.com/UniversalDataTool/universal-data-tool/releases).

The Universal Data Tool is a web/desktop app for editing and annotating images, text, audio, documents and to view and edit any data defined in the extensible the [.udt.json and .udt.csv standard](https://github.com/UniversalDataTool/udt-format).

## Features
* Usable on [web](https://universaldatatool.com) or as desktop application
* Collaborate with others in real time
* Configure your project with an easy-to-use GUI
* Scales to tens of thousands of data points per dataset
* Download/upload as easy-to-use CSV or JSON
* Support for Images, PDFs, Text, Audio Transcription and many other formats
* Can be easily integrated into a React application
* Annotate images with classifications, tags, bounding boxes, polygons and points
* Annotate NLP datasets with Named Entity Recognition (NER), classification and Part of Speech (PoS) tagging.


![Universal Data Tool Computer Vision Cat](https://user-images.githubusercontent.com/1910070/75850482-6a2cb500-5db5-11ea-852c-7256463cece8.png)


![Audio Transcription](https://user-images.githubusercontent.com/1910070/76154268-80818c00-60a7-11ea-97de-529fd06d3901.png)


![Download Formats](https://user-images.githubusercontent.com/1910070/76154066-06033d00-60a4-11ea-9bbd-69a62780769f.png)

![Named Entity Recognition](https://user-images.githubusercontent.com/1910070/76154279-a73fc280-60a7-11ea-8965-5de23ad733d6.png)


![Collaboration Screenshot](https://user-images.githubusercontent.com/1910070/76154071-10bdd200-60a4-11ea-8afd-a12f6d77a140.png)


![Collaboration Demo](https://user-images.githubusercontent.com/1910070/76154158-b02f9480-60a5-11ea-9fb5-ec62c9385a51.gif)

## Sponsors

[![wao.ai sponsorship image](https://s3.amazonaws.com/asset.workaround.online/sponsorship-banner-1.png)](https://wao.ai)

## Principles

- Correctness of implementation of the .udt.json standard.
- Implement entirety of the `.udt.json` and `.udt.csv` standards
- Rely on external libraries which specialize in each type of annotation to enable the best tools to be used
- Easy to use
- Easy to integrate

## Libraries

The Universal Data Tool is always looking for the best libraries to provide the
user interface for different types of annotation. Currently, the following
libraries are used...

- [material-survey](https://github.com/collegeai/material-survey) for data entry.
- [react-image-annotate](https://github.com/workaroundonline/react-image-annotate) for image annotation.
- [react-nlp-annotate](https://github.com/workaroundonline/react-nlp-annotate) for entity recognition and NLP tasks.
