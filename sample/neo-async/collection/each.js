function each(collection, iterator, callback, thisArg) {

  "<%= callback %>";
  "<%= init_each %>";
  "<%= bindToIterator %>";

  if ("<%= collection_check_array %>") {
    "<%= collection_size_array %>";
    if (!size) {
      return callback();
    }
    _arrayEach(collection, iterate);
  } else if ("<%= collection_check_object %>") {
    "<%= collection_size_object %>";
    if ("<%= collection_check_size %>") {
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
