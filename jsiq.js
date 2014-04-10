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

    var Query = function(list) {
        if(typeof(list) !== typeof([])) throw "Not array";

        var result = list;

        this.all = function(){
            return result;
        }

        this.where = function(predicate){
            if(typeof(predicate) !== typeof(Function)) return null;
            if(Array.prototype.filter !== undefined){
                result = result.filter(predicate);
                return this;
            }
            var tempResult = [];
            for(var index in result){
                var item = result[index];
                if(predicate(item))
                    tempResult.push(item);
            }
            result = tempResult;

            return this;
        }

        this.select = function(selector){
            if(typeof(selector) !== typeof(Function)) return null;
            var tempResult = [];
            for(var index in result){
                tempResult.push(selector(result[index]));
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
                tempOrder.push({"element":keySelector(result[index]),"index":index});
            tempOrder = tempOrder.sort(function(e1, e2){
                if(order.value === root.ascending.value)
                    return comparer(e1.element, e2.element);
                if(order.value, root.descending.value)
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

        var match = null;
        var selectPattern = /select\s+(.*)/;
        match = selectPattern.exec(query);
        if(match === null)
            return null;

        var fromPattern = /(.*\S)\s+from\s+(.*)/;
        query = match[1];
        match = fromPattern.exec(query);
        if(match === null)
            return null;

        clause.select = match[1];
        var inPattern = /(\S*)\s+in\s+(.*)/;
        query = match[2];
        match = inPattern.exec(query);
        if(match === null)
            return null;
        clause.parameter = match[1];

        var wherePattern = /(\S*)\s+where\s+(.*)/;
        query = match[2];
        match = wherePattern.exec(query);
        if(match === null) {
            match = /(\S*)/.exec(query);
            if(match === null)
                return null;
            clause.array = match[1];
            return clause;
        }
        clause.array = match[1];

        var orderByPattern = /(.*\S)\s+order by\s+(\S*)\s+(ascending|descending)?/;
        query = match[2];
        match = orderByPattern.exec(query);
        if(match === null) {
            match = /(.*\S)/.exec(query);
            if(match === null)
                return null;
            clause.where = match[1];
            return clause;
        }
        clause.where = match[1];
        clause.orderBy = match[2];
        clause.order = match[3];
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
        execution.where(new Function(clause.parameter, "return " + clause.where));
        execution.select(new Function(clause.parameter, "return " + clause.select));
        return execution.all();
    }



}).call(this);
