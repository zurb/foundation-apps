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


####Angular and UI Router Helpers

There are some nuances of Angular itself and some of the libraries Foundation for Apps includes and uses that can make prototyping easier and quicker. Here's a rundown of some of these tools:

**ui-sref**

Instead of using `<a href="/my/sub/page"></a>` in a page to access another page, it's common practice to use the router. Foundation for Apps uses UI Router for its routing which allows for named route references. For instance, let's say there is a page with this front matter:

````
name: mypage
url: my/sub/page
````

You can easily link to it like so:

````
<a ui-sref="mypage">my page</a>
````

`ui-sref` can also take in parameters for pages that accept parameters. Here's another example page that uses parameters:

````
name: inbox.message
url: inbox/:id
````

The page can be accessed via `<a ui-sref="inbox.message({ id: 5 })">5th messages</a>`.

**ui-sref-active**
Now let's say we want to create a menu of links and want to make sure that the active link gets an extra special class to indicate that it is, indeed, active. There are two very similar ways to do this. The first one is using `ui-sref-active`, you can place this directive on either the `ui-sref` element or on its parent. When active, it will add a class of your choosing:

````html
<ul>
  <li ui-sref-active="my-active-class"><a ui-sref="mypage">My page</a>
  <li ui-sref-active="my-active-class"><a ui-sref="myotherpage">My page</a>
</ul>
````

The other way is using `ui-sref-active-eq` which works almost the same with one difference. Whenever accessing a child page, the parent page will show up as active whenever using `ui-sref-active`. The `ui-sref-active-eq` is triggered ONLY when a specific page is triggered, no matter what their parent is.

In the previous example with inbox and inbox.message, the inbox page would show up as active with `ui-sref-active` when on the inbox.message page. With `ui-sref-active-eq`, inbox would show up as active only when specifically on the inbox page.

If none of this makes sense, stick with `ui-sref-active-eq`

####Custom Helpers

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

Please see documentation on the FoundationApi to learn how to open, close, toggle, and trigger other events programmatically.

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

####Actionsheet
Actionsheets allow users to specify some options on top of showing a regular actionsheet.

Using the most default settings, an actionsheet looks like this:

````html
<fa-action-sheet>
  <fa-as-button title="My button"></fa-as-button>
  <fa-as-content position="bottom">
    My content goes here
  </fa-as-content>
</fa-action-sheet>
````

To use a custom buttom, ammend the `fa-as-button` declaration with your custom HTML like so:

````html
<fa-as-button>my button goes here</fa-as-button>
````

There is also an option to remotely open an actionsheet; however, the actionsheet won't show up under the remote trigger but rather where it had already been placed.

````html
<a href="#" fa-toggle="my-actionsheet">toggle</a>
<fa-action-sheet id="my-actionsheet">
  <fa-as-button title="My button"></fa-as-button>
  <fa-as-content position="bottom">
    My content goes here
  </fa-as-content>
</fa-action-sheet>
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
<a href="#" fa-open="pageModal">Open modal</a>
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
There are two ways to access a notification. Via the static method and the programmatic method.

**Static Method**
The static method is best used for prototyping since it doesn't involve any programming.

````html
<a href="#" fa-open="my-notification">Static notification</a>
<fa-notification-static id="my-notify"
  title="My static notification">
  Content goes here
</fa-notification-static>
````

**Programmatic Method**
The FoundationApi service is a pretty useful service, one function of it is to send information from directives, controllers, and other parts to other directives, controllers, etc. It's a messaging system for the entire application.

To use it, create a notification set like so:

````html
<fa-notification-set id="main-notifications"></fa-notification-set>
````

And then send it a notification with via FoundationApi:

````js
foundationApi.publish('main-notifications', { title: 'Test', content: 'Test2' });
````

You can also use the `fa-notify` directive for simpler messages and prototyping:

````html
<a href="#" fa-notify title="Title of notification" content="Content of notification">Launch notification</a>
````

####Off Canvas

````html
<a href="#" fa-open="pageCanvas">open offcanvas</a>
<fa-offcanvas id="pageCanvas" position="right">
  <p>My content!</p>
</fa-offcanvas>
````

####Panel

````html
<a href="#" fa-open="pagePanel">open panel</a>
<fa-panel id="pagePanel" position="left"></fa-panel>
````

####Popup
Popups use a library called Tether. Tether attaches an element to another element with absolute positioning; however, there is one caveat. If your popup is nested within a scrollable area (not `body`) but it's not the immediate parent of that element, it will lose its positioning.

````html
<a href="#" fa-popup-toggle="popups">Open Popup</a>
<fa-popup
  title="My title"
  footer="Footer content"
  id="my-popup"
>Content goes here</fa-popup>
````

####Tabs
Tabs can get a little complicated; however, they also allow for meo flexibility. There are three ways to use tabs: default, displaced, and custom.

**default use**

````html
<fa-tabs>
  <fa-tab title="This is my tab">
    Tab content goes here
  </fa-tab>
  <fa-tab title="This is my tab">
    Tab content goes here
  </fa-tab>
</fa-tabs>
````

**displaced use**
Displaced tabs allow us to build tabs (tab navigation) and display the content elsewhere with `fa-tab-content`

````html
<fa-tabs id="displaced-tabs" displaced="true">
  <fa-tab title="This is my tab">
    Tab content goes here
  </fa-tab>
  <fa-tab title="This is my tab">
    Tab content goes here
  </fa-tab>
</fa-tabs>

<fa-tab-content target="displaced-tabs"></fa-tab-content>
````

**manual use**
Manual usage allows for custom styling and full versatility while retaining the basic functionality of the default tabs.

Here's what a custom menu may look like:

````html
<ul class="button-group" fa-tab-custom>
  <li fa-tab-href="tabOne">Tab One</li>
  <li fa-tab-href="tabTwo">Tab Two</li>
</ul>
````

The directives `fa-tab-custom` and `fa-tab-href` ensure typical tab button behavior where active tab button gets an `is-active` class. `fa-tab-href` should point to an ID of a tab.

````html
<div fa-tab-content-custom>
  <div id="tabOne">Content!</div>
  <div id="tabTwo">Second content!</div>
</div>
````

####FoundationApi

At the heart, most of the Foundation components use an Angular service called FoundationApi. The code itself is very simple but has some powerful applications.

The most used feature is its subscribe/publish system. Every single directive that can be "closed" subscribes itself to the subscribe/publish system under its ID and will perform specific tasks whenever someone publishes a message under that ID.

Here's an example:

````html
<!-- a directive placed in HTML -->
<fa-modal id="my-modal"></fa-modal>
````

The modal will automatically register itself as a subscriber in the FoundationApi under `my-modal`. The code for the directive indicates that it listens for 3 different messages: `open`, `close`, and `toggle` as well as aliases for the former two `show` and `hide`.

Sometimes, it's necessary to trigger a modal after some piece logic was satisfied. Whether the user scrolled past a certain point or some other action happened. Here's how to open our modal remotely:

````js
foundationApi.publish('my-modal', 'open');
````

Make sure to include FoundationApi as a dependency in the controller or wherever else you want to use it. The best bet to hooking into various directives is to check the code and see what each directive subscribes to.

In fact, the directives `fa-close`, `fa-open`, and `fa-toggle` are wrappers for FoundationApi events.
