##AngularJS
Gulp will watch for file changes in the `client` directory. Upon change, all files will be copied over to the `build` directory and the webserver will be reloaded. Note that the build directory will be deleted and recompiled upon each change. This means that any updates to files in the `build` directory will be deleted.

### Dynamic Routing

To simplify the routing process, this project includes dynamic routing. Here's how it works:

1. Add front matter to an application template (in `client/templates`)
2. Make sure to include a `name` which you'd want to use with `ui-sref` (the ui-router way of linking pages) and a `url` which that template can be accessible through
3. Run `gulp` to compile the project into the `build` folder

### Usage

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

### Composed views

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

### Controllers
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

**Note** Please don't forget to add the `ui-animation` attribute wherever you have `ui-view` in order to hook your animations up to that event!

### Additional mock data

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

###Directives
All of the directives are supported as attribute directive so you can add them to an element like so:

`<div fa-open></div>`

However, some directives allow element-level declaration like so:

`<fa-accordion-set></fa-accordion-set`

From now on, I will use the attribute declaration for directives that don't allow element declaration and use element declaration for elements that allow both.

Note that some directives will REPLACE your original element, in others the directive will become a child of the original element.

Wherever necessary, IDs will also be included to show that IDs are required in order for the directives to work correctly.

####Helpers

Foundation has some great helpers that foster better interaction between elements.

**fa-close**
fa-close looks for a parent element that has the `fa-closeable` tag on it. This tag is added automatically for all directives that can be closed with `fa-close`. When clicked, the directive will send a message via the FoundationApi to close its parent `fa-closeable` element.

````html
<fa-modal id="pageModal">
  <a href="#" fa-close>&times;</a>
</fa-modal>
````

Note that you can specify the ID of a specific closeable directive in order to close it remotely (whether it's a parent, child, or has any other relationship to the closeable directive).

````html
<a href="#" fa-close="pageModal">&times;</a>
<fa-modal id="pageModal"></fa-modal>
````

**fa-open**
The counter to `fa-close`, `fa-open` sends a signal to a directive that can be trigger through this method. Simply specify the ID of the target element.

````html
<a href="#" fa-open="pageModal">Open Modal</a>
<fa-modal id="pageModal"></fa-modal>
````

**fa-toggle**
Similar to the previous two, `fa-toggle` sends a toggle command to a directive that can accept it. A target has to be specified in order for it to work.

````html
<a href="#" fa-toggle="pageModal">Toggle Modal</a>
<fa-modal id="pageModal"></fa-modal>
````

####Accordion

Structure:

````html
<fa-accordion-set>
  <fa-accordion
    title="Input your title here">
    Content goes here
  </fa-accordion>
</fa-accordion-set>
````

####Interchange
Interchange allows you to specify what specific content to view based on a media query. The last query to match will be shown.

Because of some cool angular features, you're welcome to either specify the content right away (without including `src`) or, you can specify a partial to be loaded. Loading is done lazily, meaning that even with 20 different `fa-source` declarations, only the correct one will load for the current media query. So if you're on mobile, only the mobile partial will load up.

Note that partials do not get RELOADED, meaning that as long as the user is on the page, the various partials will be cached.

Structure:

````html
<fa-interchange>
  <div fa-source media="media type such as 'small'" src="/path/to/partial"></div>
  <div fa-source media="large">
    Page template
  </div>
</fa-interchange>

````

####Modal
The modal does not require any specific content within it; however, the example includes some options, including a a footer, main content block, and a close button.

Structure:

````html
<fa-modal id="pageModal">
  <a href="#" fa-close>&times;</a>
  <section class="content block">
    content goes here
  </section>
  <footer class="content block menu-bar">
    <span class="button" fa-close>Ok</span>
    <span class="button" fa-close>Cancel</span>
  </footer>
<fa-modal>
````

####Notification
