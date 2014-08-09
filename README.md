# Foundation for Apps WIP 

Work in progress for Foundation for Apps. At this time we will only be accepting PRs from the core team and invited contributors, as we work toward an initial release. Thanks!

## Requirements

You'll need to have the following items installed before continuing.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [Grunt](http://gruntjs.com/): Run `sudo npm install -g grunt-cli`
  * [Bower](http://bower.io): Run `sudo npm install -g bower`


## Quickstart

Clone this repository:
`git clone git@github.com:zurb/foundation-apps.git`

Navigate into the directory:
`cd foundation-apps`

Install all the dependencies:
`npm install && bower install`

While you're working on the project, run:

`grunt`

This will assemble all the pages and compile the Sass. You're set!

## Docs

The docs are generated in the `docs` directory when you run the quickstart process above.

## Directory Structure

* `dist`: Static pages are assembled here. This is where you should view the site in your browser. **Don't edit these files directly. They will be overwritten!**
* `docs`: Our humble guide to the new grid. This is just a quick overview at this point, and will get expanded out considerably before the release. Generated from `src/pages/index.html`. **Don't edit these files directly. They will be overwritten!**
* `src`: This is the directory you'll work in. 
* `src/assets`: All assets (scss, images, fonts, js, etc) go here.
* `src/assets/scss/_settings.scss`: Foundation configuration settings go in here
* `src/assets/scss/app.scss`: Application styles go here

## Feedback

If you have feedback on the grid please report issues to the Foundation for Apps repo. If there is an existing issue covering your topic please use that so we can keep the issue list clean. Pull requests are welcome from the core team and invited contributors, but be explicit (not that kind) so we know what's what. Thanks!

Please note that for the moment, new issues and PRs may be closed without warning. We are, in the interest of sanity, restricting commentary and changes to the Foundation Core team. If you absolutely MUST say something and are not core team, please reach out to use on twitter @zurbfoundation. Thanks!
