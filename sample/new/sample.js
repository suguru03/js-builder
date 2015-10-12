(function() {

  'use strict';

  /**
   * サンプル
   */

  var root = this;
  var noop = function() {};
  var throwError = function() {
    throw new Error('Callback was already called.');
  };
  once(function() {
    noop(root);
    console.log('test');
  });
  function once(func) {
    return function(err, res) {
      if (func === null) {
        throwError();
      }
      func(err, res);
      func = null;
    };
  }
}).call(this);
