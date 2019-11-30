# Universal Data Tool

Try it out at [universaldatatool.com](https://universaldatatool.com).

The Universal Data Tool is a User Interface for editing and annotating Images (Computer Vision, Bounding Boxes, Segmentation), Text (Named Entity Recognition, Classification) or general purpose data entry. to view and edit any data defined by the [open human annotation standard](https://github.com/OpenHumanAnnotation/open-human-annotation-task-format).

<!-- [Check out the demo here.](#) -->

## Sponsors

[![wao.ai sponsorship image](https://s3.amazonaws.com/asset.workaround.online/sponsorship-banner-1.png)](https://wao.ai)

## Features

- Integrate into any web-based application.
- Annotate images with classifications, tags, bounding boxes, polygons, points and more
- Annotate NLP datasets with Named Entity Recognition (NER), classification and Part of Speech (PoS) tagging.
- Perform data entry

## Principles

- Correctness of implementation of the Open Human Annotation standard.
- Implement entirety of the Open Human Annotation standard.
- Rely on external libraries which specialize in each type of annotation to enable the best tools to be used
- Easy to use
- Easy to integrate

To do this, we make sacrifices in design consistency and library size.

## Libraries

The Universal Data Tool is always looking for the best libraries to provide the
user interface for different types of annotation. Currently, the following
libraries are used...

- [material-survey](https://github.com/collegeai/material-survey) for data entry.
- [react-image-annotate](https://github.com/workaroundonline/react-image-annotate) for image annotation.
- [react-nlp-annotate](https://github.com/workaroundonline/react-nlp-annotate) for entity recognition and NLP tasks.
