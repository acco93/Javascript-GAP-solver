/**
 * Perform an iterated local search on solution using the given function
 * as neighbour function.
 *
 * @param solution: an object = {array: Array, z: Number, storeSum: Array}
 * @param instance: an object = {nStores: Number, nCustomers: Number, costs: Matrix, requests: Matrix, capacities: Array}
 * @param localSearch: a local search function: (solution, instance) -> solution {array: Array, z:Number, storeSum: Array}
 *
 * @returns an object = {
 *                          solution: {array: Array, z:Number, storeSum: Array},
 *                          graphData: {x,y} Array
 *                      }
 */
function iteratedLocalSearch() {

    self.addEventListener("message", function (parameters) {


        var instance = parameters.data.instance;
        var solution = parameters.data.solution;

        var localSearch;

        if (parameters.data.localSearch == "10opt") {
            localSearch = gap10opt;
        } else {
            localSearch = gap11opt;
        }


        var graphData = [];

        // Some instance vars ...
        var nStores = instance.nStores;
        var nCustomers = instance.nCustomers;
        var costs = instance.costs;
        var requests = instance.requests;
        var capacities = instance.capacities;

        // Some ils parameters
        var DISTURB_FACTOR_PERC = 0.5;

        // copy the costs matrix (and perturbed it!)
        var perturbedCosts = new Array(nStores);
        for (var i = 0; i < nStores; i++) {
            perturbedCosts[i] = new Array(nCustomers);
        }

        // some algorithm variables

        var MAX_ITER = parameters.data.MAX_ITER;
        var iter = 0;

        var startTime = new Date();
        do {

            // store the original costs matrix
            var originalCosts = instance.costs;


            solution = localSearch(solution, instance).solution;

            perturbedSolution = {
                array: solution.array.slice(),
                z: solution.z,
                storeSum: solution.storeSum.slice()
            };

            instance.costs = perturbMatrix(originalCosts, perturbedCosts, nStores, nCustomers, DISTURB_FACTOR_PERC);
            var perturbedSolution = localSearch(perturbedSolution, instance).solution;


            // restore the instance
            instance.costs = originalCosts;


            // acceptance criterion

            // compute the real cost!
            perturbedSolution.z = z(perturbedSolution.array, instance);

            if (perturbedSolution.z < solution.z) {
                solution = perturbedSolution;
            }

            graphData[iter] = {
                x: iter,
                y: solution.z
            };


            iter++;
        } while (iter < MAX_ITER && (new Date() - startTime) < parameters.data.MAX_PROCESSING_MILLISECONDS);

        var endTime = new Date();


        postMessage({
            functionName: "Iterated local search (" + parameters.data.localSearch + ")",
            instance: instance,
            solution: solution,
            processingTime: (endTime - startTime),
            graph: {
                name: "ILS" + parameters.data.localSearch,
                data: graphData
            }
        });


    }, false);
}

function perturbMatrix(originalMatrix, newMatrix, rows, columns, factor) {

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var perc = (Math.random() * (factor/2));
            if (Math.random() <= 0.5) {
                perc *= -1;
            }
            newMatrix[i][j] = originalMatrix[i][j] + (originalMatrix[i][j] * perc);
        }
    }

    return newMatrix;
}

// Compute the solution cost.
function z(solutionArray, instance){
    var cost = 0;

    for(var j=0;j<instance.nCustomers;j++){
        cost += instance.costs[solutionArray[j]][j];
    }

    return cost;
}

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
function gap10opt(solution, instance) {

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

    return {
        solution: solution,
        graphData: undefined
    };

}

/**
 * Perform an 1-1 opt local search on solution. That is:
 * attempts to improve the cost of the solution by reassigning
 * a pair of customers.
 *
 * @param solution: an object = {array: Array, z: Number, storeSum: Array}
 * @param instance: an object = {nStores: Number, nCustomers: Number, costs: Matrix, requests: Matrix, capacities: Array}
 *
 * @returns a solution = {array: Array, z:Number, storeSum: Array}
 */
function gap11opt(solution, instance) {

    var nStores = instance.nStores;
    var nCustomers = instance.nCustomers;
    var costs = instance.costs;
    var requests = instance.requests;
    var capacities = instance.capacities;

    /*
     Repeat untill there isn't an improvement
     */
    do {
        var improved = false;

        /*
         For each customer pair...
         */
        for (var j = 0; j < nCustomers - 1; j++) {

            var currentStoreJ = solution.array[j];

            for (var k = j + 1; k < nCustomers; k++) {


                var currentStoreK = solution.array[k];

                for (var ij = 0; ij < nStores; ij++) {
                    for (var ik = 0; ik < nStores; ik++) {
                        var newCost = solution.z - costs[currentStoreJ][j] + costs[ij][j] - costs[currentStoreK][k] + costs[ik][k];

                        /*
                         Remove customers
                         */
                        solution.storeSum[currentStoreJ] -= requests[currentStoreJ][j];
                        solution.storeSum[currentStoreK] -= requests[currentStoreK][k];
                        /*
                         Add to the new store, this is needed since both customers may be added to the same store
                         and using the if I can't check both the same time!
                         */
                        solution.storeSum[ij] += requests[ij][j];
                        solution.storeSum[ik] += requests[ik][k];

                        if (solution.storeSum[ij] <= capacities[ij] && solution.storeSum[ik] <= capacities[ik] && newCost < solution.z) {

                            solution.array[j] = ij;
                            solution.array[k] = ik;

                            improved = true;

                            solution.z = newCost;


                            break;
                        } else {
                            /*
                             Re-fix variables
                             */
                            solution.storeSum[currentStoreJ] += requests[currentStoreJ][j];
                            solution.storeSum[currentStoreK] += requests[currentStoreK][k];
                            solution.storeSum[ij] -= requests[ij][j];
                            solution.storeSum[ik] -= requests[ik][k];
                        }
                    }
                    if (improved) {
                        break;
                    }
                }
                if (improved) {
                    break;
                }
            }
            if (improved) {
                break;
            }
        }

    } while (improved);

    return {
        solution: solution,
        graphData: undefined
    };

}

iteratedLocalSearch();