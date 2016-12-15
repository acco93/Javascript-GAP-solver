/**
 * Perform a simulated annealing metaheuristic on solution using an 1-0 opt
 * as neighbour function. (Facade function)
 *
 * @param solution: an object = {array: Array, z: Number, storeSum: Array}
 * @param instance: an object = {nStores: Number, nCustomers: Number, costs: Matrix, requests: Matrix, capacities: Array}
 *
 * @returns a solution = {array: Array, z:Number, storeSum: Array}
 */
function simulatedAnnealing10Move(solution, instance, MAX_ITER, MAX_PROCESSING_MILLISECONDS, showGraph) {
    return simulatedAnnealing(solution, instance, gap10optSA, MAX_ITER, MAX_PROCESSING_MILLISECONDS, "10move", showGraph);
}

/**
 * Perform a simulated annealing metaheuristic on solution using an 1-1 opt
 * as neighbour function. (Facade function)
 *
 * @param solution: an object = {array: Array, z: Number, storeSum: Array}
 * @param instance: an object = {nStores: Number, nCustomers: Number, costs: Matrix, requests: Matrix, capacities: Array}
 *
 * @returns a solution = {array: Array, z:Number, storeSum: Array}
 */
function simulatedAnnealing11Move(solution, instance, MAX_ITER, MAX_PROCESSING_MILLISECONDS, showGraph) {
    return simulatedAnnealing(solution, instance, gap11optSA, MAX_ITER, MAX_PROCESSING_MILLISECONDS, "11move", showGraph);
}

/**
 * Perform a simulated annealing metaheuristic on solution using the given function
 * as neighbour function.
 *
 * @param solution: an object = {array: Array, z: Number, storeSum: Array}
 * @param instance: an object = {nStores: Number, nCustomers: Number, costs: Matrix, requests: Matrix, capacities: Array}
 * @param neighbourFunction: a function: solution -> {z: Number, moves: Array} where z is the new solution cost if the moves
 *                          are performed. moves is an array: [{i,j}] that describe a feasible set of assignments store i to
 *                          customer j, that is: solution.array[j] = i
 *
 * @returns an object = {
 *                          solution: {array: Array, z:Number, storeSum: Array},
 *                          graphData: {x,y} Array
 *                      }
 */
function simulatedAnnealing(solution, instance, neighbourFunction, MAX_ITER, MAX_PROCESSING_MILLISECONDS, neighbourFunctionName, showGraph) {


    // Some instance vars ...
    var nStores = instance.nStores;
    var nCustomers = instance.nCustomers;
    var costs = instance.costs;
    var requests = instance.requests;
    var capacities = instance.capacities;

    // Simulated annealing parameters ...
    var k = 1.0;

    var iter = 0;
    // # of moves performed before decrementing t
    var movesPerT = Math.floor(MAX_ITER / nCustomers);

    var MAX_T = defineInitialTemperature(solution, instance, neighbourFunction, k, MAX_ITER);
    var beta = 0.0005;
    //var delta = 0.95;

    //delta = Math.pow(Number.MIN_VALUE,(1/(MAX_ITER-iter)))/t;

    postMessage({
        tag: "info",
        msg: "T: " + MAX_T
    });

    var t = MAX_T;

    // graph data
    var graphData = [];




    // Some algorithm variables ...
    // best solution array found till now
    var bestSolution = solution.array.slice();
    var bestCost = solution.z;

    // current point in the solutions space
    var currentSolution = bestSolution.slice();
    var currentCost = bestCost;

    var storeSum = solution.storeSum.slice();

    var m, j, i;

    var startTime = new Date();
    // simulated annealing core
    do {



        // result is an object {z: Number, moves:Array} that specifies the solution cost
        // if the returned moves are applied to the current solution
        var result = neighbourFunction(currentSolution, currentCost, storeSum, instance);

        // the neighbour is better ...
        if (result.z < currentCost) {

            // thus perform the moves, there may be more than one move (i.e. gap11opt)
            for (m = 0; m < result.moves.length; m++) {

                // moves[index] = {i: Number, j: Number}, it specifies the new store i for the customer j
                // that is, solution[j] = i
                j = result.moves[m].j;
                i = result.moves[m].i;

                // update the storeSum, since it will be used the next iteration!
                // old store = currentSolution[j]
                storeSum[currentSolution[j]] -= requests[currentSolution[j]][j];
                // new store = i
                storeSum[i] += requests[i][j];

                // .. and the solution array
                currentSolution[j] = i;
            } // end moves

            // update the current cost
            currentCost = result.z;

            if (currentCost < bestCost) {
                // edit the best solution
                // TODO: instead of copying the solution I could store the moves sequence and compute the best solution
                // TODO: once the iterations are finished
                bestSolution = currentSolution.slice();
                bestCost = currentCost;
                // NB: I don't need the storeSum array because no computation will be performed over bestSolution
                // I'll compute it as soon as the simulated annealing is finished
            }

        } else if (result.z > currentCost) {
            // if the neighbour is worse ...

            // compute a probability to chose it despite of this ...
            var p = Math.exp(-(result.z - currentCost) / (k * t));

            if (Math.random() < p) {

                // ok switch to the worse solution ... perform the moves
                for (m = 0; m < result.moves.length; m++) {
                    j = result.moves[m].j;
                    i = result.moves[m].i;
                    // .. in the store sum values
                    // old store = currentSolution[j]
                    storeSum[currentSolution[j]] -= requests[currentSolution[j]][j];
                    // new store = i
                    storeSum[i] += requests[i][j];

                    // .. in the solution
                    currentSolution[j] = i;
                }
                currentCost = result.z;

            }
        }


        //if (iter % movesPerT == 0) {
            t = t / (1 + beta * t);
            //t *= delta;
       // }

		if(t < 0.0005){
			t = MAX_T;
		}


        // store some graphdata
        if(showGraph){
            graphData[iter] = {
                x: iter,
                y: currentCost
            };
        }



        iter++;

    } while (iter < MAX_ITER && (new Date() - startTime) < MAX_PROCESSING_MILLISECONDS);


    var endTime = new Date();

    var bestSolutionStoreSum = new Array(nStores);
    for (j = 0; j < nStores; j++) {
        bestSolutionStoreSum[j] = 0;
    }
    for (j = 0; j < nCustomers; j++) {
        bestSolutionStoreSum[bestSolution[j]] += requests[bestSolution[j]][j];
    }


    return {
        tag: "result",
        functionName: "Simulated annealing (" + neighbourFunctionName + ")",
        instance: instance,
        solution: {
            array: bestSolution,
            z: bestCost,
            storeSum: bestSolutionStoreSum
        },
        processingTime: (endTime - startTime),
        graph: {
            name: "SA" + neighbourFunctionName,
            data: graphData
        }
    };

}

function defineInitialTemperature(solution, instance, neighbourFunction, k, MAX_ITER) {
    var N_TESTS = 1000;
    var avgZ = 0;
    var badMoves = 0;


    for (var i = 0; i < N_TESTS; i++) {

        var neighbour = neighbourFunction(solution.array, solution.z, solution.storeSum, instance);

        if (neighbour.z > instance.z) {
            badMoves++;
            avgZ += neighbour.z;
        }

    }


    if (badMoves > 0) {
        // estimates the neighbourhood costs as the average costs of bad neighbours
        avgZ /= badMoves;
    } else {
        // if there aren't bad neighbours, estimates avgZ as the current cost + 20%
        avgZ = solution.z + (solution.z * 0.2);
    }

    var p = 0.5;

    var t = -(avgZ - solution.z) / (k * Math.log(p));

    return t;
}


function gap10optSA(solutionArray, cost, storeSum, instance) {

    // chose a customer and a store random index
    var customerIndex = Math.floor((Math.random() * instance.nCustomers));
    var storeIndex = Math.floor((Math.random() * instance.nStores));

    /* current customer store */
    var currentStore = solutionArray[customerIndex];

    var newCost = cost;
    var moves = [];

    if (storeIndex != currentStore && storeSum[storeIndex] + instance.requests[storeIndex][customerIndex] <= instance.capacities[storeIndex]) {

        moves.push({j: customerIndex, i: storeIndex});

        newCost = cost - instance.costs[currentStore][customerIndex] + instance.costs[storeIndex][customerIndex];

    }

    return {
        moves: moves,
        z: newCost
    };

}

function gap11optSA(solutionArray, cost, storeSum, instance) {

    // chose a customer pair and a store random index
    var customerIndexJ = Math.floor((Math.random() * instance.nCustomers));
    var storeIndexJ = Math.floor((Math.random() * instance.nStores));
    var customerIndexK;

    do {
        customerIndexK = Math.floor((Math.random() * instance.nCustomers));
    } while (customerIndexK == customerIndexJ);

    var storeIndexK = Math.floor((Math.random() * instance.nStores));


    var currentStoreJ = solutionArray[customerIndexJ];
    var currentStoreK = solutionArray[customerIndexK];


    /*
     Remove customers
     */
    storeSum[currentStoreJ] -= instance.requests[currentStoreJ][customerIndexJ];
    storeSum[currentStoreK] -= instance.requests[currentStoreK][customerIndexK];
    /*
     Add to the new store, this is needed since both customers may be added to the same store
     and using the if I can't check both the same time!
     */
    storeSum[storeIndexJ] += instance.requests[storeIndexJ][customerIndexJ];
    storeSum[storeIndexK] += instance.requests[storeIndexK][customerIndexK];

    var newCost = cost;

    var moves = [];

    if (storeSum[storeIndexJ] <= instance.capacities[storeIndexJ] && storeSum[storeIndexK] <= instance.capacities[storeIndexK]) {

        moves.push({j: customerIndexJ, i: storeIndexJ});
        moves.push({j: customerIndexK, i: storeIndexK});

        newCost = newCost - instance.costs[currentStoreJ][customerIndexJ] + instance.costs[storeIndexJ][customerIndexJ]
            - instance.costs[currentStoreK][customerIndexK] + instance.costs[storeIndexK][customerIndexK];

    }

    /* Re fix store sum variable! It will be possibly updated in the main procedure! */
    storeSum[currentStoreJ] += instance.requests[currentStoreJ][customerIndexJ];
    storeSum[currentStoreK] += instance.requests[currentStoreK][customerIndexK];
    storeSum[storeIndexJ] -= instance.requests[storeIndexJ][customerIndexJ];
    storeSum[storeIndexK] -= instance.requests[storeIndexK][customerIndexK];

    return {
        moves: moves,
        z: newCost
    };

}
