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
function gap11opt(solution, instance){

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
        for(var j=0; j<nCustomers-1; j++){

            var currentStoreJ = solution.array[j];

            for(var k=j+1; k<nCustomers; k++){


                var currentStoreK = solution.array[k];

                for(var ij=0;ij<nStores;ij++){
                    for(var ik=0;ik<nStores;ik++){
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

                        if(solution.storeSum[ij]<= capacities[ij] && solution.storeSum[ik]<=capacities[ik] && newCost < solution.z){

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
                    if(improved){break;}
                }
                if(improved){break;}
            }
            if(improved){break;}
        }

    } while(improved);

    return {
        solution: solution,
        graphData: undefined
    };

}
