# Universal Data Tool

[![GitHub version](https://badge.fury.io/gh/UniversalDataTool%2Funiversal-data-tool.svg)](https://badge.fury.io/gh/UniversalDataTool%2Funiversal-data-tool)
![Master Branch](https://github.com/UniversalDataTool/universal-data-tool/workflows/Test/badge.svg)
[![npm version](https://badge.fury.io/js/universal-data-tool.svg)](https://badge.fury.io/js/universal-data-tool)
[![GitHub license](https://img.shields.io/github/license/UniversalDataTool/universal-data-tool)](https://github.com/UniversalDataTool/universal-data-tool/blob/master/LICENSE)
[![Platform Support Web/Win/Linux/Mac](https://img.shields.io/badge/platforms-Web%20Windows%20Linux%20Mac-blueviolet)](https://github.com/UniversalDataTool/universal-data-tool/releases)
[![Slack Image](https://img.shields.io/badge/slack-Universal%20Data%20Tool-blue.svg?logo=slack)](https://join.slack.com/t/universaldatatool/shared_invite/zt-d8teykwi-iOSOUfxugKR~M4AJN6VL3g)
[![Twitter Logo](https://img.shields.io/twitter/follow/UniversalDataTl?style=social)](https://twitter.com/UniversalDataTl)

Try it out at [udt.dev](https://udt.dev), [download the desktop app](https://github.com/UniversalDataTool/universal-data-tool/releases) or [run on-premise](https://docs.universaldatatool.com/running-on-premise).

> [!NOTE]
> If you think Universal Data Tool is cool, check out my new project for [creating electronics with React](https://docs.tscircuit.com)

<p align="center">
  <img src="https://user-images.githubusercontent.com/1910070/91648687-729a3b80-ea38-11ea-92f2-7ce94ae04da6.gif">
</p>

<p align="center">
  <b>
  <a href="https://docs.universaldatatool.com">Docs</a> • <a href="https://universaldatatool.com">Website</a> • <a href="https://udt.dev">Playground</a> • <a href="https://docs.universaldatatool.com/integrate-with-any-web-page/integrate-with-the-javascript-library">Library Usage</a> • <a href="https://docs.universaldatatool.com/running-on-premise">On-Premise</a>
  </b>
</p>

The Universal Data Tool is a web/desktop app for editing and annotating images, text, audio, documents and to view and edit any data defined in the extensible [.udt.json and .udt.csv standard](https://github.com/UniversalDataTool/udt-format).

## Supported Data

<p align="center">
    <a href="https://docs.universaldatatool.com/building-and-labeling-datasets/image-segmentation">Image Segmentation</a> • 
    <a href="https://docs.universaldatatool.com/building-and-labeling-datasets/image-classification">Image Classification</a> • 
    <a href="https://docs.universaldatatool.com/building-and-labeling-datasets/text-classification">Text Classification</a> • 
    <a href="https://docs.universaldatatool.com/building-and-labeling-datasets/named-entity-recognition">Named Entity Recognition</a> • 
    <a href="https://docs.universaldatatool.com/building-and-labeling-datasets/entity-relations-part-of-speech-tagging">Named Entity Relations / Part of Speech Tagging</a> • 
    <a href="https://docs.universaldatatool.com/building-and-labeling-datasets/audio-transcription">Audio Transcription</a> • 
    <a href="https://docs.universaldatatool.com/building-and-labeling-datasets/data-entry">Data Entry</a> • 
    <a href="https://docs.universaldatatool.com/building-and-labeling-datasets/video-segmentation">Video Segmentation</a> • 
    <a href="https://docs.universaldatatool.com/building-and-labeling-datasets/landmark-annotation">Landmark / Pose Annotation</a>
</p>

## Recent Updates

[Follow our development on Youtube!](https://www.youtube.com/channel/UCgFkrRN7CLt7_iTa2WDjf2g)

<!-- COMMUNITY-UPDATE:START !-->

- [Community Update Video 9](https://youtu.be/q20WrCRcG4k)
- [Community Update Video 8](https://www.youtube.com/watch?v=IBWOaw0jMmM)
- [Community Update Video 7](https://youtu.be/glPPFgXibdw) [(blog version)](https://universaldatatool.substack.com/p/build-your-dataset-from-coco)
  <!-- COMMUNITY-UPDATE:END !-->

## Features

- **Collaborate with others in real time, no sign up!**
- Usable on [web](https://universaldatatool.com) or as [Windows,Mac or Linux desktop application](https://github.com/UniversalDataTool/universal-data-tool/wiki/Installation)
- Configure your project with an easy-to-use GUI
- [Easily create courses to train your labelers](https://universaldatatool.com/courses)
- Download/upload as easy-to-use CSV ([sample.udt.csv](https://github.com/UniversalDataTool/udt-format/blob/master/SAMPLE.udt.csv)) or JSON ([sample.udt.json](https://github.com/UniversalDataTool/udt-format/blob/master/SAMPLE.udt.json))
- Support for Images, Videos, PDFs, Text, Audio Transcription and many other formats
- Can be [easily integrated into a React application](https://github.com/UniversalDataTool/universal-data-tool/wiki/Usage-with-React)
- Annotate images or videos with classifications, tags, bounding boxes, polygons and points
- Fast Automatic Smart Pixel Segmentation using WebWorkers and WebAssembly
- Import data from Google Drive, Youtube, CSV, Clipboard and more
- Annotate NLP datasets with Named Entity Recognition (NER), classification and Part of Speech (PoS) tagging.
- Easily [load into pandas](https://github.com/UniversalDataTool/universal-data-tool/wiki/Usage-with-Pandas) or [use with fast.ai](https://github.com/UniversalDataTool/universal-data-tool/wiki/Usage-with-Fast.ai)
- Runs [with docker](https://hub.docker.com/r/universaldatatool/universaldatatool) `docker run -p 3000:3000 universaldatatool/universaldatatool`
- Runs [with singularity](https://singularity-hub.org/collections/4792) `singularity run universaldatatool/universaldatatool`

<p align="center"><kbd><img width="600" src="https://user-images.githubusercontent.com/1910070/76154066-06033d00-60a4-11ea-9bbd-69a62780769f.png" /></kbd></p>

<p align="center"><kbd><img width="600" src="https://user-images.githubusercontent.com/1910070/91648815-07516900-ea3a-11ea-9355-70dfbf5c8974.png" /></kbd></p>

<p align="center"><kbd><img width="600" src="https://user-images.githubusercontent.com/1910070/76157343-9a39c800-60d5-11ea-8dd6-a67c516fcf63.png" /></kbd></p>

<p align="center"><kbd><img width="600" src="https://user-images.githubusercontent.com/1910070/93283916-7b607080-f79f-11ea-838d-683829aff1b3.png" /></kbd></p>

## Sponsors

[![wao.ai sponsorship image](https://user-images.githubusercontent.com/1910070/107271376-20fbd100-6a1a-11eb-9f82-2d10607591ba.png)](https://wao.ai)
[![momentum image](https://user-images.githubusercontent.com/1910070/107270943-8bf8d800-6a19-11eb-97c2-895b0280aa8a.png)](https://momentum-tech.ca/)
[![enabled intelligence image](https://user-images.githubusercontent.com/1910070/107271756-aaab9e80-6a1a-11eb-887c-6f5d009f0fd2.png)](https://www.enabledintelligence.net/)

## Installation

### Web App

Just visit [universaldatatool.com](https://universaldatatool.com)!

_Trying to run the web app locally? Run `npm install` then `npm run start` after cloning this repository to start the web server._

### Desktop Application

Download the latest release from the [releases page](https://github.com/UniversalDataTool/universal-data-tool/releases) and run the executable you downloaded.

## Contributing

- (Optional) Say hi in the [Slack channel](https://join.slack.com/t/universaldatatool/shared_invite/zt-d8teykwi-iOSOUfxugKR~M4AJN6VL3g)!
- Read [this guide to get started with development](https://github.com/UniversalDataTool/universal-data-tool/wiki/Setup-for-Development).

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
    <td align="center"><a href="https://github.com/pgrimaud"><img src="https://avatars1.githubusercontent.com/u/1866496?v=4" width="100px;" alt=""/><br /><sub><b>Pierre Grimaud</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=pgrimaud" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/sreevardhanreddi"><img src="https://avatars0.githubusercontent.com/u/31174432?v=4" width="100px;" alt=""/><br /><sub><b>sreevardhanreddi</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=sreevardhanreddi" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mrdadah"><img src="https://avatars2.githubusercontent.com/u/11255121?v=4" width="100px;" alt=""/><br /><sub><b>Mohammed Eldadah</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=mrdadah" title="Code">💻</a></td>
    <td align="center"><a href="https://x8795278.blogspot.com/"><img src="https://avatars3.githubusercontent.com/u/9297254?v=4" width="100px;" alt=""/><br /><sub><b>x213212</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=x213212" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/hysios"><img src="https://avatars0.githubusercontent.com/u/103227?v=4" width="100px;" alt=""/><br /><sub><b>hysios </b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=hysios" title="Code">💻</a></td>
    <td align="center"><a href="https://congdv.github.io/"><img src="https://avatars2.githubusercontent.com/u/8192210?v=4" width="100px;" alt=""/><br /><sub><b>Cong Dao</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=congdv" title="Code">💻</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/renato-gonsalves-499317125/"><img src="https://avatars0.githubusercontent.com/u/47343193?v=4" width="100px;" alt=""/><br /><sub><b>Renato Junior</b></sub></a><br /><a href="#translation-MrJunato" title="Translation">🌍</a></td>
    <td align="center"><a href="https://gitlab.com/rickstaa"><img src="https://avatars0.githubusercontent.com/u/17570430?v=4" width="100px;" alt=""/><br /><sub><b>Rick</b></sub></a><br /><a href="#translation-rickstaa" title="Translation">🌍</a> <a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=rickstaa" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/anaplian"><img src="https://avatars3.githubusercontent.com/u/18647401?v=4" width="100px;" alt=""/><br /><sub><b>anaplian</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=anaplian" title="Code">💻</a></td>
    <td align="center"><a href="https://www.behance.net/MiguelCarvalho13"><img src="https://avatars2.githubusercontent.com/u/6718302?v=4" width="100px;" alt=""/><br /><sub><b>Miguel Carvalho</b></sub></a><br /><a href="#translation-miguelcarvalho13" title="Translation">🌍</a></td>
    <td align="center"><a href="https://kyleo.io"><img src="https://avatars2.githubusercontent.com/u/27719893?v=4" width="100px;" alt=""/><br /><sub><b>Kyle OBrien</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=obrien-k" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/hakkiyagiz"><img src="https://avatars2.githubusercontent.com/u/12295562?v=4" width="100px;" alt=""/><br /><sub><b>Hakkı Yağız ERDİNÇ</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=hakkiyagiz" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jvdavim"><img src="https://avatars2.githubusercontent.com/u/16657663?v=4" width="100px;" alt=""/><br /><sub><b>João Victor Davim</b></sub></a><br /><a href="https://github.com/UniversalDataTool/universal-data-tool/commits?author=jvdavim" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
