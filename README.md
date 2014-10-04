# Foundation for Apps WIP

Work in progress for Foundation for Apps. At this time we will only be accepting PRs from the core team and invited contributors, as we work toward an initial release. Thanks!

## Requirements

You'll need to have the following items installed before continuing.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [Gulp](http://gruntjs.com/) and [Bower](http://bower.io): Run `sudo npm install -g grunt-cli bower`
  * [Sass 3.4](http://sass-lang.com/): run `gem update sass`

## Quickstart

Clone this repository:
`git clone git@github.com:zurb/foundation-apps.git`

Navigate into the directory:
`cd foundation-apps`

Install all the dependencies:
`npm install`

While you're working on the project, run:

`gulp`

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

Please note that for the moment, new issues and PRs may be closed without warning. We are, in the interest of sanity, restricting commentary and changes to the Foundation Core team. If you absolutely MUST say something and are not core team, please reach out to us on twitter @zurbfoundation. Thanks!

## Angular side of things

Features
==================

Gulp will watch for file changes in the `client` directory. Upon change, all files will be copied over to the `build` directory and the webserver will be reloaded. Note that the build directory will be deleted and recompiled upon each change. This means that any updates to files in the `build` directory will be deleted.

Dynamic Routing
===================

To simplify the routing process, this project includes dynamic routing. Here's how it works:

1. Add front matter to an application template (in `client/templates`)
2. Make sure to include a `name` which you'd want to use with `ui-sref` (the ui-router way of linking pages) and a `url` which that template can be accessible through
3. Run `gulp` to compile the project into the `build` folder

Usage
====================

This app depends on the use of `front matter` which is text prepended to templates like so:

````
---
name: mail
url: /mail
---
````

Front matter follows YAML conventions. For dynamic routing, a `name` and `url` have to be used (as discussed above). There are some other options.

###Parent
`parent` to specify a parent template. This can also be done using standard dot-delimited convention in the name. So you can either do this:

````
----
name: inbox
parent: mail
----
````

or this:

````
----
name: mail.inbox
----
````

Note that this specifies `child` templates. This means that when `mail` loads up, it'll have to have a `<div ui-view></div>` element into which a child is loaded. A child will need a `url` as well but note that the URL will be appended to the parent's URL like so:

````
name: mail
url: /mail
````

will be accessible via `/mail` while the child:

````
name: mail.inbox
url: /inbox
````

will be accessible via `/mail/inbox`. This specific URL has to be typed in in order for the child to show up. This allows us to specify several children (`inbox`, `sent`, `trash`, etc.).

###Composed views

Child views are great and all but what if you want to COMPOSE a view. Let's say you want a template that includes a dynamic sidebar and a footer. You can't create that with a child template structure.

For the main view (the parent) that will house the rest of the templates in a composition add this:

````
name: mail
composed: true
````

This willl tell the system to look out for any composable views. Now let's look at what the footer would look like:

````
name: footer
hasComposed: true
parent: mail
````

Note that for composable views, you can't use dot-delimited parents, you have to explicitly set them! To use the footer in the original `mail` template, you have to use its name:

`<div ui-view="footer"></div>`

###Controllers
Angular supports this neat thing called controllers. They can get confusing and so each template gets its own `DefaultController` which can be overriden like so:

````
controller: MyController
````

Among other things, the default controller passes a bunch of data through. For instance, all of your front-matter settings will be accessible via `vars` in your template. `{{ vars.name }}` will return the name of your route while `{{ vars.path }}` will return the relative path to the template.

If you use dynamic parameters in your URL, those parameters will be accessible via `params` so if your URL is:

````
url: /mail/inbox/:id
````

It will match any URL that follows that pattern (so `/mail/inbox/383828` would match as well as `/mail/inbox/my-email` but not `/mail/inbox/3838/something`).

###Animations
Angular and the UI router support animations. That means that when you transition from a page to another page, you can CSS animate it. It's easy to do with CSS; however, you can use front matter to register CSS animations:

````
animationIn: fadeIn
animationOut: fadeOut
````

The animation data gets registered for the template (only if it's a child or parent, not a partial) and will fire in the appropriate times.

Please note that the default AngularJS behavior for animations is to trigger both the "in" animation of a new element and the "out" animation of an element (`ng-enter` and `ng-leave` respectively) at the same time which will cause both views to appear together.

The ability to `sync` transitions together has been delayed from v1.2 to 1.3 and finally as a possibility for 2.0 ([ref](https://github.com/angular/angular.js/issues/2310))

###Additional mock data

Now that we have views and controllers out of the way, let's talk about mock data. As I've said, the controller will pass on ALL front matter to the template/view which means that we can add miscellaneous data to the front-matter and access it in the view! The front matter plugin supports standard YAML conventions which means that even arrays are supported! Let's see how we can put this to good use.

Let's say that we want to create a list of emails. Instead of copy/pasting a ton of code to simulate a full inbox, we can create a front-matter array:

````
emails:
    - Email 1
    - Email 2
    - Email 3
    - Email 4
    - Email 5
    - Email 6
````

We can then iterate over this array using standard angular conventions:

````
<div ng-repeat="email in vars.emails">{{ email }}</div>
````

This will translate to:

````
<div>Email 1</div>
<div>Email 2</div>
<div>Email 3</div>
<div>Email 4</div>
<div>Email 5</div>
<div>Email 6</div>
````

**Note** Named views are special and unfortunately, their properties can only be accessed through the `composed['name']` where name is the name you specify in a template. The entire mock data object for the parent and all of its composed children is accessible via `vars`.
