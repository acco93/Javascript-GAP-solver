/**
 * Single worker executor.
 * Add some tasks to the queue and process them sequentially.
 *
 */

var queue = [];
var worker = undefined;

/**
 * Add a task to the queue.
 *
 * @param task
 * @returns {$.Deferred} a promise solved when the task completes.
 */
function addTask(task){

    var deferred = new $.Deferred();

    queue.push({
        deferred: deferred,
        task: task
    });

    //console.log("Added a new task ... ("+queue.length+" in queue)");

    return deferred;
}

/**
 * Shortcut to add a task where the worker file is genericWorker.js
 * @param task
 * @returns {$.Deferred}
 */
function addWorkerTask(task) {

    return addTask({
        workerFile: "js/executor/genericWorker.js",
        parameters: task
    });

}

/**
 * Start the computation.
 * @returns {$.Deferred} a promise resolved when all tasks have been processed.
 */
function processTasks(){

    var execDeferred = new $.Deferred();

    processRecursively(execDeferred);

    return execDeferred;

}

/**
 * (Private function) Recursively process the tasks in the queue.
 * @param execDeferred
 */
function processRecursively(execDeferred){

    if(queue.length==0){
        execDeferred.resolve(true);
        worker = undefined;
        return;
    }

    var queueElem = queue.shift();

    var task = queueElem.task;
    var deferred = queueElem.deferred;

    worker = new Worker(task.workerFile);

    worker.postMessage(task.parameters);

    worker.onmessage = function (event) {

        switch(event.data.tag) {
            case "result":
                deferred.resolve(event.data);
                processRecursively(execDeferred);
                break;
            case "warning":
                warning(event.data.msg);
                break;
            case "error":
                error(event.data.msg);
                break;
            case "info":
                info(event.data.msg);
                break;
        }

    };
}

/**
 * Stop the executor.
 */
function shutdown(){

    if(worker == undefined){
        return;
    }

    worker.terminate();
    console.log("Shutting down... "+queue.length+" task(s) queued lost.");
    worker = undefined;
    queue.length = 0;

}












/*
function processTasks(){

    var execDeferred = new $.Deferred();

    if(queue.length==0){
        execDeferred.resolve(true);
        return;
    }

    var queueElem = queue.shift();

    var task = queueElem.task;
    var deferred = queueElem.deferred;

    worker = new Worker(task.workerFile);

    worker.postMessage(task.parameters);

    worker.onmessage = function (event) {
        deferred.resolve(event.data);
        processTasks();
    };

    return execDeferred;

}
*/



















