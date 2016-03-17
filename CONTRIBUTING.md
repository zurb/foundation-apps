# Contribute to Foundation for Apps

ZURB loves its community! We always want to hear from our users, whether they're reporting bugs, suggesting new features, or even adding them themselves.

## Reporting Bugs

[Open a new issue](https://github.com/zurb/foundation-apps/issues/new) to report a problem you're having with Foundation for Apps. When writing your issue, keep these things in mind:

 - **Be descriptive.** If you can, upload a screenshot of problem you're having, or copy and paste any JavaScript or command line errors you encounter. Being detailed will help us hone in on the problem faster.
 - **Post your code.** It's very helpful to see any HTML, Sass, or JavaScript you've written that you think may be causing the problem. In some cases, we might be able to fix your problem just by fixing your code.
 - **Help us recreate it.** If your problem is complex, tell us the steps needed to recreate the issue. Sometimes we need to see the problem for ourselves, in our own web browsers, so we can more easily debug it.

## Submitting Pull Requests

If you think you can solve a problem yourself, or want to implement a new feature, go for it! Follow these guidelines to make the most killer PR ever.

 - **Test, test, and test.** The Foundation frameworks are used by thousands and thousands of designers and developers, so making sure your changes work in every browser is important! Foundation for Apps is officially supported on:
   - Newest Chrome
   - Newest Firefox
   - Safari 7+
   - Internet Explorer 10+
   - Mobile Safari 7+
   - Android Browser 4+
 - **When changing or adding Sass code, follow these steps:**
   - If you change anything about the settings variables for a component, run `gulp sass:settings` to generate a new settings file.
   - If you add a new variable, follow our [rules for variable names](https://github.com/zurb/foundation-apps/wiki/Variable-Naming).
   - If you change a mixin's parameters, find the component's mixin documentation and change the parameters there as well.