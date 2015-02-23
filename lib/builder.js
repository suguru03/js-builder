'use strict';

var fs = require('fs');
var _ = require('lodash');
var jsbeautifier = require('js-beautify').js_beautify;
var $n = '\n';

function Builder() {
  this._templates = {};
}

/**
 * Create child
 */
Builder.prototype.child = function() {
  var newBuilder = new Builder();
  newBuilder._parent = this;
  return newBuilder;
};

/**
 * TODO
 */
Builder.prototype.init = Builder.prototype.child;

/**
 * Set template function
 * @param {String|Object} key
 * @param {Function|String} func
 * @param {Boolean} usefunction - to use inner function
 */
Builder.prototype.setTemplate = function setTemplate(key, func, useFunction) {
  if (_.isObject(key)) {
    _.forEach(key, function(func, key) {
      setTemplate.call(this, key, func, useFunction);
    }, this);
    return this;
  }
  var tmp = _.isFunction(func) ? func.toString() : func;
  tmp = tmp.split($n);
  if (!useFunction && /function/.test(tmp[0])) {
    tmp.shift();
    while(tmp.length) {
      if (/}/.test(tmp.pop())) {
        break;
      }
    }
  }
  this._templates[key] = tmp;
  return this;
};

Builder.prototype.setFuncTemplate = function(key, func) {
  return this.setTemplate(key, func, true);
};

/**
 * Create template and not set to this
 */
Builder.prototype.createTemplate = function(func) {
  var self = {
    _templates: {}
  };
  var dummyKey = 'dummy';
  this.setTemplate.call(self, dummyKey, func);
  return self._templates[dummyKey].join($n);
};


Builder.prototype.base = function(func) {
  if (_.isFunction(func)) {
    var base = func.toString().split($n);
    this._base = base;
  } else {
    this._base = func.split($n);
  }
  return this;
};

/**
 * Create template after setTemplete
 */
Builder.prototype._createTemplate = function createTemplate() {
  var templates = this._base;
  this._compiled = _.map(templates, _.template);
  this._created = true;
  return this;
};

/**
 * create string of function
 */
Builder.prototype.create = function() {
  if (!this._base) {
    throw new Error('base is not set');
  }
  if (!this._created) {
    this._createTemplate();
  }
  var items = _.assign({}, this._items, this._templates);
  items = _.chain(this._templates)
    .transform(function(result, _templates, key) {
      result[key] = _.map(_templates, function(template) {
        return _.template(template)(items);
      }).join($n);
    }, items)
    .assign(items)
    .value();

  var compiled = this._compiled;
  var newFuncString = _.map(compiled, function(func) {
    return func(items);
  }).join($n);
  this._result = newFuncString;
  return this;
};


/**
 * Set items for template
 */
Builder.prototype.set = function set(items) {
  this._items = items;
  return this;
};

/**
 * Get own item or result
 */
Builder.prototype.get = function(key) {
  if (this[key]) {
    return this[key];
  }
  return this.create().getResult();
};

/**
 * get result
 */
Builder.prototype.getResult = function() {
  return this._result;
};

/**
 * Export to file
 * @param {String} filename
 * @param {String} encoding
 */
Builder.prototype.export = function(filepath, encoding) {
  if (!this._result) {
    throw new Error('new function is not created');
  }
  var encode = {
    encoding: encoding || 'utf8'
  };
  // TODO
  var opts = {
    indent_size: 2
  };
  var result = jsbeautifier(this._result, opts);
  fs.writeFileSync(filepath, result, encode);
  return this;
};

module.exports = new Builder();

