// Compute the solution cost.
function z(solutionArray, instance){
    var cost = 0;

    for(var j=0;j<instance.nCustomers;j++){
        cost += instance.costs[solutionArray[j]][j];
    }

    return cost;
}

// Returns true if the function is feasible, false otherwise.
function isFeasible(solutionArray, instance){

    var i,j;

    // Check if all the customers are served, and from one store.
    for(j=0;j<instance.nCustomers;j++){
        if(solutionArray[j]==undefined){
            warning("Customer "+j+" is not correctly served!");
            return false;
        }
    }

    // Check stores capacities
    var storeSum = new Array(instance.nStores);

    for(i=0;i<instance.nStores;i++){
        storeSum[i] = 0;
    }

    for(j=0;j<instance.nCustomers;j++){
        storeSum[solutionArray[j]] += instance.requests[solutionArray[j]][j];
    }

    for(i=0;i<instance.nStores;i++){
        if(storeSum[i] > instance.capacities[i]){
            warning("Store "+i+ " capacity is exceeded! ("+storeSum[i]+">"+instance.capacities[i]+")");
            return false;
        }
    }

    return true;
}

/*
 Check if a given object is a number.
 */
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Given a json object returns a javascript object representing the instance after checking that
 * there are no errors!
 *
 * @param data: the json object
 * @returns the instance object or undefined if there are errors
 */
function checkAndSetInstance(data) {

    var instance = {
        nStores: undefined,
        nCustomers: undefined,
        costs: undefined,
        requests: undefined,
        capacities: undefined
    };

    // setup nStores
    if (data.numfacilities == undefined || data.numfacilities <= 0 || !isNumber(data.numfacilities) || !Number.isInteger(data.numfacilities)) {
        error("numfacilities should be an integer value > 0");
        return undefined;
    } else {
        instance.nStores = data.numfacilities;
    }

    // setup nCustomers
    if (data.numcustomers == undefined || data.numcustomers <= 0 || !isNumber(data.numcustomers) || !Number.isInteger(data.numcustomers)) {
        error("numcustomers should be an integer value > 0");
        return undefined;
    } else {
        instance.nCustomers = data.numcustomers;
    }

    // setup costs
    instance.costs = new Array(instance.nStores);
    $.each(data.cost, function (i, array) {
        if (array == undefined) {
            error("cost should be a " + data.numfacilities + "x" + data.numcustomers + " matrix of numbers");
            return undefined;
        }

        instance.costs[i] = new Array(data.numcustomers);
        $.each(array, function (j, value) {
            if (value == undefined || !isNumber(value)) {
                error("cost should be a " + data.numfacilities + "x" + data.numcustomers + " matrix of numbers");
                return undefined;
            }
            instance.costs[i][j] = value;
        });
    });

    // setup requests
    instance.requests = new Array(instance.nStores);
    $.each(data.req, function (i, array) {
        if (array == undefined) {
            error("req should be a " + data.numfacilities + "x" + data.numcustomers + " matrix of numbers");
            return undefined;
        }
        instance.requests[i] = new Array(data.numcustomers);
        $.each(array, function (j, value) {
            if (value == undefined || !isNumber(value)) {
                error("req should be a " + data.numfacilities + "x" + data.numcustomers + " matrix of numbers");
                return undefined;
            }
            instance.requests[i][j] = value;
        });
    });

    instance.capacities = new Array(instance.nStores);
    $.each(data.cap, function (i, value) {
        if (value == undefined || !isNumber(value)) {
            error("cap should be a " + data.numfacilities + " elements array of numbers");
            return undefined;
        }
        instance.capacities[i] = value;
    });

    return instance;
}
