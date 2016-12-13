/**
 * Perform the 1-1 moves on a solution.
 *
 * @param solution: an object = {array: Array, z: Number, storeSum: Array}
 * @param instance: an object = {nStores: Number, nCustomers: Number, costs: Matrix, requests: Matrix, capacities: Array}
 *
 * @returns a solution = {array: Array, z:Number, storeSum: Array}
 */
function gap11moves(solution, instance, maxDuration) {

    if (maxDuration == undefined) {
        maxDuration = Number.MAX_VALUE;
    }


    var startTime = new Date();

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
        for (var j = 0; j < nCustomers - 1 && (new Date() - startTime) < maxDuration; j++) {

            var currentStoreJ = solution.array[j];

            for (var k = j + 1; k < nCustomers && (new Date() - startTime) < maxDuration; k++) {

                var currentStoreK = solution.array[k];

                // they are in the same store then skip them!
                if (currentStoreJ == currentStoreK) {
                    continue;
                }


                /*
                 * Try to reassign them, exchanging them!
                 * */

                var newCost = solution.z
                    - costs[currentStoreJ][j] + costs[currentStoreK][j] // remove j to J and attach it to K
                    - costs[currentStoreK][k] + costs[currentStoreJ][k];

                if (solution.storeSum[currentStoreJ] - requests[currentStoreJ][j] + requests[currentStoreJ][k] <= capacities[currentStoreJ] &&
                    solution.storeSum[currentStoreK] - requests[currentStoreK][k] + requests[currentStoreK][j] <= capacities[currentStoreK] &&
                    newCost < solution.z) {

                    solution.storeSum[currentStoreJ] += -requests[currentStoreJ][j] + requests[currentStoreJ][k];
                    solution.storeSum[currentStoreK] += -requests[currentStoreK][k] + requests[currentStoreK][j];

                    solution.array[j] = currentStoreK;
                    solution.array[k] = currentStoreJ;

                    solution.z = newCost;

                    improved = true;
                    break;
                }

            }
            if (improved) {
                break;
            }
        }

    } while (improved && (new Date() - startTime) < maxDuration);

    var endTime = new Date();


    return {
        tag: "result",
        functionName: "1-1 moves",
        instance: instance,
        solution: solution,
        processingTime: (endTime - startTime),
        graph: undefined
    };


}
