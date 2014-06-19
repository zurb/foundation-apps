# Foundation for Apps WIP 

Work in progress for Foundation for Apps. At this time we will only be accepting issues and PRs from the core team, as we work toward an initial release. Thanks!

## Requirements

You'll need to have the following items installed before continuing.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [Grunt](http://gruntjs.com/): Run `sudo npm install -g grunt-cli`
  * [Bower](http://bower.io): Run `sudo npm install -g bower`


## Quickstart

Clone this repository:
`git clone git@github.com:zurb/foundation-libsass-template.git`

Navigate into the directory:
`cd foundation-libsass-template`

Install all the dependincies:
`npm install && bower install`

While you're working on your project, run:

`grunt`

This will assemble all the pages and compile the Sass. You're set!

## Directory Structure

* `dist`: Static pages are assembled here. This is where you should view the site in your browser. **Don't edit these files directly. They will be overwritten!**
* `src`: This is the directory you'll work in. 
* `src/assets`: All assets (scss, images, fonts, js, etc) go here.
* `src/assets/scss/_settings.scss`: Foundation configuration settings go in here
* `src/assets/scss/app.scss`: Application styles go here
