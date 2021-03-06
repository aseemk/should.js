_should_ is an expressive, readable, test framework agnostic, assertion library for [node](http://nodejs.org).
  
It extends the Object prototype with a single non-enumerable getter that allows you to express how that object should behave.

_should_ literally extends node's _assert_ module, in fact, it is node's assert module, for example `should.equal(str, 'foo')` will work, just as `assert.equal(str, 'foo')` would, and `should.AssertionError` **is** `asset.AssertionError`, meaning any test framework supporting this constructor will function properly with _should_.

## Example

    var user = {
        name: 'tj'
      , pets: ['tobi', 'loki', 'jane', 'bandit']
    };

    user.should.have.property('name', 'tj');
    user.should.have.property('pets').with.lengthOf(4)
    
    someAsyncTask(foo, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        result.bar.should.equal(foo, 'why the heck would they not be equal?!');
    });

## Installation

    $ npm install should

## assert extras

As mentioned above, _should_ extends node's _assert_. The returned object from `require('should')` is thus similar to the returned object from `require('assert')`, but it has one extra convenience method:

    should.exist('hello')
    should.exist([])
    should.exist(null)  // will throw

This is equivalent to `should.ok`, which is equivalent to `assert.ok`, but reads a bit better. It gets better, though:

    should.not.exist(false)
    should.not.exist('')
    should.not.exist({})    // will throw

We may add more _assert_ extras in the future... ;)

## modifiers

 _should_'s assertion chaining provides an expressive way to build up an assertion, along with dummy getters such as _an_, _have_, and _be_, provided are what I am simply calling **modifiers**, which have a meaning effect on the assertion. An example of this is the _not_ getter, which negates the meaning, aka `user.should.not.have.property('name')`. In the previous example note the use of _have_, as we could omit it and still construct a valid assertion.

Some modifiers such as _include_ only have an effect with specific assertion methods, for example when asserting a substring like so: `str.should.include.string('test')`, we could omit _include_, but it helps express the meaning, however _keys_ has a strict effect, unless the _include_ modifier is used.

## chaining assertions

Some assertions can be chained, for example if a property is volatile we can first assert property existence:

    user.should.have.property('pets').with.lengthOf(4)

which is essentially equivalent to below, however the property may not exist:

    user.pets.should.have.lengthOf(4)

our dummy getters such as _and_ also help express chaining:

    user.should.be.a('object').and.have.property('name', 'tj')

## messages

All assertion methods accept an optional message as the last parameter, which gets used instead of the default message in case the assertion fails.

    result.should.respondTo('serialize', 'Non-serializable result.')

There are two gotchas to be aware of:

    // to assert that foo has property bar with a custom message,
    // use expose() instead of property():
    foo.should.expose('bar', 'custom message')
    
    // to assert that foo has or includes one or more keys with a custom message,
    // pass the keys as an array instead of separate args:
    foo.should.include.keys(['bar'], 'custom message')

See _property_ and _keys_ for details.

## exist (static)

The returned object from `require('should')` is the same object as `require('assert')`. So you can use `should` just like `assert`:

    should.fail('expected an error!')
    should.strictEqual(foo, bar)

In general, using the Object prototype's _should_ is nicer than using these `assert` equivalents, because _should_ gives you access to the expressive and readable language described above:

    foo.should.equal(bar)   // same as should.strictEqual(foo, bar) above

The only exception, though, is when you can't be sure that a particular object exists. In that case, attempting to access the _should_ property may throw a TypeError:

    foo.should.equal(bar)   // throws if foo is null or undefined!

For this case, `require('should')` extends `require('assert')` with extra convenience methods to check whether an object exists or not:

    should.exist(foo)       // asserts that foo is not null or undefined
    should.not.exist(foo)

Once you know an object exists, you can safely use the _should_ property on it.

## defined (static)

If you only care to test whether an object is undefined (i.e. null is okay):

    should.be.defined(foo)
    should.be.undefined(foo)

Their negations are also available as aliases:

    should.not.be.defined(foo)      // alias for should.be.undefined
    should.not.be.undefined(foo)    // alias for should.be.defined

## truthy

Assert truthfulness:

    true.should.be.truthy()
    'yay'.should.be.truthy()
    (1).should.be.truthy()

Aliases: _ok_

## falsy

The negation of _truthy_:

    false.should.be.falsy()
    ''.should.be.falsy()
    (0).should.be.falsy()

Aliases: _not.ok_

## true

Assert === true:

    true.should.be.true()
    '1'.should.not.be.true()

## false

Assert === false:

     false.should.be.false()
     (0).should.not.be.false()

## arguments

Assert `Arguments`:

    var args = (function(){ return arguments; })(1,2,3);
    args.should.be.arguments();
    [].should.not.be.arguments();

## empty

Asserts that length is 0:

    [].should.be.empty()
    ''.should.be.empty()
    ({ length: 0 }).should.be.empty()

## mirror

deep equality:

    ({ foo: 'bar' }).should.mirror({ foo: 'bar' })
    [1,2,3].should.mirror([1,2,3])

Aliases: _match_ (overloaded), _eql_ (deprecated)

    ({ foo: 'bar' }).should.match({ foo: 'bar' })
    [1,2,3].should.eql([1,2,3])

## equal / exactly

strict equality:

    (4).should.equal(4)
    "4".should.not.equal(4)
    
    (1).should.not.equal(true)
    (0).should.not.equal(false)
    
    'test'.should.equal('test')
    [1,2,3].should.not.equal([1,2,3])

Aliases: _exactly_

    choice.should.be.exactly(false)
    output.should.be.exactly("0")

## within

Assert inclusive numeric range:

    user.age.should.be.within(5, 50)

## a

Assert __typeof__:

    user.should.be.a('object')
    'test'.should.be.a('string')

## instanceof

Assert __instanceof__:

    user.should.be.an.instanceof(User)
    [].should.be.an.instanceof(Array)

## above

Assert numeric value above the given value:

    user.age.should.be.above(5)
    user.age.should.not.be.above(100)

## below

Assert numeric value below the given value:

    user.age.should.be.below(100)
    user.age.should.not.be.below(5)

## match

Assert regexp match:

    username.should.match(/^\w+$/)

Alternately, assert deep equality (see _mirror_):

    ({ foo: 'bar' }).should.match({ foo: 'bar' })

## length

Assert _length_ property exists and has a value of the given number:

    user.pets.should.have.length(5)
    user.pets.should.have.a.lengthOf(5)

Aliases: _lengthOf_

## string

Substring assertion:

    'foobar'.should.include.string('foo')
    'foobar'.should.include.string('bar')
    'foobar'.should.not.include.string('baz')

## expose

Assert the object exposes a given property or method:

    user.should.expose('name')
    [1,2,3].should.expose('forEach')

This is similar to _property_, except it doesn't take an optional value, allowing you to more naturally pass a custom assertion message:

    arguments.should.expose('caller', 'are we in ES5 strict mode?')

## object

Assert inclusion of object:

    var obj = {foo: 'bar', baz: {baaz: 42}};
    obj.should.include.object({foo: 'bar'});
    obj.should.include.object({baz: {baaz: 42}});
    obj.should.not.include.object({foo: 'baz'});

## property

Assert property exists and has optional value:

    user.should.have.property('name')
    user.should.have.property('age', 15)
    user.should.not.have.property('rawr')
    user.should.not.have.property('age', 0)

Note that if you want to assert with a custom message, you _must_ pass a value. If you only want to assert that the property exists, use _expose_:

    // wrong: this will assert that foo.bar === 'custom message'
    foo.should.have.property('bar', 'custom message')
    
    // right: this will assert that foo.bar exists
    foo.should.expose('bar', 'custom message')

## ownProperty

Assert own property (on the immediate object):

    ({ foo: 'bar' }).should.have.ownProperty('foo')

## contain

Assert array value:

    [1,2,3].should.contain(3)
    [1,2,3].should.contain(2)
    [1,2,3].should.not.contain(4)

## keys

Assert own object keys, which must match _exactly_,
and will fail if you omit a key or two:

    var obj = { foo: 'bar', baz: 'raz' };
    obj.should.have.keys('foo', 'bar');
    obj.should.have.keys(['foo', 'bar']);

using the _include_ modifier, we can check inclusion of a key,
but not fail when we omit a few:

    obj.should.include.keys('foo')
    obj.should.include.keys('bar')
    obj.should.not.include.keys('baz')

Note that if you want to assert with a custom message, you must pass the keys as an array.

    // wrong: this will assert that foo has 'custom message' as a key
    foo.should.have.keys('bar', 'custom message')
    
    // right: this will assert that foo has the given keys
    foo.should.have.keys(['bar'], 'custom message')

## respondTo

Assert that the given property is a function:

    user.should.respondTo('email')

## Express example

For example you can use should with the [Expresso TDD Framework](http://github.com/visionmedia/expresso) by simply including it:

    var lib = require('mylib')
      , should = require('should');
  
    module.exports = {
      'test .version': function(){
        lib.version.should.match(/^\d+\.\d+\.\d+$/);
      }
    };

## Running tests

To run the tests for _should_ simple update your git submodules and run:

    $ make test

## OMG IT EXTENDS OBJECT???!?!@

Yes, yes it does, with a single getter _should_, and no it wont break your code, because it does this **properly** with a non-enumerable property.

## License 

(The MIT License)

Copyright (c) 2010-2011 TJ Holowaychuk &lt;tj@vision-media.ca&gt;  
Copyright (c) 2011 Aseem Kishore &lt;aseem.kishore@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
