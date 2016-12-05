
function vns(solution, instance, MAX_ITER, MAX_PROCESSING_MILLISECONDS){

	graphData = [];

    var localSearches = [
        gap10opt,
        gap11moves,
        gap21moves,
        gap111moves
    ];

    var biggestNeighbourhood = gap211move;

    var iter = 0;

    var startTime = new Date();

    solution = vnd(solution, instance, localSearches);

    do {

        var newSolution = biggestNeighbourhood(copy(solution),instance).solution;

        newSolution = vnd(newSolution, instance, localSearches);

        if(newSolution.z < solution.z) {
            solution = newSolution;
        }

		graphData[iter] = {
		    x: iter,
		    y: solution.z
		};

        iter++;
    } while(iter < MAX_ITER && (new Date() - startTime) < MAX_PROCESSING_MILLISECONDS);

    var endTime = new Date();

    return {
        tag: "result",
        functionName: "VNS",
        instance: instance,
        solution: solution,
        processingTime: (endTime - startTime),
        graph: {
			name:"VNS",
			data: graphData		
		}
    };

}

function performLocalSearches(solution, instance, localSearches) {

    for(var i=0;i<localSearches.length; i++){

        solution = localSearches[i](solution, instance).solution;

    }

    return solution;

}

function copy(solution){
    return {
        array: solution.array.slice(),
        z: solution.z,
        storeSum: solution.storeSum.slice()
    };
}
