/**
 * Perform an iterated local search on solution using the 1-0 opt
 * as neighbour function.
 *
 * @param solution: an object = {array: Array, z: Number, storeSum: Array}
 * @param instance: an object = {nStores: Number, nCustomers: Number, costs: Matrix, requests: Matrix, capacities: Array}
 *
 * @returns an object = {
 *                          solution: {array: Array, z:Number, storeSum: Array},
 *                          graphData: {x,y} Array
 *                      }
 */
function iteratedLocalSearch10opt(solution, instance) {
    return iteratedLocalSearch(solution, instance, gap10opt);
}

/**
 * Perform an iterated local search on solution using the 1-1 opt
 * as neighbour function.
 *
 * @param solution: an object = {array: Array, z: Number, storeSum: Array}
 * @param instance: an object = {nStores: Number, nCustomers: Number, costs: Matrix, requests: Matrix, capacities: Array}
 *
 * @returns an object = {
 *                          solution: {array: Array, z:Number, storeSum: Array},
 *                          graphData: {x,y} Array
 *                      }
 */
function iteratedLocalSearch11opt(solution, instance) {
    return iteratedLocalSearch(solution, instance, gap11opt);
}

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
function iteratedLocalSearch(solution, instance, localSearch) {

    var graphData = [];

    // Some instance vars ...
    var nStores = instance.nStores;
    var nCustomers = instance.nCustomers;
    var costs = instance.costs;
    var requests = instance.requests;
    var capacities = instance.capacities;

    // Some ils parameters
    var DISTURB_FACTOR_PERC = 50;

    // copy the costs matrix (and perturbed it!)
    var perturbedCosts = new Array(nStores);
    for (var i = 0; i < nStores; i++) {
        perturbedCosts[i] = new Array(nCustomers);
        for (var j = 0; j < nCustomers; j++) {
            var perc = (Math.random() * DISTURB_FACTOR_PERC * 0.2);
            if (Math.random() <= 0.5) {
                perc *= -1;
            }
            perturbedCosts[i][j] = (costs[i][j] + costs[i][j] * perc);
        }
    }

    // some algorithm variables

    var MAX_ITER = AlgorithmSettings.MAX_ITER;
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

        perturbMatrix(perturbedCosts, nStores, nCustomers, DISTURB_FACTOR_PERC);
        instance.costs = perturbedCosts;
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
    } while (iter < MAX_ITER && (new Date() - startTime) < AlgorithmSettings.MAX_PROCESSING_MILLISECONDS);

    return {
        solution: solution,
        graphData: graphData
    };
}

function perturbMatrix(matrix, rows, columns, factor) {


    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var perc = (Math.random() * factor * 0.2);
            if (Math.random() <= 0.5) {
                perc *= -1;
            }
            matrix[i][j] += (matrix[i][j] * perc);
        }
    }
}