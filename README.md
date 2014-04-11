jsiq.js
=======

  A javascript query language used for querying javascript array.

Use
-------

  Assume there is an array a = [1, 2, 3, 4, 5];
  Before query it, this array need to be imported into JSIQ. Do this like:
    JSIQ.import("a", a);

  You can use jsiq.js through a query like:
    var result = JSIQ.query("select i * i from i in a where i > 3");
  The result variable will be [16, 25].
  The query style follows linq style. Because intellisense is not needed, the select clause is put in front.

  Like linq, calling the execution engine directly is allowed. The previous query can be executed like:
    JSIQ.from(a).where(function(i) { return i > 3; }).select(function(i) { return i * i; }).all();

  Please read the Supported Clauses section to know supported clauses at present.

Supported Clauses
-----------------

### select clause
  In a query, select clause is used to do some operation of parameter.
  If multiple items are seleted, you need to make it into a object (or array) like:
    JSIQ.query("select {"square" : i * i, "cube" : i * i * i} from i in a");

### from in clause
  In a query, from in clause specify the array to query and the parameter name of item in this array.
  This parameter can be used in other clauses.

### where clause
  In a query, where clause is used filter an array.


