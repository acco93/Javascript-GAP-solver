function gap11opt(solution, instance) {

    var startTime = new Date();

    do {
        var improved = false;

        var oldZ = solution.z;

        solution = gap10opt(solution, instance).solution;

        solution = gap11moves(solution, instance).solution;

        if (solution.z < oldZ) {
            improved = true;
        }

    } while (improved);

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