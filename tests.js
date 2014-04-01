test("select test", function(){
    var test_data = [1, 2, 3, 4, 5];
    var result = JSIQ.from(test_data).where(function(x){return x>2;}).select(function(x){return x*x}).all();
    deepEqual(result, [9,16,25], "Passed");
});

test("order test", function(){
    var test_data = [{"sid":6,"name":"zhao"},
                     {"sid":1,"name":"qian"},
                     {"sid":5,"name":"sun"},
                     {"sid":7,"name":"li"},
                     {"sid":3,"name":"go"}];
    var expected_data = [{"sid":1,"name":"qian"},
                         {"sid":3,"name":"go"},
                         {"sid":5,"name":"sun"},
                         {"sid":6,"name":"zhao"},
                         {"sid":7,"name":"li"}];

    var result = JSIQ.from(test_data).orderBy(function(i){return i.sid}).all();
    deepEqual(result, expected_data, "Passed");
});
