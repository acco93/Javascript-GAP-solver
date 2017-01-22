/**
 * Model the problem as a jslpsolver model.
 * @param instance
 * @returns {{optimize: string, opType: string, constraints: {}, variables: {}}}
 */
function encode(instance) {
    var i, j, key;


    var constraints = {};

    // for each client:
    // each client has to be served & from one store only
    for (j = 0; j < instance.nCustomers; j++) {
        key = "client" + j;
        constraints[key]= {"equal": 1};
    }

    // for each store
    // we can't exceed the store capacity
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
            // variable contribution in terms of:
            // cost
            variables[key].cost= instance.costs[i][j];
            // request
            variables[key][store] = instance.requests[i][j];
            // service
            variables[key][client] = 1;
        }
    }

    // the GAP jsLPSolver model
    var model = {
        "optimize": "cost",
        "opType": "min",
        "constraints": constraints,
        "variables": variables
    };

    return model;
}