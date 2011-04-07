@aseemk's changes
=================

This is my fork of [@visionmedia]'s (TJ's) excellent **[should.js]** project.
I've extended it with the following features:

[@visionmedia]: https://github.com/visionmedia
[should.js]: https://github.com/visionmedia/should.js

* Static `should.exist()` and `should.not.exist()` methods to safely test whether
  something is defined or not.
  ([Pull request](https://github.com/visionmedia/should.js/pull/11) accepted and
  merged; thanks TJ!)

* Support for custom messages in the case of assertion failure, e.g.
  `foo.should.equal(bar, 'foo and bar should never diverge')`.
  ([Pull request](https://github.com/visionmedia/should.js/pull/13))

* Changed all assertion properties, e.g. `ok` and `empty`, to methods, e.g.
  `ok()` and `empty()`. This makes the assertions more explicit IMHO, but it also
  gives them support for custom messages.  **This is a breaking change.**
  ([Thoughts](https://github.com/visionmedia/should.js/issues/9) on making this
  change backwards-compatible, but no plans to do so yet; not submitted yet.)

* Aliases for a few methods that are more explicit and readable IMHO:
  
  * `truthy` instead of `ok`
  * `falsy` instead of `not.ok`
  * `match` (overloaded) and `mirror` instead of `eql` (deep equality)
  * `exactly` in addition to `equal` (strict equality)
  
  ([Thoughts](https://github.com/visionmedia/should.js/issues/10) on taking this
  further, but no plans to do so yet; not submitted yet.)

* Fixed the static `should.fail()` to properly use the passed-in message.
  This therefore also monkey-patches the native `assert.fail()`.
  ([Details](https://github.com/visionmedia/should.js/issues/12);
  submitted as part of the custom messages pull request.)

Major hat tip to TJ for the awesome and inspirational library.
