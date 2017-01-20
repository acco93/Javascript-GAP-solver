function vns(solution, instance, MAX_ITER, MAX_PROCESSING_MILLISECONDS, showGraph) {

    graphData = [];

    var localSearches = [
        gap10opt,
        gap11moves,
        gap21moves,
        gap111moves
    ];

    var biggestNeighbourhood = gap211move;


    var DISTURB_FACTOR_PERC = 0.5;
    var iter = 0;

    // copy the costs matrix (and perturbed it!)
    var perturbedCosts = new Array(instance.nStores);
    for (var i = 0; i < instance.nStores; i++) {
        perturbedCosts[i] = new Array(instance.nCustomers);
    }

    var startTime = new Date();

    var remainingTime = MAX_PROCESSING_MILLISECONDS;

    var vndResult = vnd(solution, instance, localSearches, remainingTime);
    solution = vndResult.solution;
    remainingTime -= vndResult.processingTime;

    do {

        var biggestNeighRes = biggestNeighbourhood(copy(solution), instance, remainingTime);
        var newSolution = biggestNeighRes.solution;
        remainingTime -= biggestNeighRes.processingTime;

        var newVndResult = vnd(newSolution, instance, localSearches, remainingTime);
        newSolution = newVndResult.solution;
        remainingTime -= newVndResult.processingTime;


        if (newSolution.z < solution.z) {
            solution = newSolution;
        } else {

            // store the original costs matrix
            var originalCosts = instance.costs;

            instance.costs = perturbMatrix(originalCosts, perturbedCosts, instance.nStores, instance.nCustomers, DISTURB_FACTOR_PERC);

            var perturbedVndResult = vnd(newSolution, instance, localSearches, remainingTime);
            var perturbedSolution = perturbedVndResult.solution;
            remainingTime -= perturbedVndResult.processingTime;


            // restore the instance
            instance.costs = originalCosts;


            // acceptance criterion

            // compute the real cost!
            perturbedSolution.z = z(perturbedSolution.array, instance);

            if (perturbedSolution.z < solution.z) {
                solution = perturbedSolution;
            }

        }

        if (showGraph) {
            graphData[iter] = {
                x: iter,
                y: solution.z
            };
        }


        iter++;
    } while (iter < MAX_ITER && (new Date() - startTime) < MAX_PROCESSING_MILLISECONDS);

    var endTime = new Date();

    return {
        tag: "result",
        functionName: "VNS",
        instance: instance,
        solution: solution,
        processingTime: (endTime - startTime),
        graph: {
            name: "VNS",
            data: graphData
        }
    };

}


function copy(solution) {
    return {
        array: solution.array.slice(),
        z: solution.z,
        storeSum: solution.storeSum.slice()
    };
}

function perturbMatrix(originalMatrix, newMatrix, rows, columns, factor) {

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var perc = (Math.random() * (factor / 2));
            if (Math.random() <= 0.5) {
                perc *= -1;
            }
            newMatrix[i][j] = originalMatrix[i][j] + (originalMatrix[i][j] * perc);
        }
    }

    return newMatrix;
}