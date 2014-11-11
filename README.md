# Foundation for Apps Alpha

[![Build Status](https://travis-ci.org/zurb/foundation-apps.svg)](https://travis-ci.org/zurb/foundation-apps)

Work in progress for Foundation for Apps, an Angular-powered framework for responsive web apps, from your friends at [ZURB](http://zurb.com). At this time we will only be accepting pull requests from the core team and invited contributors, as we work toward an initial release. Thanks!

## Requirements

You'll need the following software installed to get started.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [Git](http://git-scm.com/downloads): Use the installer for your OS.
    * Windows users can also try [Git for Windows](http://git-for-windows.github.io/).
  * [Ruby](https://www.ruby-lang.org/en/): Use the installer for your OS. For Windows users, [JRuby](http://jruby.org/) is a popular alternative.
    * With Ruby installed, run `gem install bundler sass`.
  * [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): Run `[sudo] npm install -g gulp bower`

## Get Started

You can use our [starter template](https://github.com/zurb/foundation-apps-template) to quickly get going with Foundation for Apps.
```
git clone https://github.com/zurb/foundation-apps-template.git app
cd app
npm install
```

While working on your project, run:
```
npm start
```

This will aseemble the templates, static assets, Sass, and JavaScript. You can view the test server at this URL:
```
http://localhost:8080
```

Or, you can incorporate our components into your own stack by installing with Bower.
```
bower install zurb/foundation-apps
```

## Building this Repo

If you want to work with the source code directly or compile our documentation, follow these steps:
```
git clone https://github.com/zurb/foundation-apps.git
cd foundation-apps
npm install
```

While you're working on the code, run:
```
npm start
```

The documentation can be viewed at the same URL as above.

### Directory Structure

* `build`: This is where our documentation is assembled. **Don't edit these files directly, as they're overwritten every time you make a change!**
* `docs`: The Foundation for Apps documentation.
* `scss`: The Sass components.
* `js`: The Angular modules and directives, and other external libraries.
* `iconic`: A set of 24 icons from the folks at [Iconic](https://useiconic.com/).
* `tests`: Unit tests for the Angular modules.

## Contributing

We love opinions! If you have feedback on the grid system, the UI components, the Angular modules, or anything else, open a new issue or contribute to one of our existing [discussion topics](https://github.com/zurb/foundation-apps/labels/discussion).

While we work towards a release candidate, we'll only be accepting PRs for new features from the core Foundation team.
