Notify.js
=========

[![Build Status](https://travis-ci.org/alexgibson/notify.js.png?branch=master)](https://travis-ci.org/alexgibson/notify.js)

A handy wrapper for using the [Web Notifications API](http://www.w3.org/TR/notifications/). Notify.js aims to simplify requesting user permission and associated Web Notification API events, as well as providing a few extra callbacks and convenience methods.

Installation
---------------------------------------

* Download: [zip](https://github.com/alexgibson/notify.js/zipball/master)
* [NPM](https://www.npmjs.org/): `npm install notifyjs`
* [Bower](https://github.com/twitter/bower/): `bower install notify.js`
* Git: `git clone https://github.com/alexgibson/notify.js`

Setup
---------

This component can be used as an AMD module, CommonJS module, or a global.

### for AMD module:
```
var Notify = require('notify');
```

### for CommonJS:
```
var Notify = require('notifyjs');
```

To initialize a web notification create a new `Notify` instance, passing the message `title` as well as any other options you wish to use.

```
var myNotification = new Notify('Yo dawg!', {
	body: 'This is an awesome notification',
	notifyShow: onNotifyShow
});

function onNotifyShow() {
	console.log('notification was shown!');
}
```

Then show the notification.

```
myNotification.show();
```

Required parameters
-------------------

* title (string) - notification title

Optional parameters
-------------------

* body: (string) - notification message body
* icon: (string) - path for icon to display in notification
* tag: (string) - unique identifier to stop duplicate notifications
* timeout: (integer) - number of seconds to close the notification automatically
* notifyShow: (function) - callback when notification is shown
* notifyClose: (function) - callback when notification is closed
* notifyClick: (function) - callback when notification is clicked
* notifyError: (function) - callback when notification throws an error
* permissionGranted: (function) - callback when user has granted permission
* permissionDenied: (function) - callback when user has denied permission

Static methods and properties
-----------------------------

* `Notify.requestPermission()` - requests permission from the user if needed and handles permission callbacks.
* `Notify.isSupported` - Boolean property to test for Web Notifications API browser support
* `Notify.needsPermission` - Boolean property to check if permission is needed for the user to receive notifications.

A note about Chrome
-------------------

Unlike other browsers that implement the Web Notification API, Chrome does not permit requesting permission on page load (it must be as a result of user interaction, such as a `click` event). You can find out more in the [Chromium bug for this issue](https://code.google.com/p/chromium/issues/detail?id=274284).

Testing
-------

Install [Node](http://nodejs.org). Testing relies on the Karma test-runner, which can be installed globally using the following command.

```
npm install -g karma
```

In the project root, to perform a single pass of the tests using Firefox run:

```
npm test
```

Browser support
---------------------------------------

- Chrome (desktop)
- Safari
- Firefox
- Firefox OS (v1.2+)
- Firefox Mobile (Android)
