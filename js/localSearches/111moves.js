/**
 * Perform the 1-1-1 moves on a solution.
 *
 * @param solution: an object = {array: Array, z: Number, storeSum: Array}
 * @param instance: an object = {nStores: Number, nCustomers: Number, costs: Matrix, requests: Matrix, capacities: Array}
 *
 * @returns a solution = {array: Array, z:Number, storeSum: Array}
 */
function gap111moves(solution, instance, maxDuration) {

    if(maxDuration == undefined){
        maxDuration = Number.POSITIVE_INFINITY;
    }

    var startTime = new Date();

    /*
     Repeat untill there isn't an improvement
     */

    do {
        var improved = false;

        for (var i = 0; i < instance.nCustomers - 2 && (new Date() - startTime) < maxDuration; i++) {

            var currentStoreI = solution.array[i];

            for (var j = i + 1; j < instance.nCustomers - 1 && (new Date() - startTime) < maxDuration; j++) {

                var currentStoreJ = solution.array[j];

                // i and j should be from the same store!
                if (currentStoreI == currentStoreJ) {
                    continue;
                }

                for (var k = j + 1; k < instance.nCustomers && (new Date() - startTime) < maxDuration; k++) {

                    var currentStoreK = solution.array[k];

                    // k should be from another store and should be a different from i and j <.<
                    if (currentStoreK == currentStoreI || currentStoreK == currentStoreJ) {
                        continue;
                    }

                    // ok let's try to assign them
                    //...
                    // I've to move all the three otherwise it is a 1-1 move!

                    //let
                    // i j k
                    // -----
                    // a b c
                    // be the current displacement
                    // a c b -> 1-1 move
                    // b a c -> 1-1 move
                    // b c a -> ok! (A)
                    // c a b -> ok! (B)
                    // c b a -> 1-1 move

                    var newCost;

                    //(A)
                    // b c a -> ok! (A)
                    newCost = solution.z - instance.costs[currentStoreI][i] - instance.costs[currentStoreJ][j]
                        - instance.costs[currentStoreK][k]
                        + instance.costs[currentStoreK][i] + instance.costs[currentStoreI][j]
                        + instance.costs[currentStoreJ][k];

                    if (solution.storeSum[currentStoreI] - instance.requests[currentStoreI][i]
                        + instance.requests[currentStoreI][j] <= instance.capacities[currentStoreI] &&
                        solution.storeSum[currentStoreJ] - instance.requests[currentStoreJ][j]
                        + instance.requests[currentStoreJ][k] <= instance.capacities[currentStoreJ] &&
                        solution.storeSum[currentStoreK] - instance.requests[currentStoreK][k]
                        + instance.requests[currentStoreK][i] <= instance.capacities[currentStoreK] &&
                        newCost < solution.z
                    ) {

                        solution.z = newCost;

                        solution.storeSum[currentStoreI] += -instance.requests[currentStoreI][i]
                            + instance.requests[currentStoreI][j];

                        solution.storeSum[currentStoreJ] += -instance.requests[currentStoreJ][j]
                            + instance.requests[currentStoreJ][k];

                        solution.storeSum[currentStoreK] += -instance.requests[currentStoreK][k]
                            + instance.requests[currentStoreK][i];

                        solution.array[i] = currentStoreK;
                        solution.array[j] = currentStoreI;
                        solution.array[k] = currentStoreJ;

                        improved = true;
                        break;

                    }

                    //(B)
                    // c a b -> ok! (B)
                    newCost = solution.z - instance.costs[currentStoreI][i] - instance.costs[currentStoreJ][j]
                        - instance.costs[currentStoreK][k]
                        + instance.costs[currentStoreJ][i] + instance.costs[currentStoreK][j]
                        + instance.costs[currentStoreI][k];

                    if (solution.storeSum[currentStoreI] - instance.requests[currentStoreI][i]
                        + instance.requests[currentStoreI][k] <= instance.capacities[currentStoreI] &&
                        solution.storeSum[currentStoreJ] - instance.requests[currentStoreJ][j]
                        + instance.requests[currentStoreJ][i] <= instance.capacities[currentStoreJ] &&
                        solution.storeSum[currentStoreK] - instance.requests[currentStoreK][k]
                        + instance.requests[currentStoreK][j] <= instance.capacities[currentStoreK] &&
                        newCost < solution.z
                    ) {

                        solution.z = newCost;

                        solution.storeSum[currentStoreI] += -instance.requests[currentStoreI][i]
                            + instance.requests[currentStoreI][k];

                        solution.storeSum[currentStoreJ] += -instance.requests[currentStoreJ][j]
                            + instance.requests[currentStoreJ][i];

                        solution.storeSum[currentStoreK] += -instance.requests[currentStoreK][k]
                            + instance.requests[currentStoreK][j];

                        solution.array[i] = currentStoreJ;
                        solution.array[j] = currentStoreK;
                        solution.array[k] = currentStoreI;

                        improved = true;
                        break;

                    }


                } // for k

                if (improved) {
                    break;
                }
            } // for j

            if (improved) {
                break;
            }
        } // for i

    } while (improved && (new Date() - startTime) < maxDuration);

    var endTime = new Date();

    return {
        tag: "result",
        functionName: "1-1-1 moves",
        instance: instance,
        solution: solution,
        processingTime: (endTime - startTime),
        graph: undefined
    };

}