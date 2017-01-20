function encode(instance) {
    var i, j, key;

    //ho un constraint per ogni cliente e per ogni store

    // per ogni cliente j
    var constraints = {};
    for (j = 0; j < instance.nCustomers; j++) {
        key = "client" + j;
        constraints[key]= {"equal": 1};
    }

    // per ogni store i
    for (i = 0; i < instance.nStores; i++) {
        key = "store" + i;
        constraints[key] = {"max": instance.capacities[i]};
    }


    var variables = {};
    for (i = 0; i < instance.nStores; i++) {
        var store = "store" + i;
        for (j = 0; j < instance.nCustomers; j++) {
            key = "x_" + i + "_" + j;
            var client = "client"+j;
            variables[key] = {};
            variables[key]["cost"]= instance.costs[i][j];
            variables[key][store] = instance.requests[i][j];
            variables[key][client] = 1;
        }
    }

    var model = {
        "optimize": "cost",
        "opType": "min",
        "constraints": constraints,
        "variables": variables
    };
    //console.log(model);

    //console.log(solver.Solve(model));

    return model;
}