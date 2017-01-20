function grasp(instance, randomizeCustomers, MAX_ITER, MAX_PROCESSING_MILLISECONDS, showGraph) {

    // candidate list # elements
    var k = Math.floor(instance.nStores * 0.2);

    var graphData = [];
    var iter = 0;

    var bestSolution = undefined;

    var startTime = new Date();

    var remainingTime = MAX_PROCESSING_MILLISECONDS;

    do {

        var solution = constructiveHeuristic(instance, randomizeCustomers, k);

        if (isFeasible(solution.array, instance, false)) {

            var result = gap11opt(solution, instance, remainingTime);
            remainingTime -= result.processingTime;


            if (bestSolution == undefined || result.solution.z < bestSolution.z) {
                bestSolution = {
                    array: result.solution.array.slice(),
                    z: result.solution.z,
                    storeSum: result.solution.storeSum.slice()
                }
            }
            if (showGraph) {
                graphData[iter] = {
                    x: iter,
                    y: solution.z
                };
            }
        } else {
            if (showGraph) {
                graphData[iter] = {
                    x: iter,
                    y: 0
                };
            }
        }


        iter++;
    } while (iter < MAX_ITER && (new Date() - startTime) < MAX_PROCESSING_MILLISECONDS);

    var endTime = new Date();

    return {
        tag: "result",
        functionName: "GRASP",
        instance: instance,
        solution: bestSolution,
        processingTime: (endTime - startTime),
        graph: {
            name: "GRASP",
            data: graphData
        }
    };


}


/**
 * Try to build a solution using a simple constructive heuristic approach:
 * assign a customer to the first empty store for which are required
 * less resources.
 *
 * @param instance: an object = {nStores: Number, nCustomers: Number, costs: Matrix, requests: Matrix, capacities: Array}
 *
 * @returns a solution = {array: Array, z:Number, storeSum: Array}
 */

/*
 Used in constructive heuristic to sort the stores given a customer
 */
var KEY = 0;
var VALUE = 1;
function constructiveHeuristic(instance, randomizeCustomers, k) {

    var nStores = instance.nStores;
    var nCustomers = instance.nCustomers;
    var costs = instance.costs;
    var requests = instance.requests;
    var capacities = instance.capacities;

    var customersIndexes = new Array(nCustomers);

    var i, j;

    for (j = 0; j < nCustomers; j++) {
        customersIndexes[j] = j;
    }

    if (randomizeCustomers) {
        customersIndexes = knuthShuffle(customersIndexes);
    }

    // the solution that has to be created!
    var solution = new Array(nCustomers);

    var requestsSum = [];
    for (i = 0; i < nStores; i++) {
        requestsSum[i] = 0;
    }

    var z = 0;

    /*
     Per ogni cliente vado a scegliere il magazzino a cui richiedo meno
     in posizione i, j ho la richiesta del cliente j al magazzino i
     per ogni cliente ordino per richiesta crescente tenendo conto dell'indice del magazzino
     - fissato il cliente j
     - creo un vettore di magazzini, tenendo traccia dell'indice originale
     - ordino per richiesta crescente
     */

    for (j = 0; j < nCustomers; j++) {

        /*
         consider the customers in the order defined in
         customersIndexes
         */

        var customerIndex = customersIndexes[j];

        var requestsCustomer = new Array(nStores);
        for (i = 0; i < nStores; i++) {
            requestsCustomer[i] = new Array(2);
            requestsCustomer[i][KEY] = i;
            requestsCustomer[i][VALUE] = requests[i][customerIndex];
        }
        requestsCustomer.sort(ascendingCompareKeyValue);
        // ora ho le richieste del cliente ordinate per richiesta minore
        // le scorro e assegno al primo magazzino libero

        var startI = Math.floor(Math.random() * k);
        var storesProcessed = 0;
        while (storesProcessed < nStores) {
            var realIndexStore = requestsCustomer[startI][KEY];
            if (requestsSum[realIndexStore] + requests[realIndexStore][customerIndex] <= capacities[realIndexStore]) {

                solution[customerIndex] = realIndexStore;

                requestsSum[realIndexStore] += requests[realIndexStore][customerIndex];
                z += costs[realIndexStore][customerIndex];
                //info("Customer "+customerIndex+" assigned to store "+realIndexStore);
                break;
            }
            startI = (startI + 1) % nStores;
            storesProcessed++;
        }

    }

    return {
        array: solution,
        z: z,
        storeSum: requestsSum
    };


}


/*
 Returns <0 if valueA<valueB
 >0 if valueA>valueB
 =0 if valueA==valueB
 */

function ascendingCompareKeyValue(entryA, entryB) {
    /*
     entryA[0] = key
     entryA[1] = value
     */

    if (entryA[VALUE] == entryB[VALUE]) {
        return 0;
    } else {
        return entryA[VALUE] < entryB[VALUE] ? -1 : 1;
    }

}


function knuthShuffle(arr) {
    var rand, temp, i;

    for (i = arr.length - 1; i > 0; i -= 1) {
        rand = Math.floor((i + 1) * Math.random());//get random between zero and i (inclusive)
        temp = arr[rand];//swap i and the zero-indexed number
        arr[rand] = arr[i];
        arr[i] = temp;
    }
    return arr;
}
