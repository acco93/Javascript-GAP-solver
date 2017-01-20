function randomizedRounding(instance, linearRelaxation, MAX_ITER, MAX_PROCESSING_MILLISECONDS, showGraph) {

    var graphData = [];

    // translate the instance into a suitable model
    //var model = encode(instance);
    //var result = solver.Solve(model);
    var x = decode(instance, linearRelaxation);

    //potrei alterare x e mettere prob molto basse dove c'è 0

    for (i = 0; i < instance.nStores; i++) {
        for (j = 0; j < instance.nCustomers; j++) {
            x[i][j] += 0.01;
        }
    }

    var solutionArray = new Array(instance.nCustomers);


    var bestSolution = undefined;


    var iter = 0;

    var startTime = new Date();
    do {

        for (var j = 0; j < instance.nCustomers; j++) {
            solutionArray[j] = montecarlo(x, instance.nStores, j);
        }

        if (isFeasible(solutionArray, instance, false)) {
            var cost = z(solutionArray, instance);
            if (bestSolution == undefined || cost < bestSolution.z) {
                bestSolution = {
                    array: solutionArray.slice(),
                    z: cost
                }
            }

            if (showGraph) {
                graphData[iter] = {
                    x: iter,
                    y: cost
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

    if (bestSolution != undefined) {
        var bestSolutionStoreSum = new Array(instance.nStores);
        for (j = 0; j < instance.nStores; j++) {
            bestSolutionStoreSum[j] = 0;
        }
        for (j = 0; j < instance.nCustomers; j++) {
            bestSolutionStoreSum[bestSolution.array[j]] += instance.requests[bestSolution.array[j]][j];
        }

        bestSolution.storeSum = bestSolutionStoreSum;
    }


    return {
        tag: "result",
        functionName: "Randomized rounding",
        instance: instance,
        solution: bestSolution,
        processingTime: (endTime - startTime),
        graph: {
            name: "RR",
            data: graphData
        }
    };


}

function montecarlo(x, rows, column) {
    var i;

    var sum = 0;
    for (i = 0; i < rows; i++) {
        sum += x[i][column];
    }

    var threshold = sum * Math.random();

    for (i = 0, sum = 0; i < rows; i++) {
        sum += x[i][column];
        if (sum >= threshold) {
            return i;
        }
    }

}