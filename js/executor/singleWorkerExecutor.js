var SingleWorkerExecutor = function () {
    this.queue = [];
    this.worker = undefined;
};

/**
 * Add a task to the queue.
 *
 * @param task
 * @returns {$.Deferred} a promise solved when the task completes.
 */
SingleWorkerExecutor.prototype.addTask = function (task) {

    var deferred = new $.Deferred();

    this.queue.push({
        deferred: deferred,
        task: task
    });

    //console.log("Added a new task ... ("+queue.length+" in queue)");

    return deferred;

};

/**
 * Shortcut to add a task where the worker file is genericWorker.js
 * @param task
 * @returns {$.Deferred}
 */
SingleWorkerExecutor.prototype.addWorkerTask = function (task) {

    return this.addTask({
        workerFile: "js/executor/genericWorker.js",
        parameters: task
    });

};

/**
 * Start the computation.
 * @returns {$.Deferred} a promise resolved when all tasks have been processed.
 */
SingleWorkerExecutor.prototype.processTasks = function () {

    var execDeferred = new $.Deferred();

    processRecursively(execDeferred, this);

    return execDeferred;

};

/**
 * (Private function) Recursively process the tasks in the queue.
 * @param execDeferred
 */
function processRecursively(execDeferred, context) {

    console.log(context);

    if (context.queue.length == 0) {
        execDeferred.resolve(true);
        context.worker = undefined;
        return;
    }

    var queueElem = context.queue.shift();

    var task = queueElem.task;
    var deferred = queueElem.deferred;

    context.worker = new Worker(task.workerFile);

    context.worker.postMessage(task.parameters);

    context.worker.onmessage = function (event) {

        switch (event.data.tag) {
            case "result":
                deferred.resolve(event.data);
                processRecursively(execDeferred, context);
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
SingleWorkerExecutor.prototype.shutdown = function() {

    if (this.worker == undefined) {
        return;
    }

    this.worker.terminate();
    //console.log("Shutting down... " + queue.length + " task(s) queued lost.");
    this.worker = undefined;
    this.queue.length = 0;

};