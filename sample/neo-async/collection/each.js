function each(collection, iterator, callback, thisArg) {

  "<%= callback_init %>";
  "<%= each_init %>";
  "<%= bindToIterator %>";

  if ("<%= collection_check_array %>") {
    "<%= collection_size_array %>";
    if ("<%= collection_check_size %>") {
      return "<%= callback_none %>";
    }
    "<%= each_array %>";
  } else if ("<%= collection_check_object %>") {
    "<%= collection_size_object %>";
    if ("<%= collection_check_size %>") {
      return "<%= callback_none %>";
    }
    "<%= each_object %>";
  } else {
    "<%= callback_none %>";
  }

  "<%= each_iterator %>"

  "<%= each_done %>"
}
