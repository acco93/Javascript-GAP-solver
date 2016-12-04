function gap211move(solution, instance) {


    var improved = false;

    var startTime = new Date();

    for (var a = 0; a < instance.nCustomers - 1; a++) {

        var currentStoreA = solution.array[a];

        for (var b = a + 1; b < instance.nCustomers; b++) {

            var currentStoreB = solution.array[b];

            // a and b should be from the same store!
            if (currentStoreA != currentStoreB) {
                continue;
            }

            for (var c = 0; c < instance.nCustomers; c++) {

                var currentStoreC = solution.array[c];

                // I'm searching for another customer (in another store)
                if (c == a || c == b || currentStoreC == currentStoreA) {
                    continue;
                }

                for (var d = 0; d < instance.nCustomers; d++) {

                    var currentStoreD = solution.array[d];

                    // I'm searching for another customer (in another store)
                    if (d == c || d == a || d == b || currentStoreD == currentStoreA || currentStoreD == currentStoreC) {
                        continue;
                    }
                    // A A   C   S <--store index
                    // a b | c | d

                    var newCost;

                    // c | a b | d -> 2-1 move

                    // d | c | a b -> 2-1 move

                    // c | d | a b -> ok (A)

                    // c | a d | b -> ok (B)

                    // c | b d | a -> ok (C)

                    // d | a b | c -> ok (D)


                    // c | d | a b -> ok (A)

                    newCost = solution.z - instance.costs[currentStoreA][a] - instance.costs[currentStoreB][b]
                                         - instance.costs[currentStoreC][c] - instance.costs[currentStoreD][d]
                                         + instance.costs[currentStoreA][c] + instance.costs[currentStoreC][d]
                                         + instance.costs[currentStoreD][a] + instance.costs[currentStoreD][b];

                    if( solution.storeSum[currentStoreA] - instance.requests[currentStoreA][a]
                        - instance.requests[currentStoreA][b] + instance.requests[currentStoreA][c]
                        <= instance.capacities[currentStoreA] &&
                        solution.storeSum[currentStoreC] - instance.requests[currentStoreC][c]
                        + instance.requests[currentStoreC][d] <= instance.capacities[currentStoreC] &&
                        solution.storeSum[currentStoreD] - instance.requests[currentStoreD][d]
                        + instance.requests[currentStoreD][a] + instance.requests[currentStoreD][b]
                        <= instance.capacities[currentStoreD] &&
                        newCost < solution.z
                    ){

                        solution.storeSum[currentStoreA] += - instance.requests[currentStoreA][a]
                        - instance.requests[currentStoreA][b] + instance.requests[currentStoreA][c];

                        solution.storeSum[currentStoreC] += - instance.requests[currentStoreC][c]
                        + instance.requests[currentStoreC][d];

                        solution.storeSum[currentStoreD] += - instance.requests[currentStoreD][d]
                        + instance.requests[currentStoreD][a] + instance.requests[currentStoreD][b];

                        solution.array[a] = currentStoreD;
                        solution.array[b] = currentStoreD;
                        solution.array[c] = currentStoreA;
                        solution.array[d] = currentStoreC;

                        solution.z = newCost;

                        improved = true;
                        break;

                    }

                    if(improved) {break;}

                }
                if(improved) {break;}


            }
            if(improved) {break;}

        }
        if(improved) {break;}

    }

    var endTime = new Date();

    return {
        tag: "result",
        functionName: "1-1 move",
        instance: instance,
        solution: solution,
        processingTime: (endTime - startTime),
        graph: undefined
    };

}