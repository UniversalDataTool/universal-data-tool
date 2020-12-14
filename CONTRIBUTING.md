# Contributing to Universal Data Tool

The Universal Data Tool aims to be a community-driven solution to managing the creation, labeling and exporting
of datasets. All contributions are welcome and appreciated!

> **Contributing to open-source is fun!**
>
> - Together, we can build some awesome software and enable people to build awesome AI!
> - Tons of people will appreciate the work you do
> - The issues and [slack](https://join.slack.com/t/universaldatatool/shared_invite/zt-d8teykwi-iOSOUfxugKR~M4AJN6VL3g) are a great place for discussing design, architectures, and new helpful technologies
> - If you have a good idea and put in some effort, it can be a part of a package used by thousands of people
> - You'll be credited for the work you do in the README, which you should use to get a cushy job!

# Things to do to contribute

- Thumbs up features or bugs you think are important!
- Create issues for features or bugs you find
- Solve UI bugs in existing issues
- Create react components for new UI features ("stories")
- Implement big features in draft PRs, taking breaks for feedback by messaging people on [Slack](https://join.slack.com/t/universaldatatool/shared_invite/zt-d8teykwi-iOSOUfxugKR~M4AJN6VL3g)
- Just fix a bunch of bugs and do a massive pull request with no description but all the tests pass and it looks pretty good so I guess it's fine

# What do I need to know to get started

- Watch this [video by one of our maintainers](https://vimeo.com/421285889) explaining how he starts working on a new feature
- If you don't know [react](https://reactjs.org/), this is an [introduction video](https://egghead.io/courses/the-beginner-s-guide-to-react) that should get you up to speed.
- Check out [Setup for Development](https://github.com/UniversalDataTool/universal-data-tool/wiki/Setup-for-Development) for instructions on how to run the project locally

> Still feeling like: "hhh'what is going on?" Check out this [sweet guide to contributing to open-source](https://opensource.guide/how-to-contribute/)

# Other stuff that's nice to know / FAQ

## How to I avoid git merging all the time?

Your git history will be messy and hard to maintain if you don't rebase from the latest version of UDT when you're working on features. There are
two ways to do this easily that we recommend:

1. When you want to update your branch/fork, do `git pull origin master --rebase`. The `--rebase` flag will make sure that your changes are on top of the latest version of UDT and not jumbled around.
2. If you want to do (1) by default without having to use the `--rebase` flag, just execute `git config --global pull.rebase true` one time on your computer.

## How do I develop the desktop application?

You'll need two terminals. One will run the electron app, the other will run the electron app.

1. Run `yarn start`
2. Run `yarn start:desktop`

## How do I run the Cypress Integration Tests

[Cypress integration tests](https://cypress.io) will run the web application and make sure that everything is working.

You'll need two terminals to run the cypress integration tests. One test needs to run the web server with `yarn start`, the other needs to run `yarn test:integration:dev`. After you run the latter command, you'll see a screen like this that will let you run any of the automated tests!

![](https://user-images.githubusercontent.com/1910070/93691536-92130a00-fab4-11ea-8b18-abaac2cad217.png)
