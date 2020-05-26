# Universal Data Tool

[![GitHub version](https://badge.fury.io/gh/UniversalDataTool%2Funiversal-data-tool.svg)](https://badge.fury.io/gh/UniversalDataTool%2Funiversal-data-tool)
![Master Branch](https://github.com/UniversalDataTool/universal-data-tool/workflows/Test/badge.svg)
[![npm version](https://badge.fury.io/js/universal-data-tool.svg)](https://badge.fury.io/js/universal-data-tool)
[![GitHub license](https://img.shields.io/github/license/UniversalDataTool/universal-data-tool)](https://github.com/UniversalDataTool/universal-data-tool/blob/master/LICENSE)
[![Platform Support Web/Win/Linux/Mac](https://img.shields.io/badge/platforms-Web%20Windows%20Linux%20Mac-blueviolet)](https://github.com/UniversalDataTool/universal-data-tool/releases)
[![Slack Image](https://img.shields.io/badge/slack-Universal%20Data%20Tool-blue.svg?logo=slack)](https://join.slack.com/t/universaldatatool/shared_invite/zt-d8teykwi-iOSOUfxugKR~M4AJN6VL3g)

Try it out at [universaldatatool.com](https://universaldatatool.com) or [download it here](https://github.com/UniversalDataTool/universal-data-tool/releases).

The Universal Data Tool is a web/desktop app for editing and annotating images, text, audio, documents and to view and edit any data defined in the extensible the [.udt.json and .udt.csv standard](https://github.com/UniversalDataTool/udt-format).

## Features

- Usable on [web](https://universaldatatool.com) or as [Windows,Mac or Linux desktop application](https://github.com/UniversalDataTool/universal-data-tool/wiki/Installation)
- Collaborate with others in real time
- Configure your project with an easy-to-use GUI
- Download/upload as easy-to-use CSV ([sample.udt.csv](https://github.com/UniversalDataTool/udt-format/blob/master/SAMPLE.udt.csv)) or JSON ([sample.udt.json](https://github.com/UniversalDataTool/udt-format/blob/master/SAMPLE.udt.json))
- Support for Images, Videos, PDFs, Text, Audio Transcription and many other formats
- Can be [easily integrated into a React application](https://github.com/UniversalDataTool/universal-data-tool/wiki/Usage-with-React)
- Annotate images or videos with classifications, tags, bounding boxes, polygons and points
- Import data from Google Drive, Youtube, CSV, Clipboard and more
- Annotate NLP datasets with Named Entity Recognition (NER), classification and Part of Speech (PoS) tagging.
- Easily [load into pandas](https://github.com/UniversalDataTool/universal-data-tool/wiki/Usage-with-Pandas) or [use with fast.ai](https://github.com/UniversalDataTool/universal-data-tool/wiki/Usage-with-Fast.ai)

![Universal Data Tool Computer Vision Cat](https://user-images.githubusercontent.com/1910070/75850482-6a2cb500-5db5-11ea-852c-7256463cece8.png)

![Audio Transcription](https://user-images.githubusercontent.com/1910070/76154268-80818c00-60a7-11ea-97de-529fd06d3901.png)

![Download Formats](https://user-images.githubusercontent.com/1910070/76154066-06033d00-60a4-11ea-9bbd-69a62780769f.png)

![Data Entry](https://user-images.githubusercontent.com/1910070/76157343-9a39c800-60d5-11ea-8dd6-a67c516fcf63.png)

![Named Entity Recognition](https://user-images.githubusercontent.com/1910070/76154279-a73fc280-60a7-11ea-8965-5de23ad733d6.png)

![Collaboration Screenshot](https://user-images.githubusercontent.com/1910070/76154071-10bdd200-60a4-11ea-8afd-a12f6d77a140.png)

![Collaboration Demo](https://user-images.githubusercontent.com/1910070/76154158-b02f9480-60a5-11ea-9fb5-ec62c9385a51.gif)

## Sponsors

[![wao.ai sponsorship image](https://s3.amazonaws.com/asset.workaround.online/sponsorship-banner-1.png)](https://wao.ai)

## Installation

### Web App

Just visit [universaldatatool.com](https://universaldatatool.com)!

_Trying to run the web app locally? Run `npm install` then `npm run start` after cloning this repository to start the web server_

### Desktop Application

Download the latest release from the [releases page](https://github.com/UniversalDataTool/universal-data-tool/releases) and run the executable you downloaded.

## Principles

- Correctness of implementation of the .udt.json standard.
- Implement entirety of the `.udt.json` and `.udt.csv` standards
- Rely on external libraries which specialize in each type of annotation to enable the best tools to be used
- Easy to use
- Easy to integrate

## Contributing

- (Optional) Say hi in the [Slack channel](https://join.slack.com/t/universaldatatool/shared_invite/zt-d8teykwi-iOSOUfxugKR~M4AJN6VL3g)!
- Read [this guide to get started with development](https://github.com/UniversalDataTool/universal-data-tool/wiki/Setup-for-Development).

## Libraries

The Universal Data Tool is always looking for the best libraries to provide the
user interface for different types of annotation. Currently, the following
libraries are used...

- [material-survey](https://github.com/collegeai/material-survey) for data entry.
- [react-image-annotate](https://github.com/workaroundonline/react-image-annotate) for image annotation.
- [react-nlp-annotate](https://github.com/workaroundonline/react-nlp-annotate) for entity recognition and NLP tasks.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/seveibar"><img src="https://avatars2.githubusercontent.com/u/1910070?v=4" width="100px;" alt=""/><br /><sub><b>Severin Ibarluzea</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=seveibar" title="Code">💻</a> <a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=seveibar" title="Documentation">📖</a> <a href="https://github.com/UniversalDataTool/universal-data-tool/pulls?q=is%3Apr+reviewed-by%3Aseveibar" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://puskuruk.github.io"><img src="https://avatars2.githubusercontent.com/u/22892227?v=4" width="100px;" alt=""/><br /><sub><b>Puskuruk</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=puskuruk" title="Code">💻</a> <a href="https://github.com/UniversalDataTool/universal-data-tool/pulls?q=is%3Apr+reviewed-by%3Apuskuruk" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/CedricJean"><img src="https://avatars1.githubusercontent.com/u/63243979?v=4" width="100px;" alt=""/><br /><sub><b>CedricJean</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=CedricJean" title="Code">💻</a></td>
    <td align="center"><a href="http://berupon.hatenablog.com/"><img src="https://avatars1.githubusercontent.com/u/1131125?v=4" width="100px;" alt=""/><br /><sub><b>beru</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=beru" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Ownmarc"><img src="https://avatars0.githubusercontent.com/u/24617457?v=4" width="100px;" alt=""/><br /><sub><b>Marc</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=Ownmarc" title="Code">💻</a> <a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=Ownmarc" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Wafaa-arbash"><img src="https://avatars0.githubusercontent.com/u/59834878?v=4" width="100px;" alt=""/><br /><sub><b>Wafaa-arbash</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=Wafaa-arbash" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
