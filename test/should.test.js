
/**
 * Module dependencies.
 */

var should = require('../');

function err(fn, msg) {
  var error;
  try {
    fn();
  } catch (err) {
    error = err;
    should.exist(err.message);
    err.message.should.equal(msg);
  }
  if (!error) {
    should.fail('expected an error');
  }
}

module.exports = {
  'test .version': function(){
    should.version.should.match(/^\d+\.\d+\.\d+$/);
  },

  'test double require': function(){
    require('should').should.equal(should);
  },

  'test assertion': function(){
    'test'.should.be.a.string;
    should.equal('foo', 'foo');
    
    err(function(){
      should.fail('custom failure message');
    }, 'custom failure message');
  },
  
  'test existence': function(){
    should.exist('test');
    should.exist(0);
    should.exist('');
    
    should.not.exist(null);
    should.not.exist(undefined);
    
    err(function(){
      should.exist(null);
    }, "expected null to exist");
    
    err(function(){
      should.not.exist(false);
    }, "expected false to not exist");
    
    err(function(){
      should.not.exist('', 'test assertion message!');
    }, 'test assertion message!');
    
    err(function(){
      try {
        foo.bar;
      } catch (e) {
        should.not.exist(e);
      }
    }, 'ReferenceError: foo is not defined');
  },
  
  'test [un]defined': function(){
    should.be.defined('test');
    should.be.defined(0);
    should.be.defined(null);
    
    should.not.be.defined(undefined);
    
    should.not.be.undefined('test');
    should.not.be.undefined(false);
    should.not.be.undefined('');
    
    should.be.undefined(undefined);
    
    err(function(){
      should.be.defined(undefined);
    }, 'expected undefined to be defined');
    
    err(function(){
      should.not.be.defined(null);
    }, 'expected null to be undefined');
    
    err(function(){
      should.not.be.defined(false, 'test assertion message');
    }, 'test assertion message');
    
    err(function(){
      should.be.undefined(null);
    }, 'expected null to be undefined');
    
    err(function(){
      should.not.be.undefined(undefined);
    }, 'expected undefined to be defined');
    
    err(function(){
      should.be.undefined({}, 'test assertion message');
    }, 'test assertion message');
  },
  
  'test true': function(){
    true.should.be.true();
    false.should.not.be.true();
    (1).should.not.be.true();
    
    err(function(){
      'test'.should.be.true();
    }, "expected 'test' to be true")
  },
  
  'test truthy': function(){
    true.should.be.truthy();
    false.should.not.be.truthy();
    (1).should.be.truthy();
    (0).should.not.be.truthy();
    
    err(function(){
      ''.should.be.truthy();
    }, "expected '' to be truthy");
    
    err(function(){
      'test'.should.not.be.truthy();
    }, "expected 'test' to be falsy");
  },
  
  'test ok': function(){
    true.should.be.ok();
    false.should.not.be.ok();
    (1).should.be.ok();
    (0).should.not.be.ok();
    
    err(function(){
      ''.should.be.ok();
    }, "expected '' to be truthy");
    
    err(function(){
      'test'.should.not.be.ok();
    }, "expected 'test' to be falsy");
  },
  
  'test false': function(){
    false.should.be.false();
    true.should.not.be.false();
    (0).should.not.be.false();
    
    err(function(){
      ''.should.be.false();
    }, "expected '' to be false")
  },
  
  'test falsy': function(){
    false.should.be.falsy();
    true.should.not.be.falsy();
    (0).should.be.falsy();
    (1).should.not.be.falsy();
    
    err(function(){
      'test'.should.be.falsy();
    }, "expected 'test' to be falsy");
    
    err(function(){
      ''.should.not.be.falsy();
    }, "expected '' to be truthy");
  },
  
  'test arguments': function(){
    var args = (function(){ return arguments; })(1,2,3);
    args.should.be.arguments();
    [].should.not.be.arguments();
  },
  
  'test .equal()': function(){
    var foo;
    should.equal(undefined, foo);
  },
  
  'test typeof': function(){
    'test'.should.be.a('string');

    err(function(){
      'test'.should.not.be.a('string');
    }, "expected 'test' not to be a string");
    
    (5).should.be.a('number');

    err(function(){
      (5).should.not.be.a('number');
    }, "expected 5 not to be a number");
  },
  
  'test instanceof': function(){
    function Foo(){}
    new Foo().should.be.an.instanceof(Foo);

    err(function(){
      (3).should.an.instanceof(Foo);
    }, "expected 3 to be an instance of Foo");
  },
  
  'test within(start, finish)': function(){
    (5).should.be.within(5, 10);
    (5).should.be.within(3,6);
    (5).should.be.within(3,5);
    (5).should.not.be.within(1,3);
    
    err(function(){
      (5).should.not.be.within(4,6);
    }, "expected 5 to not be within 4..6");
    
    err(function(){
      (10).should.be.within(50,100);
    }, "expected 10 to be within 50..100");
  },
  
  'test above(n)': function(){
    (5).should.be.above(2);
    (5).should.be.greaterThan(2);
    (5).should.not.be.above(5);
    (5).should.not.be.above(6);

    err(function(){
      (5).should.be.above(6);
    }, "expected 5 to be above 6");
    
    err(function(){
      (10).should.not.be.above(6);
    }, "expected 10 to be below 6");
  },
  
  'test match(regexp)': function(){
    'foobar'.should.match(/^foo/)
    'foobar'.should.not.match(/^bar/)
    
    err(function(){
      'foobar'.should.match(/^bar/i)
    }, "expected 'foobar' to match /^bar/i");
    
    err(function(){
      'foobar'.should.not.match(/^foo/i)
    }, "expected 'foobar' not to match /^foo/i");
  },
  
  'test match(obj)': function(){
    ({ foo: 'bar' }).should.match({ foo: 'bar' });
    [1,2,3].should.not.match([4,5,6]);
    
    // string to non-regexp should work
    'test'.should.match('test');
    '4'.should.not.match(4);
    
    err(function(){
      (4).should.mirror(3);
    }, 'expected 4 to mirror 3');
    
    err(function(){
      "foobar".should.match("foo");
    }, "expected 'foobar' to match 'foo'");
  },
  
  'test length(n)': function(){
    'test'.should.have.length(4);
    'test'.should.not.have.length(3);
    [1,2,3].should.have.length(3);
    
    err(function(){
      (4).should.have.length(3);
    }, 'expected 4 to have a property \'length\'');
    
    err(function(){
      'asd'.should.not.have.length(3);
    }, "expected 'asd' to not have a length of 3");
  },
  
  'test eql(val)': function(){
    'test'.should.eql('test');
    ({ foo: 'bar' }).should.eql({ foo: 'bar' });
    (1).should.eql(1);
    '4'.should.not.eql(4);
    
    err(function(){
      (4).should.eql(3);
    }, 'expected 4 to mirror 3');
  },
  
  'test mirror(val)': function(){
    'test'.should.mirror('test');
    (1).should.mirror(1);
    '4'.should.not.mirror(4);
    
    ({ foo: 'bar' }).should.mirror({ foo: 'bar' });
    [1,2,3].should.match([1,2,3]);
    
    ({ foo: 'bar' }).should.not.match({ foo: 'baz' });
    [1,2,3].should.not.match([4,5,6]);
    
    err(function(){
      (4).should.mirror(3);
    }, 'expected 4 to mirror 3');
    
    err(function(){
      [1,2,3].should.mirror([4,5,6]);
    }, 'expected [ 1, 2, 3 ] to mirror [ 4, 5, 6 ]');
  },
  
  'test equal(val)': function(){
    'test'.should.equal('test');
    (1).should.equal(1);
    
    (1).should.not.equal(true);
    false.should.not.equal(0);
    
    err(function(){
      (4).should.equal(3);
    }, 'expected 4 to equal 3');
    
    err(function(){
      '4'.should.equal(4);
    }, "expected '4' to equal 4");
  },
  
  'test exactly(val)': function(){
    'test'.should.be.exactly('test');
    (1).should.be.exactly(1);
    
    (1).should.not.be.exactly(true);
    false.should.not.be.exactly(0);
    
    err(function(){
      (4).should.be.exactly(3);
    }, 'expected 4 to equal 3');
    
    err(function(){
      '4'.should.be.exactly(4);
    }, "expected '4' to equal 4");
  },
  
  'test empty': function(){
    ''.should.be.empty();
    [].should.be.empty();
    ({ length: 0 }).should.be.empty();
    
    err(function(){
      ({}).should.be.empty();
    }, 'expected {} to have a property \'length\'');
    
    err(function(){
      'asd'.should.be.empty();
    }, "expected 'asd' to be empty");
    
    err(function(){
      ''.should.not.be.empty();
    }, "expected '' not to be empty");
  },
  
  'test property(name)': function(){
    'test'.should.have.property('length');
    (4).should.not.have.property('length');
    
    err(function(){
      'asd'.should.have.property('foo');
    }, "expected 'asd' to have a property 'foo'");
  },
  
  'test expose(name)': function(){
    'test'.should.expose('length');
    'asd'.should.expose('constructor');
    
    err(function(){
      'asd'.should.expose('foo');
    }, "expected 'asd' to expose 'foo'");
    
    [].should.expose('length');
    [].should.not.expose('0');
    
    [null].should.expose('0');
    ({bool: false}).should.expose('bool');
    
    'asd'.should.not.expose('foo');
    [null].should.not.expose('1');
    
    err(function(){
      [null].should.not.expose(0);
    }, "expected [ null ] to not expose 0")
  },
  
  'test property(name, val)': function(){
    'test'.should.have.property('length', 4);
    'asd'.should.have.property('constructor', String);
    
    err(function(){
      'asd'.should.have.property('length', 4);
    }, "expected 'asd' to have a property 'length' of 4, but got 3");
    
    err(function(){
      'asd'.should.not.have.property('length', 3);
    }, "expected 'asd' to not have a property 'length' of 3");
    
    err(function(){
      'asd'.should.have.property('foo');
    }, "expected 'asd' to have a property 'foo'");
    
    'asd'.should.not.have.property('foo');
    
    err(function(){
      'asd'.should.not.have.property('foo', 3);
    }, "'asd' has no property 'foo'");
    
    err(function(){
      'asd'.should.have.property('constructor', Number);
    }, "expected 'asd' to have a property 'constructor' of [Function: Number], but got [Function: String]");
  },
  
  'test ownProperty(name)': function(){
    'test'.should.have.ownProperty('length');
    'test'.should.haveOwnProperty('length');
    ({ length: 12 }).should.have.ownProperty('length');
    
    err(function(){
      ({ length: 12 }).should.not.have.ownProperty('length');
    }, "expected { length: 12 } to not have own property 'length'");
  },
  
  'test string()': function(){
    'foobar'.should.include.string('bar');
    'foobar'.should.include.string('foo');
    'foobar'.should.not.include.string('baz');

    err(function(){
      (3).should.include.string('baz');
    }, "expected 3 to be a string");
    
    err(function(){
      'foobar'.should.include.string('baz');
    }, "expected 'foobar' to include 'baz'");
    
    err(function(){
      'foobar'.should.not.include.string('bar');
    }, "expected 'foobar' to not include 'bar'");
  },

  'test object()': function(){
    var obj = {foo: 'bar', baz: {baaz: 42}, qux: 13};
    obj.should.include.object({foo: 'bar'});
    obj.should.include.object({baz: {baaz: 42}});
    obj.should.include.object({foo: 'bar', qux: 13});
    obj.should.not.include.object({foo: 'baz'});
    obj.should.not.include.object({foo: 'bar', baz: {baaz: -42}});

    err(function(){
      (3).should.include.object({foo: 'bar'});
    }, "expected 3 to be a object");

    err(function(){
      var obj = {foo: 'bar'};
      obj.should.include.object({foo: 'baz'});
    }, "expected { foo: 'bar' } to include { foo: 'baz' }");

    err(function(){
      var obj = {foo: 'bar'};
      obj.should.not.include.object({foo: 'bar'});
    }, "expected { foo: 'bar' } to not include { foo: 'bar' }");
  },
  'test contain()': function(){
    ['foo', 'bar'].should.contain('foo');
    ['foo', 'bar'].should.contain('foo');
    ['foo', 'bar'].should.contain('bar');
    [1,2].should.contain(1);
    ['foo', 'bar'].should.not.contain('baz');
    ['foo', 'bar'].should.not.contain(1);

    err(function(){
      ['foo'].should.contain('bar');
    }, "expected [ 'foo' ] to contain 'bar'");
    
    err(function(){
      ['bar', 'foo'].should.not.contain('foo');
    }, "expected [ 'bar', 'foo' ] to not contain 'foo'");
  },
  
  'test keys(array)': function(){
    ({ foo: 1 }).should.have.keys(['foo']);
    ({ foo: 1, bar: 2 }).should.have.keys(['foo', 'bar']);
    ({ foo: 1, bar: 2 }).should.have.keys('foo', 'bar');
    ({ foo: 1, bar: 2, baz: 3 }).should.include.keys('foo', 'bar');
    ({ foo: 1, bar: 2, baz: 3 }).should.include.keys('bar', 'foo');
    ({ foo: 1, bar: 2, baz: 3 }).should.include.keys('baz');

    ({ foo: 1, bar: 2 }).should.include.keys('foo');
    ({ foo: 1, bar: 2 }).should.include.keys('bar', 'foo');
    ({ foo: 1, bar: 2 }).should.include.keys(['foo']);
    ({ foo: 1, bar: 2 }).should.include.keys(['bar']);
    ({ foo: 1, bar: 2 }).should.include.keys(['bar', 'foo']);

    ({ foo: 1, bar: 2 }).should.not.have.keys('baz');
    ({ foo: 1, bar: 2 }).should.not.have.keys('foo', 'baz');
    ({ foo: 1, bar: 2 }).should.not.include.keys('baz');
    ({ foo: 1, bar: 2 }).should.not.include.keys('foo', 'baz');
    ({ foo: 1, bar: 2 }).should.not.include.keys('baz', 'foo');

    err(function(){
      ({ foo: 1 }).should.have.keys();
    }, "keys required");
    
    err(function(){
      ({ foo: 1 }).should.have.keys([]);
    }, "keys required");
    
    err(function(){
      ({ foo: 1 }).should.not.have.keys([]);
    }, "keys required");
    
    err(function(){
      ({ foo: 1 }).should.include.keys([]);
    }, "keys required");

    err(function(){
      ({ foo: 1 }).should.have.keys(['bar']);
    }, "expected { foo: 1 } to have key 'bar'");
    
    err(function(){
      ({ foo: 1 }).should.have.keys(['bar', 'baz']);
    }, "expected { foo: 1 } to have keys 'bar', and 'baz'");
    
    err(function(){
      ({ foo: 1 }).should.have.keys(['foo', 'bar', 'baz']);
    }, "expected { foo: 1 } to have keys 'foo', 'bar', and 'baz'");

    err(function(){
      ({ foo: 1 }).should.not.have.keys(['foo']);
    }, "expected { foo: 1 } to not have key 'foo'");
    
    err(function(){
      ({ foo: 1 }).should.not.have.keys(['foo']);
    }, "expected { foo: 1 } to not have key 'foo'");
    
    err(function(){
      ({ foo: 1, bar: 2 }).should.not.have.keys(['foo', 'bar']);
    }, "expected { foo: 1, bar: 2 } to not have keys 'foo', and 'bar'");
    
    err(function(){
      ({ foo: 1 }).should.not.include.keys(['foo']);
    }, "expected { foo: 1 } to not include key 'foo'");
    
    err(function(){
      ({ foo: 1 }).should.include.keys('foo', 'bar');
    }, "expected { foo: 1 } to include keys 'foo', and 'bar'");
  },
  
  'test respondTo(method)': function(){
    'test'.should.respondTo('toString');
    'test'.should.not.respondTo('toBuffer');
  },
  
  'test chaining': function(){
    var user = { name: 'tj', pets: ['tobi', 'loki', 'jane', 'bandit'] };
    user.should.have.property('pets').with.lengthOf(4);
 
    err(function(){
      user.should.have.property('pets').with.lengthOf(5);
    }, "expected [ 'tobi', 'loki', 'jane', 'bandit' ] to have a length of 5 but got 4");
 
    user.should.be.a('object').and.have.property('name', 'tj');
  },
  
  'test messages': function(){
    err(function(){
      false.should.be.truthy('false is most definitely not truthy');
    }, 'false is most definitely not truthy');
    
    err(function(){
      true.should.equal(1, 'strict equality');
    }, 'strict equality');
    
    err(function(){
      'hello'.should.match(/world/, 'regexp no match!');
    }, 'regexp no match!');
    
    err(function(){
      Function.should.not.respondTo('bind', 'yes it should');
    }, 'yes it should');
    
    err(function(){
      [1,2,3].should.expose(4, 'range error');
    }, 'range error');
    
    err(function(){
      [1,2,3].should.have.property('0', 0, 'zero-based indexing');
    }, 'zero-based indexing');
    
    err(function(){
      [1,2,3].should.not.have.property('0', 1, 'two wrongs a right do not make');
    }, 'two wrongs a right do not make');
    
    // note that this case should *not* use our custom message; it's an error.
    // TODO perhaps this behavior should change; this could be an assertion.
    err(function(){
      [1,2,3].should.not.have.property('3', 4, 'five-o hawaii');
    }, "[ 1, 2, 3 ] has no property '3'");
    
    err(function(){
      ({foo: 'bar'}).should.not.include.keys(['foo'], 'array message');
    }, 'array message');
    
    // note that this case should *not* use our custom message; variable number of keys.
    err(function(){
      ({foo: 'bar'}).should.have.keys('foo', 'varargs message');
    }, "expected { foo: 'bar' } to have keys 'foo', and 'varargs message'");
  }
};
