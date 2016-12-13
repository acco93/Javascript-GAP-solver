/**
 * Perform the 2-1 moves on a solution.
 *
 * @param solution: an object = {array: Array, z: Number, storeSum: Array}
 * @param instance: an object = {nStores: Number, nCustomers: Number, costs: Matrix, requests: Matrix, capacities: Array}
 *
 * @returns a solution = {array: Array, z:Number, storeSum: Array}
 */
function gap21moves(solution, instance, maxDuration){

    if(maxDuration == undefined){
        maxDuration = Number.MAX_VALUE;
    }

    var startTime = new Date();

    /*
     Repeat untill there isn't an improvement
     */


    do {
        var improved = false;

        for(var i=0;i<instance.nCustomers-2 && (new Date() - startTime) < maxDuration; i++){

            var currentStoreI = solution.array[i];

            for(var j=i+1;j<instance.nCustomers-1 && (new Date() - startTime) < maxDuration; j++){

                var currentStoreJ = solution.array[j];

                // i and j should be from the same store!
                if(currentStoreI != currentStoreJ) { continue; }

                for(var k=0;k<instance.nCustomers && (new Date() - startTime) < maxDuration; k++){


                    // try to reassign them! there are 8 possible ways
                    // one of each is the current -> ia + ib & ka
                    // so there are 7 remaining ways!

                    // ia + ka & ib -> move obtainable from 1-1 opt


                    // ib + ka & ia -> move obtainable from 1-1 opt



                    // ia & ib + ka -> move obtainable from 1-0 opt
                    // ib & ia + ka -> move obtainable from 1-0 opt

                    // ia + ib + ka & 000 -> move obtainable from 1-0 opt

                    // 000 & ia + ib + ka -> move obtainable from 2-0 opt


                    // ka & ia + ib
                    var currentStoreK = solution.array[k];

                    // k should be from another store and should be a different from i and j <.<
                    if(k == i || k == j || currentStoreK == currentStoreI){ continue; }

                    var newCost = solution.z    - instance.costs[currentStoreI][i] - instance.costs[currentStoreJ][j]
                                                - instance.costs[currentStoreK][k]
                                                + instance.costs[currentStoreK][i] + instance.costs[currentStoreK][j]
                                                + instance.costs[currentStoreI][k];



                    if( newCost < solution.z &&
                        solution.storeSum[currentStoreI] - instance.requests[currentStoreI][i] - instance.requests[currentStoreI][j]
                        + instance.requests[currentStoreI][k] <= instance.capacities[currentStoreI] &&
                        solution.storeSum[currentStoreK] - instance.requests[currentStoreK][k] + instance.requests[currentStoreK][i]
                        + instance.requests[currentStoreK][j] <= instance.capacities[currentStoreK]
                    ) {


                        solution.z = newCost;

                        solution.storeSum[currentStoreI] += - instance.requests[currentStoreI][i] - instance.requests[currentStoreI][j]
                        + instance.requests[currentStoreI][k];

                        solution.storeSum[currentStoreK] += - instance.requests[currentStoreK][k] + instance.requests[currentStoreK][i]
                        + instance.requests[currentStoreK][j];

                        solution.array[i] = currentStoreK;
                        solution.array[j] = currentStoreK;

                        solution.array[k] = currentStoreI;

                        improved = true;

                        break;
                    }

                    if(improved) {break;}

                } // for k

                if(improved) {break;}
            } // for j

            if(improved) {break;}
        } // for i

    } while (improved && (new Date() - startTime) < maxDuration);

    var endTime = new Date();

    return{
        tag: "result",
        functionName: "2-1 moves",
        instance: instance,
        solution: solution,
        processingTime: (endTime - startTime),
        graph: undefined
    };

}