/**
 * Perform a tabu search metaheuristic on solution using an 1-0 opt
 * as neighbour function.
 *
 * @param solution: an object = {array: Array, z: Number, storeSum: Array}
 * @param instance: an object = {nStores: Number, nCustomers: Number, costs: Matrix, requests: Matrix, capacities: Array}

 * @returns an object = {
 *                          solution: {array: Array, z:Number, storeSum: Array},
 *                          graphData: {x,y} Array
 *                      }
 */

function tabuSearch(solution, instance, MAX_ITER, MAX_PROCESSING_MILLISECONDS, showGraph) {

    // Some instance vars ...
    var nStores = instance.nStores;
    var nCustomers = instance.nCustomers;
    var costs = instance.costs;
    var requests = instance.requests;
    var capacities = instance.capacities;

    // Graph data variable
    var graphData = [];

    // Some tabu search parameters
    var TABU_TENURE = nStores * nCustomers * 2; // tabu "time"
    var iter = 0;

    var i, j;

    var tabuList = [];
    for (i = 0; i < nStores; i++) {
        tabuList[i] = new Array(nCustomers);
        for (j = 0; j < nCustomers; j++) {
            tabuList[i][j] = 0;
        }
    }

    // best solution array and cost
    var bestSolution = solution.array.slice();
    var bestCost = solution.z;

    // and the current solution
    var currentSolution = bestSolution.slice();
    var currentCost = bestCost;


    var storeSum = solution.storeSum.slice();

    var startTime = new Date();
    // tabu search core
    do {
        var iBest = undefined;
        var jBest = undefined;
        var bestNeighbourCost = Number.MAX_VALUE;

        // find the best 1-0 opt neighbour
        for (j = 0; j < nCustomers; j++) {
            var currentStore = currentSolution[j];
            for (i = 0; i < nStores; i++) {

                if (i == currentStore) {
                    continue;
                }

                var newCost = currentCost - costs[currentStore][j] + costs[i][j];

                if (storeSum[i] + requests[i][j] <= capacities[i] && iter >= tabuList[i][j] && newCost < bestNeighbourCost) {

                    iBest = i;
                    jBest = j;
                    bestNeighbourCost = newCost;

                }

            }
        }

        if (iBest == undefined || jBest == undefined) {
            // can't find a feasible neighbour!
            // ooooooow don't know what to do! D:

            postMessage({
                tag: "warning",
                msg: "All moves are tabu! Terminating at " + iter + "/" + MAX_ITER
            });

            break;
        }

        currentCost = bestNeighbourCost;


        // modify the solution and the storeSum!
        // .. in the store sum values
        // old store = currentSolution[j]
        storeSum[currentSolution[jBest]] -= requests[currentSolution[jBest]][jBest];
        // new store = i
        storeSum[iBest] += requests[iBest][jBest];


        currentSolution[jBest] = iBest;

        // add the moves to the tabu list
        tabuList[iBest][jBest] = iter + TABU_TENURE;


        // check if currentSolution is better than bestSolution
        if (currentCost < bestCost) {
            bestSolution = currentSolution.slice();
            bestCost = currentCost;
        }


        if (showGraph) {
            graphData[iter] = {
                x: iter,
                y: currentCost
            };
        }


        iter++;
    } while (iter < MAX_ITER && (new Date() - startTime) < MAX_PROCESSING_MILLISECONDS);

    var endTime = new Date();

    var bestSolutionStoreSum = new Array(nStores);
    for (j = 0; j < nCustomers; j++) {
        bestSolutionStoreSum[j] = 0;
    }
    for (j = 0; j < nCustomers; j++) {
        bestSolutionStoreSum[bestSolution[j]] += requests[bestSolution[j]][j];
    }

    return {
        tag: "result",
        functionName: "Tabu search (10opt)",
        instance: instance,
        solution: {
            array: bestSolution,
            z: bestCost,
            storeSum: bestSolutionStoreSum
        },
        processingTime: (endTime - startTime),
        graph: {
            name: "TS10",
            data: graphData
        }
    };


}
