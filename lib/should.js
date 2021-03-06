/*!
 * Should
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var util = require('util')
  , http = require('http')
  , assert = require('assert')
  , AssertionError = assert.AssertionError
  , statusCodes = http.STATUS_CODES
  , deepEqual = require('./deepEqual')
  , i = util.inspect;

/**
 * Expose assert as should.
 * 
 * This allows you to do things like below
 * without require()ing the assert module.
 *
 *    should.equal(foo.bar, undefined);
 *
 */

exports = module.exports = assert;

/**
 * Library version.
 */

exports.version = '0.3.2';

exports.fail = function(msg){
  throw new AssertionError({
      message: msg || 'failure'
    , stackStartFunction: exports.fail
  });
};

/**
 * Assert _obj_ exists, with optional message.
 *
 * @param {Mixed} obj
 * @param {String} msg
 * @api public
 */
 
exports.exist = function(obj, msg){
  if (null == obj) {
    throw new AssertionError({
        message: msg || ('expected ' + i(obj) + ' to exist')
    });
  }
};

/**
 * Asserts _obj_ does not exist, with optional message.
 *
 * @param {Mixed} obj
 * @param {String} msg
 * @api public
 */

exports.not = {};
exports.not.exist = function(obj, msg){
  if (null != obj) {
    throw new AssertionError({
        message: msg || (obj instanceof Error && obj.toString()) || ('expected ' + i(obj) + ' to not exist')
    });
  }
};

/**
 * Asserts _obj_ is defined, with optional message.
 *
 * @param {Mixed} obj
 * @param {String} msg
 * @api public
 */

exports.be = {};
exports.be.defined = function(obj, msg){
  if (undefined === obj) {
    throw new AssertionError({
        message: msg || ('expected ' + i(obj) + ' to be defined')
    });
  }
};

/**
 * Asserts _obj_ is undefined, with optional message.
 *
 * @param {Mixed} obj
 * @param {String} msg
 * @api public
 */

exports.be.undefined = function(obj, msg){
  if (undefined !== obj) {
    throw new AssertionError({
        message: msg || ('expected ' + i(obj) + ' to be undefined')
    });
  }
};

// Aliases for should.be.defined and should.be.undefined:
exports.not.be = {};
exports.not.be.defined = exports.be.undefined;
exports.not.be.undefined = exports.be.defined;

/**
 * Expose api via `Object#should`.
 *
 * @api public
 */

Object.defineProperty(Object.prototype, 'should', {
  set: function(){},
  get: function(){
    return new Assertion(this);
  },
  configurable: true
});

/**
 * Initialize a new `Assertion` with the given _obj_.
 *
 * @param {Mixed} obj
 * @api private
 */

var Assertion = exports.Assertion = function Assertion(obj) {
  this.obj = obj;
};

/**
 * Prototype.
 */

Assertion.prototype = {

  /**
   * HACK: prevents double require() from failing.
   */
  
  exports: exports,

  /**
   * Assert _expr_ with the given _msg_ and _negatedMsg_.
   *
   * @param {Boolean} expr
   * @param {String} msg
   * @param {String} negatedMsg
   * @api private
   */

  assert: function(expr, msg, defaultMsg, negatedMsg){
    var ok = this.negate ? !expr : expr;
    
    if (!msg) {
      msg = this.negate ? negatedMsg : defaultMsg;
    }
    
    if (!ok) {
      throw new AssertionError({
          message: msg
        , stackStartFunction: this.assert
      });
    }
  },

  /**
   * Dummy getter.
   *
   * @api public
   */
  
  get an() {
    return this;
  },
  
  /**
   * Dummy getter.
   *
   * @api public
   */
  
  get and() {
    return this;
  },
  
  /**
   * Dummy getter.
   *
   * @api public
   */
  
  get be() {
    return this;
  },

  /**
   * Dummy getter.
   *
   * @api public
   */
  
  get have() {
    return this;
  },
  
  /**
   * Dummy getter.
   *
   * @api public
   */
  
  get with() {
    return this;
  },
  
  /**
   * Inclusion modifier.
   *
   * @api public
   */
  
  get include() {
    this.includes = true;
    return this;
  },

  /**
   * Negation modifier.
   *
   * @api public
   */
  
  get not() {
    this.negate = true;
    return this;
  },
  
  /**
   * Get object inspection string.
   *
   * @return {String}
   * @api private
   */
  
  get inspect() {
    return i(this.obj);
  },

  /**
   * Assert instanceof `Arguments`.
   *
   * @api public
   */

  arguments: function(msg){
    this.assert(
        '[object Arguments]' == Object.prototype.toString.call(this.obj)
      , msg
      , 'expected ' + this.inspect + ' to be arguments'
      , 'expected ' + this.inspect + ' to not be arguments');
    return this;
  },

  /**
   * Assert that an object is empty aka length of 0.
   *
   * @api public
   */
  
  empty: function(msg){
    this.obj.should.have.property('length');
    this.assert(
        0 === this.obj.length
      , msg
      , 'expected ' + this.inspect + ' to be empty'
      , 'expected ' + this.inspect + ' not to be empty');
    return this;
  },

  /**
   * Assert truthfulness.
   *
   * @api public
   */
  
  truthy: function(msg){
    this.assert(
        this.obj
      , msg
      , 'expected ' + this.inspect + ' to be truthy'
      , 'expected ' + this.inspect + ' to be falsy');
    return this;
  },

  /**
   * Assert falseness.
   *
   * @api public
   */
  
  falsy: function(msg) {
    this.assert(
        !this.obj
      , msg
      , 'expected ' + this.inspect + ' to be falsy'
      , 'expected ' + this.inspect + ' to be truthy');
    return this;
  },
  
  /**
   * Assert true.
   *
   * @api public
   */
  
  true: function(msg){
    this.assert(
        true === this.obj
      , msg
      , 'expected ' + this.inspect + ' to be true'
      , 'expected ' + this.inspect + ' not to be true');
    return this;
  },
  
  /**
   * Assert false.
   *
   * @api public
   */
  
  false: function(msg){
    this.assert(
        false === this.obj
      , msg
      , 'expected ' + this.inspect + ' to be false'
      , 'expected ' + this.inspect + ' not to be false');
    return this;
  },
  
  /**
   * Assert deep equality. 
   *
   * @param {Mixed} val
   * @param {String} msg
   * @api public
   */
  
  mirror: function(val, msg){
    this.assert(
        deepEqual(val, this.obj)
      , msg
      , 'expected ' + this.inspect + ' to mirror ' + i(val)
      , 'expected ' + this.inspect + ' to not mirror ' + i(val));
    return this;
  },
  
  /**
   * Assert strict equal. 
   *
   * @param {Mixed} val
   * @param {String} msg
   * @api public
   */
  
  equal: function(val, msg){
    this.assert(
        val === this.obj
      , msg
      , 'expected ' + this.inspect + ' to equal ' + i(val)
      , 'expected ' + this.inspect + ' to not equal ' + i(val));
    return this;
  },
  
  /**
   * Assert within start to finish (inclusive). 
   *
   * @param {Number} start
   * @param {Number} finish
   * @param {String} msg
   * @api public
   */
  
  within: function(start, finish, msg){
    var range = start + '..' + finish;
    this.assert(
        this.obj >= start && this.obj <= finish
      , msg
      , 'expected ' + this.inspect + ' to be within ' + range
      , 'expected ' + this.inspect + ' to not be within ' + range);
    return this;
  },
  
  /**
   * Assert typeof. 
   *
   * @param {String} type
   * @param {String} msg
   * @api public
   */
  
  a: function(type, msg){
    this.assert(
        type == typeof this.obj
      , msg
      , 'expected ' + this.inspect + ' to be a ' + type
      , 'expected ' + this.inspect + ' not to be a ' + type);
    return this;
  },
  
  /**
   * Assert instanceof. 
   *
   * @param {Function} constructor
   * @param {String} msg
   * @api public
   */
  
  instanceof: function(constructor, msg){
    var name = constructor.name;
    this.assert(
        this.obj instanceof constructor
      , msg
      , 'expected ' + this.inspect + ' to be an instance of ' + name
      , 'expected ' + this.inspect + ' not to be an instance of ' + name);
    return this;
  },

  /**
   * Assert numeric value above _n_.
   *
   * @param {Number} n
   * @param {String} msg
   * @api public
   */
  
  above: function(n, msg){
    this.assert(
        this.obj > n
      , msg
      , 'expected ' + this.inspect + ' to be above ' + n
      , 'expected ' + this.inspect + ' to be below ' + n);
    return this;
  },
  
  /**
   * Assert numeric value below _n_.
   *
   * @param {Number} n
   * @param {String} msg
   * @api public
   */
  
  below: function(n, msg){
    this.assert(
        this.obj < n
      , msg
      , 'expected ' + this.inspect + ' to be below ' + n
      , 'expected ' + this.inspect + ' to be above ' + n);
    return this;
  },
  
  /**
   * Assert string value matches _regexp_, or
   * assert deep equality with _obj_.
   *
   * @param {Mixed} regexp or obj
   * @param {String} msg
   * @api public
   */
  
  match: function(arg, msg){
    var regexp, obj;
    if (arg instanceof RegExp) {
      regexp = arg;
      this.assert(
          regexp.exec(this.obj)
        , msg
        , 'expected ' + this.inspect + ' to match ' + regexp
        , 'expected ' + this.inspect + ' not to match ' + regexp);
    } else {
      obj = arg;
      this.assert(
          deepEqual(obj, this.obj)
        , msg
        , 'expected ' + this.inspect + ' to match ' + i(obj)
        , 'expected ' + this.inspect + ' to not match ' + i(obj));
    }
    return this;
  },
  
  /**
   * Assert property "length" exists and has value of _n_.
   *
   * @param {Number} n
   * @param {String} msg
   * @api public
   */
  
  length: function(n, msg){
    this.obj.should.have.property('length');
    var len = this.obj.length;
    this.assert(
        n == len
      , msg
      , 'expected ' + this.inspect + ' to have a length of ' + n + ' but got ' + len
      , 'expected ' + this.inspect + ' to not have a length of ' + len);
    return this;
  },
  
  /**
   * Assert substring.
   *
   * @param {String} str
   * @param {String} msg
   * @api public
   */

  string: function(str, msg){
    this.obj.should.be.a('string');
    this.assert(
        ~this.obj.indexOf(str)
      , msg
      , 'expected ' + this.inspect + ' to include ' + i(str)
      , 'expected ' + this.inspect + ' to not include ' + i(str));
    return this;
  },
  
  /*
   * Assert object exposes _name_ as a property or method.
   *
   * @param {String} name
   * @param {String} msg
   * @api public
   */
  
  expose: function(name, msg){
    this.assert(
        undefined !== this.obj[name]
      , msg
      , 'expected ' + this.inspect + ' to expose ' + i(name)
      , 'expected ' + this.inspect + ' to not expose ' + i(name));
    return this;
  },

  /**
   * Assert inclusion of object.
   *
   * @param {Object} obj
   * @param {String} msg
   * @api public
   */

  object: function(obj, msg){
    this.obj.should.be.a('object');
    var included = true;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && !deepEqual(obj[key], this.obj[key])) {
        included = false;
        break;
      }
    }
    this.assert(
        included
      , msg
      , 'expected ' + this.inspect + ' to include ' + i(obj)
      , 'expected ' + this.inspect + ' to not include ' + i(obj));
    return this;
  },

  /**
   * Assert property _name_ exists, with optional _val_.
   *
   * @param {String} name
   * @param {Mixed} val
   * @param {String} msg
   * @api public
   */
  
  property: function(name, val, msg){
    if (this.negate && undefined !== val) {
      // this.should.not.have.property('foo', 'bar')
      if (undefined === this.obj[name]) {
        // since this is not an assertion, not using custom message
        throw new Error(this.inspect + ' has no property ' + i(name));
      }
    } else {
      // this.should.have.property('foo')
      // this.should.have.property('foo, 'bar')
      // this.should.not.have.property('foo')
      this.assert(
          undefined !== this.obj[name]
        , msg
        , 'expected ' + this.inspect + ' to have a property ' + i(name)
        , 'expected ' + this.inspect + ' to not have a property ' + i(name));
    }
    
    if (undefined !== val) {
      // this.should.have.property('foo, 'bar')
      // this.should.not.have.property('foo')
      this.assert(
          val === this.obj[name]
        , msg
        , 'expected ' + this.inspect + ' to have a property ' + i(name)
          + ' of ' + i(val) + ', but got ' + i(this.obj[name])
        , 'expected ' + this.inspect + ' to not have a property ' + i(name) + ' of ' + i(val));
    }

    this.obj = this.obj[name];
    return this;
  },
  
  /**
   * Assert own property _name_ exists.
   *
   * @param {String} name
   * @param {String} msg
   * @api public
   */
  
  ownProperty: function(name, msg){
    this.assert(
        this.obj.hasOwnProperty(name)
      , msg
      , 'expected ' + this.inspect + ' to have own property ' + i(name)
      , 'expected ' + this.inspect + ' to not have own property ' + i(name));
    return this;
  },

  /**
   * Assert that the array contains _obj_.
   *
   * @param {Mixed} obj
   * @param {String} msg
   * @api public
   */

  contain: function(obj, msg){
    this.obj.should.be.an.instanceof(Array);
    this.assert(
        ~this.obj.indexOf(obj)
      , msg
      , 'expected ' + this.inspect + ' to contain ' + i(obj)
      , 'expected ' + this.inspect + ' to not contain ' + i(obj));
    return this;
  },
  
  /**
   * Assert exact keys or inclusion of keys by using
   * the `.include` modifier.
   *
   * @param {Array|String ...} keys
   * @param {String} msg
   * @api public
   */
  
  keys: function(keys, msg){
    var str
      , ok = true;

    if (!(keys instanceof Array)) {
      keys = Array.prototype.slice.call(arguments);
      msg = '';     // custom message not supported with varargs
    }

    if (!keys.length) throw new Error('keys required');

    var actual = Object.keys(this.obj)
      , len = keys.length;

    // Inclusion
    ok = keys.every(function(key){
      return ~actual.indexOf(key);
    });

    // Strict
    if (!this.negate && !this.includes) {
      ok = ok && keys.length == actual.length;
    }

    // Key string
    if (len > 1) {
      keys = keys.map(function(key){
        return i(key);
      });
      var last = keys.pop();
      str = keys.join(', ') + ', and ' + last;
    } else {
      str = i(keys[0]);
    }

    // Form
    str = (len > 1 ? 'keys ' : 'key ') + str;

    // Have / include
    str = (this.includes ? 'include ' : 'have ') + str;

    // Assertion
    this.assert(
        ok
      , msg
      , 'expected ' + this.inspect + ' to ' + str
      , 'expected ' + this.inspect + ' to not ' + str);

    return this;
  },

  /**
   * Assert that _method_ is a function.
   *
   * @param {String} method
   * @param {String} msg
   * @api public
   */

  respondTo: function(method, msg){
    this.assert(
      'function' == typeof this.obj[method]
      , msg
      , 'expected ' + this.inspect + ' to respond to ' + method + '()'
      , 'expected ' + this.inspect + ' to not respond to ' + method + '()');
    return this;
  },
  
  /**
   * Assert that header `field` has the given `val`. 
   *
   * @param {String} field
   * @param {String} val
   * @param {String} msg
   * @return {Assertion} for chaining
   * @api public
   */

  header: function(field, val, msg){
    this.obj.should.have.property('headers');
    this.obj.headers.should.have.property(field.toLowerCase(), val, msg);
    return this;
  },
  
  /**
   * Assert `.statusCode` of `code`.
   *
   * @param {Number} code
   * @param {String} msg
   * @return {Assertion} for chaining
   * @api public
   */

  status:  function(code, msg){
    this.obj.should.have.property('statusCode');
    var status = this.obj.statusCode;

    this.assert(
        code == status
      , msg
      , 'expected response code of ' + code + ' ' + i(statusCodes[code])
        + ', but got ' + status + ' ' + i(statusCodes[status])
      , 'expected to not respond with ' + code + ' ' + i(statusCodes[code]));

    return this;
  }
};

/**
 * Aliases.
 */

(function alias(name, as){
  Assertion.prototype[as] = Assertion.prototype[name];
  return alias;
})
('truthy', 'ok')
('equal', 'exactly')
('mirror', 'eql')
('length', 'lengthOf')
('keys', 'key')
('ownProperty', 'haveOwnProperty')
('above', 'greaterThan')
('below', 'lessThan');

