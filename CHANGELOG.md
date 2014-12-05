# Version 1.0.0 — Matterhorn

Welcome to Foundation for Apps 1.0.0! Thanks for swinging by to try it out.

Our initial release of the framework includes:

 - **An awesome, responsive flexbox-based grid** for creating robust, responsive app layouts.
 - **The Motion UI library** for easily animating pages and components. You can also use our mixins to write custom animations.
 - **Our Gulp-powered Angular helpers** which allow you to harness the power of the Angular UI Router library without writing any JavaScript.

The framework also includes these sweet components:
 - Block list
 - Button
 - Button group
 - Card
 - Forms
 - Label and badge
 - Menu bar
 - Switch
 - Title bar
 - Typography
 - Visibility and utility classes

These components are also available as Angular directives:
 - Accordion
 - Action sheet
 - Modal
 - Notification
 - Off-canvas
 - Panel
 - Popup
 - Tabs

## How to Contribute

We love feedback! Help us find bugs and suggest improvements or new features. Follow us on Twitter at [@ZURBFoundation](https://twitter.com/zurbfoundation) to keep up-to-date with what's new, or to just shoot the breeze.

If you find a problem or have an idea, open a [new issue](https://github.com/zurb/foundation-apps/issues) on GitHub. When filing a bug report, make sure you specify the browser and operating system you're on, and toss us a screenshot or show us how we can recreate the issue.

## Known Issues

 - Some issues with the flexbox grid in IE10
 - Mobile Safari doesn't place fixed-position elements (modals, notifications) at the right z-index — #190
 - Range sliders aren't properly styled in IE10+ — #191

*The iconic Matterhorn gets its name from the German words Matte, meaning "meadow", and Horn, which means "peak".*

# Version 1.0.0 RC1 — Mont Blanc

It's our 1.0 release candidate! Thanks for stopping by to take a look.

## How to mess with it

If you want a quick way to jump in, check out our [starter template](https://github.com/zurb/foundation-apps-template), which has a basic directory structure and a blank index file for you to work with. Follow the instructions in the [readme](https://github.com/zurb/foundation-apps-template/blob/master/readme.md) to get going.

The first thing you'll probably want to check out is the grid. If you compile this repo on your machine, you can find the grid documentation at <http://localhost:8080/#!/grid>. You can also view the source of that file [here](https://github.com/zurb/foundation-apps/blob/master/docs/templates/grid.html).

To incorporate our Sass components and Angular directives into your own project, install Foundation using Bower:

```bash
bower install zurb/foundation-apps
```

The JavaScript is organized into common components, specific directives, and vendor files. There's also a sample `app.js` that shows how to import the Foundation modules, but you'll likely want to set up your Angular application your own way.

## How to contribute

We love feedback! We have a few [discussion topics](https://github.com/zurb/foundation-apps/issues?q=is%3Aopen+is%3Aissue+label%3Adiscussion) open on our issue tracker, but if you have more specific feedback, please open a new issue! If you encounter any bugs, let us know as well. Be sure to specify the browser and operating system you're using, and show us how we can recreate the issue. Code samples are great!

## What's left

The codebase is very close to feature-complete. Here are the things we're still working on:
 - Fully-working motion classes (see #113)
 - Loose ends on components (see #109, #110, #111)
 - Animation on directives (see #107)
 - Unit tests for Angular and Sass (see #106)
 - A finished settings file
 - The command-line interface (being built in a separate repo, currently private)
 - Testing, testing, testing