# Foundation for Apps WIP

[![Build Status](https://travis-ci.org/zurb/foundation-apps.svg)](https://travis-ci.org/zurb/foundation-apps)

Work in progress for Foundation for Apps. At this time we will only be accepting PRs from the core team and invited contributors, as we work toward an initial release. Thanks!

## Requirements

You'll need to have the following items installed before continuing.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [Git](http://git-scm.com/downloads): Use the installer for your OS.
  * [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): Run `sudo npm install -g gulp bower`

## Quickstart

Clone this repository:
`git clone https://github.com/zurb/foundation-apps.git`

Navigate into the directory:
`cd foundation-apps`

Install all the dependencies:
`npm install`

While you're working on the project, run:
`gulp`

This will assemble all the pages and compile the Sass. You can view the test site at this URL:

```
localhost:8080
```

## For Windows Users

Windows doesn't come with some tools that OS X or Linux might get pre-installed with. Some instructions may also differ. Here are some tip to get things working:

- To get Git working (and Bower along with it), install [Git for Windows](http://git-for-windows.github.io/)
- Windows doesn't have `sudo`, which is a command that will allow you to run the rest of the command as a `root` or `administrator` user. Instead, right click or shift-right-click your Command Prompt and choose the option "run as Administrator..". Once you've done this, make sure to omit `sudo` when running a command. Windows WILL prompt you every time you open CMD with a dialog ensure you want to run your program as an Administrator.
- Windows does not come with Ruby, to install Ruby either download and run the [official installer](https://www.ruby-lang.org/en/) or try [Jruby](http://jruby.org/), a Ruby alternative many Windows users use.


## Docs

The docs are generated in the `docs` directory when you run the quickstart process above.

## Directory Structure

* `build`: This is where the finished Angular app is assembled. To deploy your app, use the contents of this folder. **Don't edit these files directly, as they're overwritten every time you make a change!**
* `Docs`: The meat of your application. This is where the main `index.html` file is, as well as the page templates that make up your app.
* `js`: Our JavaScript plugins and Angular directives are being developed here.
* `scss`: Our UI components are being developed here.
* `docs`: Our old test pages. The ones that matter have been moved to `Docs/templates`.

## Feedback

If you have feedback on the grid please report issues to the Foundation for Apps repo. If there is an existing issue covering your topic please use that so we can keep the issue list clean. Pull requests are welcome from the core team and invited contributors, but be explicit (not that kind) so we know what's what. Thanks!

Please note that for the moment, new issues and PRs may be closed without warning. We are, in the interest of sanity, restricting commentary and changes to the Foundation Core team. If you absolutely MUST say something and are not core team, please reach out to us on twitter @zurbfoundation. Thanks!
