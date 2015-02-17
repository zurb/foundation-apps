# Foundation for Apps

[![Build Status](https://travis-ci.org/zurb/foundation-apps.svg)](https://travis-ci.org/zurb/foundation-apps)

This is [Foundation for Apps](http://foundation.zurb.com/apps), an Angular-powered framework for building powerful responsive web apps, from your friends at [ZURB](http://zurb.com).

## Requirements

You'll need the following software installed to get started.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [Git](http://git-scm.com/downloads): Use the installer for your OS.
    * Windows users can also try [Git for Windows](http://git-for-windows.github.io/).
  * [Ruby](https://www.ruby-lang.org/en/): Use the installer for your OS. For Windows users, [JRuby](http://jruby.org/) is a popular alternative.
    * With Ruby installed, run `gem install bundler sass`.
  * [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): Run `[sudo] npm install -g gulp bower`

## Get Started

The Sass and JavaScript components are available on Bower and npm.
```
bower install foundation-apps --save
npm install foundation-apps --save
```

You can also use our command-line interface to quickly setup a basic Foundation for Apps project. It includes a pre-built Gulpfile that compiles an Angular-powered web app for you.

Install it with this command:
```
npm install -g foundation-cli bower gulp
```

Now you can make a new project:
```
foundation-apps new myApp
cd myApp
```

While working on your project, run:
```
npm start
```

This will assemble the templates, static assets, Sass, and JavaScript. You can view the test server at this URL:
```
http://localhost:8080
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
* `dist`: Compiled CSS and JavaScript files, in minified and unmified flavors.
* `tests`: Unit tests for the Angular modules.

## Versioning

Foundation for Apps follows semver, so we won't introduce breaking changes in minor or patch versions. The `master` branch will always have the newest changes, so it's not necessarily production ready. The `stable` branch will always have the most recent stable version of the framework.

## Contributing

We love feedback! Help us find bugs and suggest improvements or new features. Follow us on Twitter at [@ZURBFoundation](https://twitter.com/zurbfoundation) to keep up-to-date with what's new, or to just shoot the breeze.

If you find a problem or have an idea, open a [new issue](https://github.com/zurb/foundation-apps/issues) on GitHub. When filing a bug report, make sure you specify the browser and operating system you're on, and toss us a screenshot or show us how we can recreate the issue.
