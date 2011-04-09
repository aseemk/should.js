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


More ideas
----------

In no particular order, more things I'd like to add:

* The holy grail: support a much more flexible language by having everything
  support being both a dummy getter and an assertion method that can be called.
  E.g. `be` in both `foo.should.be(bar)` and `foo.should.be.a('string')`.

* More and smarter aliases. E.g. `a` and `an` (assuming both were flexible as
  described above) should cover both the `typeof` and `instanceof` cases, just
  based on whether the argument is a string or (constructor) function.

* A static `should.be.defined(foo)` for when null is ok but undefined is not.
  (I'm wanting this right now on a project.)

* Monkey-patch the static `should.equal()`, AKA the native `assert.equal()`, to
  use strict equality, to match the instance `foo.should.equal(bar)`.

* Improve the custom message support to still inspect and output the expected and
  actual values, in addition to my custom message, in a nice format.

If you would especially like to see any of these things, just let me know.
