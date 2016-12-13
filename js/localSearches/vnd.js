/**
 * Perform a variable neighbourhood descent on solution using the local searches defined.
 * @param solution
 * @param instance
 * @param localSearches
 */
function vnd(solution, instance, localSearches, maxDuration){

    var k=0;

    var startTime = new Date();

    do {

        var oldZ = solution.z;

        solution = localSearches[k](solution, instance, maxDuration).solution;

        if(solution.z < oldZ){
            k=0;
        } else {
            k++;
        }

    } while(k<localSearches.length && (new Date() - startTime) < maxDuration);


    return{
        functionName: "vnd",
        solution: solution,
        processingTime: (new Date()-startTime),
        graph: undefined
    };

}