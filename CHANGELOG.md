# Version 1.0.2

*December 23, 2014*

**Foundation for Apps is now on npm!** `npm install foundation-apps`

**Upgrading from an older version?** We changed how our Angular plugins are structured, which means an existing app's build process will need to be changed slightly.

- **If you're using our template stack as-is:**
  - Replace your existing `Gulpfile.js` with the [new Gulpfile](https://github.com/zurb/foundation-apps-template/blob/master/gulpfile.js).
  - Copy the [new app.js](https://github.com/zurb/foundation-apps-template/blob/master/client/assets/js/app.js) file into the folder `client/assets/js/`.
- If you need to upgrade a project with a custom build process:
  - To capture every plugin's JavaScript files in a single blob, use `bower_components/foundation-apps/js/angular/**/*.js`.
  - The Bower package no longer includes an `app.js` file. You can use our template stack's file as a baseline to write your own.
  - To capture every plugin's HTML template, use `bower_components/foundation-apps/js/angular/components/**/*.html`.

**Codebase changes:**

- #282: The Angular code has been refactored to be more streamlined and more modular. Each UI component now has its own folder, which includes the component's JavaScript and HTML template. The template stack has been updated to properly compile the new asset structure. **If you're upgrading an existing project, follow the above instructions to get everything set.**
  - The Bower package no longer includes an `app.js` file. Instead, a sample file has been included in the `client` folder of the template stack.
- #108: Every Sass function now has a unit test. Run `gulp sass:test` to run the test suite.
- #338: The Sass settings file is now automatically generated based on the variables inside each component's Sass file, with the command `gulp settings`. The [settings parser plguin](https://github.com/zurb/foundation-settings-parser) will be maintained as a separate codebase. The plugin pulls the variables out of each Sass file, after which:
  - Every component's variables are combined into one settings file, organized by component.
  - Each individual component's variables are output as an HTML partial, to be displayed on that component's documentation.

**New features:**

- **Touch support!** We added the [Hammer.js Angular library](http://ryanmullins.github.io/angular-hammer/) to our codebase, which allows you to trigger functions with touch gestures, using directives like `hm-swipeup` and `hm-pinchin`.
  - We added one custom directive, `zf-touch-close`, which allows you to trigger the `close` event on an element by swiping. We'll add more features in future versions.
- #301: Menu bars can now switch between the expanded and condensed styles at different screen sizes, using these classes: `condense`, `medium-condense`, `large-condense`, `medium-expand`, `large-expand`.
- #335: Menu bars can now be wrapped in a `menu-bar-group` container, which allows two menu bars to sit on the same row, aligned to the left and the right. Learn more [here](http://foundation.zurb.com/apps/docs/#!/menu-bar).
- #342: The `src` attribute of an Iconic icon can now be dynamically inserted. Instead of `data-src`, define the icon's source with the `dyn-src` attribute on a `zf-iconic` element.

**Bug fixes:**

- Added proper styles for checkboxes, radio buttons, and their text labels.
- Fixed a bug with IE10 and 11 where the last item in a wrapping grid would wrap to the next line.
- Fixed an issue with panels not properly functioning as grid containers.
- #320: Fixed the `clearall` event for notifications not removing elements from the view.
- #321: Fixed `zf-hard-toggle` not closing open action sheets.
- #328: Fixed an issue with collapible items in accordions.
- #331: Allow action sheets to be closed with `zf-hard-toggle`.
- #337: Improved the behavior of components animating in and out when toggled on and off rapidly.
- #343: The settings file now imports the functions file, to make `rem-calc()` and other functions accessible when modifying settings.
- #351: Fixed a bug where images were not added to notifications created with the publish API.
- #326: Fixed detached off-canvas menus overlapping with regular ones.
- #356: Fixed `$small-font-color` not being properly applied to `<small>` elements.

# Version 1.0.1

*December 12, 2014*

Lots of fixes for the Sass, JavaScript, and documentation. Thanks so much to everyone who's been giving feedback, reporting bugs, and most importantly, *fixing our typos* this past week.

## CSS

- Fixed an alignment issue with action sheet dropdowns.
- #157: Fixed misbehaving box shadows on panels.
- #180: Added a PNG fallback for the SVG icons used in block lists, for IE10.
- #212: Corrected a misused parameter in the `grid-frame()` and `grid-block()` mixins.
- #215: Removed unused text direction variables.
- #225: Fixed some components not working inside of an off-canvas menu because of selector specificity.
- #226: Configured the Gulpfile to catch Sass errors instead of exiting.
- #268: Changed `map-serialize()` to escape quotes in the outputted JSON.
- #247: Set the `$accordion-title-background-active` variable to be relative to `$accordion-title-background`.
  - #261: `$tab-title-background-active` got the same treatment.
- #295: Fixed a error that came up when creating a media query with `@include breakpoint(xxlarge only)`.
- #326: Fixed detached off-canvas menus overlapping with regular ones.

## JavaScript

- Added the `zf-hard-toggle` directive, to force other open components to close when the targeted component opens.
- Integrated the FastClick library.
- #199: Modals can be configured to not close when clicked outside of.
- #258: Accordions can be set to allow every item to be closed at once with `collapsible="true"`.
- #260: Added the element restriction to action sheets.
- #274: Added a timeout to hide elements that are missing an animationOut class.
- #290: Updated the Gulpfile to properly run `copy` when template pages are added or removed.

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