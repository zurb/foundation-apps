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