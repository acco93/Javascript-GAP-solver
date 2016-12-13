function gap11opt(solution, instance, maxDuration) {

    if(maxDuration == undefined){
        maxDuration = Number.MAX_VALUE;
    }


    var startTime = new Date();

    do {
        var improved = false;

        var oldZ = solution.z;

        solution = gap10opt(solution, instance, maxDuration).solution;

        solution = gap11moves(solution, instance, maxDuration).solution;

        if (solution.z < oldZ) {
            improved = true;
        }

    } while (improved && (new Date() - startTime) < maxDuration);

    var endTime = new Date();

    return {
        tag: "result",
        functionName: "1-1 opt",
        instance: instance,
        solution: solution,
        processingTime: (endTime - startTime),
        graph: undefined
    };

}