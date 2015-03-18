# Version 1.1 — Weisshorn

*March 17, 2015*

### General

- **The CLI has been updated to version 1.1.** It includes a streamlined install process, better error-handling, better cross-platform support, and *no Ruby dependency*. Run `npm update -g foundation-cli` to get it.
- **The documentation is way better.** We did a sweep of every docs page to fix typos, improve examples, and generally make things more clear. Enjoy!
- **Foundation for Apps is now libsass-first.** We're still testing the codebase in both Ruby Sass 3.4+ and libsass 3.1+, but our documentation and template stack now compile with libsass by default. **This means Ruby is no longer a hard dependency of the framework.**
- **Directive templates are now compiled to one file.** We're using [ng-html2js](https://github.com/yaru22/ng-html2js) to package up all of our directive templates into a single JavaScript file. This means you no longer need to include the `components` folder in a public directory! This method still works, but you can also just include the `templates.js` file and you're good to go.
  - The templates file is included in the Bower and npm packages, under `dist/js/foundation-apps-templates.js`.
  - A third CDN URL has been created for the template files.
  - Thanks to @MikaAK for submitting the pull request that implemented this!

### Sass Variable Changes

These Sass variables changed. If you're upgrading an existing project, you'll need to update your `_settings.scss` file manually.

**Added:** `$button-background-hover: scale-color($button-background, $lightness: -15%)`
**Added:** `$motion-class-showhide: (in: "ng-hide-remove", out: "ng-hide-add");`
**Added:** `$motion-class-showhide-active: (in: "ng-hide-remove-active", out: "ng-hide-add-active");`
**Added:** `$input-background-disabled: smartscale($input-background)`
**Added:** `$input-cursor-disabled: not-allowed`
**Changed:** `$button-tag-selector` is now `false` (previously `true`)
**Removed:** `$panel-animation-speed`

**You don't need to add the new variables to your settings file,** unless you want to change their default values.

**The old variables are still in the codebase, but aren't being used.** They'll be permanently removed in version 1.2.

### Template Changes

- Sass is now compiled using libsass.
- Directive templates are compiled into a `templates.js` file, instead of being referenced using hardcoded paths to HTML files.
- **If you have an existing project, you don't need to change anything to upgrade to v1.1.**

### New Features

- **Improved view animation!** In and out animations on views will now play simultaneously. Thanks to @AntJanus, @stryju, and @jeanieshark for all their hard work in solving this difficult problem!
- `ui-view` elements no longer need the attribute `ng-class="['ui-animation']"` to animate properly; just having `ui-view` is enough.
- Prior to v1.1, view animations only worked if the states were created using our front matter routing plugin. Now you can enable view animation in manually-defined states by adding an `animation` property to the state object.

```js
$stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'templates/home.html',
    animation: {
      enter: 'slideInDown',
      leave: 'fadeOut'
    }
  });
```

- #461: Added a `$background-hover` parameter to the `button-style()` mixin. You can pass in a color, or the `auto` keyword to automatically set a color based on the `$background` parameter.
- #462: Added styles for disabled form elements. They're automatically applied to any `<input>` element with the `disabled` or `readonly` attributes, or a `<fieldset>` with `disabled`. The styles can also be added manually by adding the `.disabled` class.
- #475: The path the `zf-iconic` directive uses to search for icon files can now be changed width the `IconicProvider` provider. Use `IconicProvider.setAssetPath(path)` to set the path. Thanks to @gjungb for implementing this!
- #495: The front matter routing plugin now supports ui-router's abstract states. Just add `abstract: true` to a view template to make it go.
- Added support for ngAnimate's "show" and "hide" events. This means you can now use Motion UI classes with `ng-show` and `ng-hide`.
- Added a `.noscroll` class for grid blocks and content blocks. I bet you can guess what it does!
- You can now pass a scope to a modal created with `ModalFactory`, by passing it through the `contentScope` property on the modal's configuration object.

### Bug Fixes

- #191: `<input type="range">` elements are properly styled in Internet Explorer 10+.
- #396: Prevent a `$digest already in progress` error from occuring with panels and off-canvas.
- #397: The `FoundationApi` service now has an `unsubscribe` method, which allows us to remove event listeners from elements that have been removed from the DOM.
- #467: The settings variables for buttons were placed above button group, which prevents an issue with undefined variables.
- #472: Fixed the `color` attribute of static notifications not applying.
- #478: Fixed an issue with modals where `scope.$root` could be `null` after a state change.
- #483: Fixed notifications with `autoclose` not automatically closing under some circumstances.
- #486: The `ModalFactory` factory will fetch the modal template before initialization.
- #489: Deprecated `$panel-animation-speed`, an unused Sass variable for panels. It will be removed in a future version of the framework.
- #511: Panels that have converted into a block won't play their in/out animations if triggered by an open or close event.
- #530: Visibility classes will not conflict with Angular's `.ng-hide` class.
- The `<button>` tag is no longer styled as a `.button` element by default.
- Any element with `zf-open`, `zf-close`, or `zf-toggle` applied gets the `cursor: pointer` property.
- Removed the dropdown arrow that Internet Explorer 10+ adds to `<select>` elements.
- Prevented ghosting issues in WebKit with views that are mid-transition, by adding `-webkit-transform-style: preserve3d`.
- Fixed landscape/portrait visibility classes not hiding properly.
- Images inside cards will stretch to the width of the container.
- Added a missing secondary coloring class to Iconic (`.iconic-color-secondary`).

*The British physicist John Tyndall was the first person to ascend Weisshorn. When the climb was at its most bleak, Tyndall strengthened his resolve with patriotic thoughts:*

> I thought of Englishmen in battle, of the qualities which had made them famous: it was mainly the quality of not knowing when to yield - of fighting for duty even after they had ceased to be animated by hope. Such thoughts helped to lift me over the rocks.

# Version 1.0.3

*February 16, 2015*

### General

- The Bower and npm packages now include a `dist` folder, which contains compiled CSS and JavaScript files, in minified and unminified flavors.
- The Sass is now fully compatible with libsass. It's been tested in node-sass 1.2.3. Eventually our documentation and template stack will be compiled with node-sass instead of Ruby Sass, but we'll continue to test both.

### Breaking Changes

These Sass variables changed. If you're updating an existing project, you'll need to update your `_settings.scss` file manually.

- **Added:** `$badge-diameter: 1.5rem`
- **Renamed:** `$badge-font-color` is now `$badge-color`
- **Removed:** `$badge-padding`
- **Removed:** `$badge-radius`

The old variables are still in the codebase but aren't being used. They'll be permanently removed in version 1.1.

### Template Changes

The Gulpfile used in the [template stack](https://github.com/zurb/foundation-apps-template) now uses the `gulp-load-plugins` library to streamline use of plugins. **If you have an existing project, you don't need to change anything to upgrade.**

### New Features

- **Stacking notifications.** (#388) Dynamically-called notifications will now stack when you call more than one.
- **Responsive Iconic icons.** (#408) Iconic icons are now fluid by default, which means they will adjust their geometry based on the width of the parent container.
- **Staggered animations.** (#394) When using our motion classes in conjunction with the `ng-repeat`, you can now add a stagger class to make items animate in sequence. Add the class `.stagger`, `.short-stagger`, or `.long-stagger` to an element to enable the stagger effect.
- #376: Added `.info` and `.dark` coloring classes to buttons.
- #436: The items in a menu bar can be aligned with `.align-right`, `.align-center`, `.align-justify`, or `.align-spaced`. These classes mimic the behavior of the grid alignment classes.
- Notifications can now be assigned a timeout by adding the `autoclose` attribute. The value of `autoclose` is the number of milliseconds to wait before closing.
- The speed of all animations has been increased slightly. The default felt just a *little* too slow.

### Bug Fixes

**CSS:**

- #194: Fixed modals not scrolling when they overflow their parent.
- #412: `<button>` and `<input>` elements can be used as prefix/postfix elements in forms now, in addition to `<a>`.
- #417: Added padding to `<select>` elements to prevent the text from overlapping with the arrow.
- #435: Fixed a misnamed parameter in the `grid-block()` mixin.
- #438: Fixed display issues with `<select>` elements in Firefox.
- #453: Fixed block list checkboxes being misaligned.
- Fixed the `.dialog` class and sizing classes of modals not working.
- The CSS for badges was refactored so they're sized with width and height instead of padding.
- The pointer cursor is now used when hovering over any anchor (`<a>`) or any element with the `ui-sref` attribute.

**JavaScript:**

- #363: Fixed `zf-close` not working when placed outside of a component.
- #420: Fixed panel/block animations triggering even though the element is in block mode.
- #427: Fixed the `pin-at` directive not passing its value to Tether.
- #448: Fixed invalid `$scope.params` property on the DefaultController controller.
- If a component is closed or opened while a transition is in progress, the transition will reverse.

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