function eachSeries(collection, iterator, callback, thisArg) {

  "<%= callback_init %>";
  "<%= eachSeries_init %>";
  "<%= bindToIterator %>";

  if ("<%= collection_check_array %>") {
    "<%= collection_size_array %>";
    if ("<%= collection_check_size %>") {
      return "<%= callback_none %>";
    }
    "<%= eachSeries_array %>";
  } else if ("<%= collection_check_object %>") {
    "<%= collection_size_object %>";
    if ("<%= collection_check_size %>") {
      return "<%= callback_none %>";
    }
    "<%= eachSeries_object %>";
  } else {
    "<%= callback_none %>";
  }
  iterate();

  "<%= eachSeries_done %>"
}
