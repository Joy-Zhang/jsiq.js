var test_data = [{"sid":6,"name":"zhao"},
                 {"sid":1,"name":"qian"},
                 {"sid":5,"name":"sun"},
                 {"sid":7,"name":"li"},
                 {"sid":3,"name":"go"}];
JSIQ.import("test_data", test_data);


test("select and where test", function() {
    var small = [1, 2, 3, 4, 5];
    var result = JSIQ.from(small).where(function(x){return x>2;}).select(function(x){return x*x}).all();
    deepEqual(result, [9,16,25], "Passed");
});


test("order test", function() {

    var expected_data = [{"sid":1,"name":"qian"},
                         {"sid":3,"name":"go"},
                         {"sid":5,"name":"sun"},
                         {"sid":6,"name":"zhao"},
                         {"sid":7,"name":"li"}];

    var result = JSIQ.from(test_data).orderBy(function(i){return i.sid}, JSIQ.ascending).all();
    deepEqual(result, expected_data, "Passed");
});

test("query string test", function() {

    var result1 = JSIQ.query("select i.sid from i in test_data where i.name === 'li'");
    var result2 = JSIQ.query("select i.sid from i in test_data where i.sid < 4");
    deepEqual(result1, [7], "Passed");
    deepEqual(result2, [1, 3], "Passed");
});

test("import array test", function() {
    var result1 = JSIQ.query("select i.sid from i in test_data where i.name === 'li'");
    var result2 = JSIQ.query("select i.sid from i in test_data where i.sid < 4");
    deepEqual(result1, [7], "Passed");
    deepEqual(result2, [1, 3], "Passed");
});


test("query order by test", function() {
    var expected_data = [{"sid":1,"name":"qian"},
                         {"sid":3,"name":"go"},
                         {"sid":5,"name":"sun"},
                         {"sid":6,"name":"zhao"},
                         {"sid":7,"name":"li"}];

    var result = JSIQ.query("select i from i in test_data order by i.sid");
    deepEqual(result, expected_data, "Passed");
});

test("long query test", function() {

    var expected_data = [{"sid":5,"name":"sun"},
                         {"sid":6,"name":"zhao"},
                         {"sid":7,"name":"li"}];

    var result = JSIQ.query("select i from i in test_data where i.sid > 4 order by i.sid");
    deepEqual(result, expected_data, "Passed");

});

test("join test", function() {
    var supervisor = [{"sid":1, "name":"xu"},
                      {"sid":7, "name":"li"},
                      {"sid":5, "name":"luo"},];
    var result = JSIQ.from(test_data).from(supervisor).where(function(st, sv) {
        return st.sid===sv.sid
    }).orderBy(function(st, sv){
        return st.sid;
    }).select(function(st, sv) {
        return {"stuname": st.name,"svname":sv.name};
    }).all();
    var expected_data = [{"stuname": "qian","svname":"xu"},
                         {"stuname": "sun","svname":"luo"},
                         {"stuname": "li","svname":"li"}];
    deepEqual(result, expected_data, "Passed");
});

test("multi-order test", function(){
    var grade = [{"id":1,"ch":95,"ma":92},
                 {"id":3,"ch":94,"ma":97},
                 {"id":4,"ch":93,"ma":91},
                 {"id":5,"ch":96,"ma":91},
                 {"id":2,"ch":96,"ma":95}];

    var expected = [{"total":191,"ma":97},{"total":191,"ma":95},{"total":187,"ma":92},{"total":187,"ma":91},{"total":184,"ma":91}];

    JSIQ.import("grade", grade);
    var result = JSIQ.query('select {"total":i.ch+i.ma,"ma":i.ma} from i in grade order by i.ch+i.ma descending,i.ma descending');

    deepEqual(result, expected, "Passed");
});
