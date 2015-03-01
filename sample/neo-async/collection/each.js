function each(collection, iterator, callback, thisArg) {

  "<%= callback_init %>";
  "<%= init_each %>";
  "<%= bindToIterator %>";

  if ("<%= collection_check_array %>") {
    "<%= collection_size_array %>";
    if ("<%= collection_check_size %>") {
      return "<%= callback_none %>";
    }
    "<%= collection_each_array %>";
  } else if ("<%= collection_check_object %>") {
    "<%= collection_size_object %>";
    if ("<%= collection_check_size %>") {
      return "<%= callback_none %>";
    }
    "<%= collection_each_object %>";
  } else {
    "<%= callback_none %>";
  }

  "<%= collection_iterator_each %>"

  "<%= collection_each_done %>"
}
