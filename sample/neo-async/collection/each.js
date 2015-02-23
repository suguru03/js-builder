function each(collection, iterator, callback, thisArg) {

  "<%= callback %>";
  "<%= each_init %>";
  "<%= bindToIterator %>";

  if (Array.isArray(collection)) {
    size = collection.length;
    if (!size) {
      return callback();
    }
    _arrayEach(collection, iterate);
  } else if (collection && typeof collection === 'object') {
    var keys = Object.keys(collection);
    size = keys.length;
    if (!size) {
      return callback();
    }
    _objectEach(collection, iterate, keys);
  } else {
    callback();
  }

  function iterate(item) {
    _iterator(item, once(done));
  }

  function done(err, bool) {
    if (err) {
      callback(err);
      callback = noop;
      return;
    }
    if (bool === false) {
      callback();
      callback = noop;
      return;
    }
    if (++completed === size) {
      callback();
      callback = noop;
    }
  }

}
