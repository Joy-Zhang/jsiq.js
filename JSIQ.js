var JSIQ = function(){



    this.from = function(list){
        return new JSIQ.Query(list);
    }

    var OrderEnum = function(value){
        this.value = value;
    }


    this.Order = {
        "ascending" : new OrderEnum("ascending"),
        "descending" : new OrderEnum("descending"),
        "equals" : function(o1, o2) {
                       return o1.value === o2.value;
                   }
    }

    this.Query = function(list){
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
                order = JSIQ.Order.ascending;
            if(!order instanceof OrderEnum) return null;

            if(comparer === undefined)
                comparer = defaultComparer;
            if(typeof(comparer) !== typeof(Function)) return null;


            var index;
            var tempOrder = [];
            for(index in result)
                tempOrder.push({"element":keySelector(result[index]),"index":index});
            tempOrder = tempOrder.sort(function(e1, e2){
                if(JSIQ.Order.equals(order, JSIQ.Order.ascending))
                    return comparer(e1.element, e2.element);
                if(JSIQ.Order.equals(order, JSIQ.Order.descending))
                    return -comparer(e1.element, e2.element);
            });
            var tempResult = [];
            for(index in tempOrder)
                tempResult.push(result[tempOrder[index].index]);
            result = tempResult;
            return this;
        }
    }

    this.query = function(query){

    }

};
JSIQ = new JSIQ();
