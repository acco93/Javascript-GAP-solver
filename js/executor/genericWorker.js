/**
 * A generic worker able to load some js files and call a main function.
 * It waits for a parameter object = {
 *                                      filesToLoad = [ an array of js files (the path is related to the genericWorker.js file) ]
 *                                      functionToCall = the name (string) of the main function to call. It should be defined
 *                                                       in a file in filesToLoad
 *                                      parameters = [ an array of object to pass to functionToCall ]
 *                                     }
 *
 * The worker returns (postMessage) the function evaluation.
 */

function doWork() {

    // wait for parameters
    self.addEventListener("message", function (event) {

        var parameters = event.data.parameters;
        var filesToLoad = event.data.filesToLoad;
        var functionToCall = event.data.functionToCall;

        for(var i=0;i<filesToLoad.length;i++){
            importScripts(filesToLoad[i]);
        }

        var result = eval(functionToCall).apply(null,parameters);

        postMessage(result);

    },false);

}


doWork();