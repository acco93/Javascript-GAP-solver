/**
 * Perform an 1-0 opt local search on solution. That is:
 * attempts to improve the cost of the solution by reassigning
 * each customer to a store that has space left.
 *
 * @param solution: an object = {array: Array, z: Number, storeSum: Array}
 * @param instance: an object = {nStores: Number, nCustomers: Number, costs: Matrix, requests: Matrix, capacities: Array}
 *
 * @returns a solution = {array: Array, z:Number, storeSum: Array}
 */
function gap10opt() {

    self.addEventListener("message", function (parameters) {

        var startTime = new Date();

        var instance = parameters.data.instance;
        var solution = parameters.data.solution;


        var nStores = instance.nStores;
        var nCustomers = instance.nCustomers;
        var costs = instance.costs;
        var requests = instance.requests;
        var capacities = instance.capacities;

        /*
         Repeat until there isn't an improvement
         */
        do {

            var improved = false;

            /*
             For each customer ... (column)
             */
            for (var j = 0; j < nCustomers; j++) {

                /*
                 Find the current store
                 */

                var currentStore = solution.array[j];

                for (var i = 0; i < nStores; i++) {
                    /*
                     Consider each store different from the current
                     */
                    if (i == currentStore) {
                        continue;
                    }

                    /*
                     Build another solution where ...
                     */

                    /*
                     Check for capacities
                     */
                    var newCost = solution.z - costs[currentStore][j] + costs[i][j];

                    if (solution.storeSum[i] + requests[i][j] <= capacities[i] && newCost < solution.z) {

                        solution.array[j] = i;
                        improved = true;
                        /*
                         Update some variables
                         */
                        solution.storeSum[currentStore] -= requests[currentStore][j];
                        solution.z = newCost;
                        solution.storeSum[i] += requests[i][j];
                        break;
                    }

                }

                if (improved) {
                    break;
                }

            }

        } while (improved);

        var endTime = new Date();

        postMessage({
            tag: "result",
            functionName: "1-0 opt",
            instance: instance,
            solution: solution,
            processingTime: (endTime-startTime),
            graph: undefined
        });


    }, false);


}

gap10opt();