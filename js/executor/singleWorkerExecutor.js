var queue = [];
var worker = undefined;


function addTask(task){

    var deferred = new $.Deferred();

    queue.push({
        deferred: deferred,
        task: task
    });

    console.log("Added a new task ... ("+queue.length+" in queue)");

    return deferred;
}

function processTasks(){

    var execDeferred = new $.Deferred();

    processRecursively(execDeferred);

    return execDeferred;

}

function processRecursively(execDeferred){

    if(queue.length==0){
        execDeferred.resolve(true);
        worker = undefined;
        return;
    }

    var queueElem = queue.shift();

    var task = queueElem.task;
    var deferred = queueElem.deferred;

    worker = new Worker(task.jsFile);

    worker.postMessage(task.parameters);

    worker.onmessage = function (event) {
        deferred.resolve(event.data);
        processRecursively(execDeferred);
    };
}

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

    worker = new Worker(task.jsFile);

    worker.postMessage(task.parameters);

    worker.onmessage = function (event) {
        deferred.resolve(event.data);
        processTasks();
    };

    return execDeferred;

}
*/



















