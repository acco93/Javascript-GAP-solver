/**
 * Perform a variable neighbourhood descent on solution using the local searches defined.
 * @param solution
 * @param instance
 * @param localSearches
 */
function vnd(solution, instance, localSearches){

    var k=0;

    do {

        var oldZ = solution.z;

        solution = localSearches[k](solution, instance).solution;

        if(solution.z < oldZ){
            k=0;
        } else {
            k++;
        }

    } while(k<localSearches.length);

    return solution;

}