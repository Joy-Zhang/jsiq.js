(function(){

    this.JSIQ = {};

    var root = this.JSIQ;

    var importedArrays = {};

    root.import = function(name, array) {
        importedArrays[name] = array;
    }

    root.from = function(list) {
        return new Query(list);
    }

    var Order = function(value) {
        this.value = value;
    }




    root.ascending = new Order("ascending");
    root.descending = new Order("descending");

    var Query = function(array) {
        if(typeof(array) !== typeof([])) throw "Not array";

        var result = [];
        for(var i in array)
            result.push([array[i]])



        this.all = function() {
            var unpack = [];
            for(var i in result) {
                if(result[i].length === 1)
                    unpack.push(result[i][0]);
                else
                    return null;
            }
            return unpack;
        }

        this.cross = function(array) {
            var tempResult = [];
            for(var i in result) {
                for(var j in array) {
                    var item = [];
                    for(var k in result[i])
                        item.push(result[i][k]);
                    item.push(array[j]);
                    tempResult.push(item);
                }
            }
            result = tempResult;
            return this;
        }

        this.from = this.cross;

        this.where = function(predicate){
            if(typeof(predicate) !== typeof(Function)) return null;

            var tempResult = [];
            for(var index in result){
                var item = result[index];
                if(predicate.apply(this, item))
                    tempResult.push(item);
            }
            result = tempResult;

            return this;
        }

        this.select = function(selector){
            if(typeof(selector) !== typeof(Function)) return null;
            var tempResult = [];
            for(var index in result) {
                tempResult.push([selector.apply(this, result[index])]);
            }
            result = tempResult;
            return this;
        }

        var defaultComparer = function(e1, e2){
            return e1 - e2;
        }


        this.orderBy = function(keySelector, order, comparer){
            if(typeof(keySelector) !== typeof(Function)) return null;

            if(order === undefined)
                order = root.ascending;
            if(!order instanceof Order) return null;

            if(comparer === undefined)
                comparer = defaultComparer;
            if(typeof(comparer) !== typeof(Function)) return null;


            var index;
            var tempOrder = [];
            for(index in result)
                tempOrder.push({"element":keySelector.apply(this, result[index]),"index":index});
            tempOrder = tempOrder.sort(function(e1, e2){
                if(order.value === root.ascending.value)
                    return comparer(e1.element, e2.element);
                if(order.value === root.descending.value)
                    return -comparer(e1.element, e2.element);
            });
            var tempResult = [];
            for(index in tempOrder)
                tempResult.push(result[tempOrder[index].index]);
            result = tempResult;
            return this;
        }
    }

    var analyzeClause = function(query) {
        var clause = {};
        var index = ["select", "parameter", "array", "where", "orderBy", "order"]


        var match = null;
        var selectPattern = /select\s+(.*)/;
        match = selectPattern.exec(query);
        if(match === null)
            return null;
        query = match[1];

        var fromPattern = /(.*\S)\s+from\s+(.*)/;
        match = fromPattern.exec(query);
        if(match === null)
            return null;
        clause[index.shift()] = match[1];
        query = match[2];

        var inPattern = /(\S*)\s+in\s+(.*)/;
        match = inPattern.exec(query);
        if(match === null)
            return null;
        clause[index.shift()] = match[1];
        query = match[2];

        var wherePattern = /(\S*)\s+where\s+(.*)/;
        match = wherePattern.exec(query);
        if(match !== null) {
            clause[index.shift()] = match[1];
            query = match[2];
        }
        else {
            index.splice(1, 1);//delete where
        }


        var orderByPattern = null;
        if(index[0] === "array")
            orderByPattern = /(\S*)\s+order by\s+(.*)/;
        else if(index[0] === "where")
            orderByPattern = /(.*\S)\s+order by\s+(.*)/
        /*
        if(index[current] === "array")
            orderByPattern = /(\S*)\s+order by\s+(\S*)\s+(ascending|descending)?/;
        else
            orderByPattern = /(.*\S)\s+order by\s+(\S*)\s+(ascending|descending)?/*/

        match = orderByPattern.exec(query);
        if(match !== null) {
            clause[index.shift()] = match[1];
            query = match[2];
        }
        else {
            index.splice(1, 2);
        }

        var endPattern = null;
        if(index[0] === "array")
            endPattern = /(\S*)/;
        else if(index[0] === "where")
            endPattern = /(.*\S)/
        else if(index[0] === "orderBy")
            endPattern = /(\S*)(?:\s+(ascending|descending))?/;
        match = endPattern.exec(query);
        if(match === null)
            return null;
        clause[index.shift()] = match[1];
        if(index[0] === "order")
            clause[index.shift()] = match[3];

        return clause;
    }

    root.query = function(query) {
        var clause = analyzeClause(query);
        if(clause === null)
            return null;
        var array = importedArrays[clause.array];
        if(array === undefined)
            array = eval(clause.array);
        var execution = new Query(array);
        if(clause.where !== undefined)
            execution.where(new Function(clause.parameter, "return " + clause.where));

        var order = undefined;
        if(clause.order === root.ascending.value)
            order = root.ascending;
        else if(clause.order === root.descending.value)
            order = root.descending;
        else if(clause.order === undefined)
            order = root.ascending;
        else
            return null;
        if(clause.orderBy !== undefined)
            execution.orderBy(new Function(clause.parameter, "return " + clause.orderBy), order);
        execution.select(new Function(clause.parameter, "return " + clause.select));
        return execution.all();
    }



}).call(this);
