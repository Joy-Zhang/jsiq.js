test("select test", function(){
    var small = [1, 2, 3, 4, 5];
    var result = JSIQ.from(small).where(function(x){return x>2;}).select(function(x){return x*x}).all();
    deepEqual(result, [9,16,25], "Passed");
});
var test_data = [{"sid":6,"name":"zhao"},
                 {"sid":1,"name":"qian"},
                 {"sid":5,"name":"sun"},
                 {"sid":7,"name":"li"},
                 {"sid":3,"name":"go"}];
JSIQ.import("test_data", test_data);



test("order test", function(){

    var expected_data = [{"sid":1,"name":"qian"},
                         {"sid":3,"name":"go"},
                         {"sid":5,"name":"sun"},
                         {"sid":6,"name":"zhao"},
                         {"sid":7,"name":"li"}];

    var result = JSIQ.from(test_data).orderBy(function(i){return i.sid}, JSIQ.ascending).all();
    deepEqual(result, expected_data, "Passed");
});

test("query string test", function(){

    var result1 = JSIQ.query("select i.sid from i in test_data where i.name === 'li'");
    var result2 = JSIQ.query("select i.sid from i in test_data where i.sid < 4");
    deepEqual(result1, [7], "Passed");
    deepEqual(result2, [1, 3], "Passed");
});

test("import array test", function(){
    var result1 = JSIQ.query("select i.sid from i in test_data where i.name === 'li'");
    var result2 = JSIQ.query("select i.sid from i in test_data where i.sid < 4");
    deepEqual(result1, [7], "Passed");
    deepEqual(result2, [1, 3], "Passed");
});


test("query order by test", function(){
    var expected_data = [{"sid":1,"name":"qian"},
                         {"sid":3,"name":"go"},
                         {"sid":5,"name":"sun"},
                         {"sid":6,"name":"zhao"},
                         {"sid":7,"name":"li"}];

    var result = JSIQ.query("select i from i in test_data order by i.sid");
    deepEqual(result, expected_data, "Passed");
});

test("long query test", function(){

    var expected_data = [{"sid":5,"name":"sun"},
                         {"sid":6,"name":"zhao"},
                         {"sid":7,"name":"li"}];

    var result = JSIQ.query("select i from i in test_data where i.sid > 4 order by i.sid");
    deepEqual(result, expected_data, "Passed");

});
