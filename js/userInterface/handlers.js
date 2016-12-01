/*
 What to process values
 */
var URL = 0;
var PASTED_CODE = 1;
/*
 Local searches index
 */
var GAP10OPT = 0;
var GAP11OPT = 1;

/**
 * User interface components handlers.
 */

function lockScreen() {
    document.getElementById("myNav").style.width = "100%";
}

function unlockScreen() {
    document.getElementById("myNav").style.width = "0%";
}

/*
 Handle text area click
 */
function onTextAreaClick() {
    HTMLElements.processButton.text("Process (the above text area)");
    AppSettings.whatToProcess = PASTED_CODE;
}

/*
 Handle input field click
 */
function onInputClick() {
    HTMLElements.processButton.text("Process (the URL)");
    AppSettings.whatToProcess = URL;
}

function clearAllSessions() {
    HTMLElements.output.empty();
}


function clearSession(session) {

    var div = $('div[session="' + session + '"]');


    div.fadeOut("fast", function () {
        div.remove();
    });

}

function toggleLog() {
    if (AppSettings.verboseLog) {
        AppSettings.verboseLog = false;
        HTMLElements.verboseLogButton.addClass("btn-danger");
        HTMLElements.verboseLogButton.removeClass("btn-success");
    } else {
        AppSettings.verboseLog = true;
        HTMLElements.verboseLogButton.removeClass("btn-danger");
        HTMLElements.verboseLogButton.addClass("btn-success");
    }
}

function randomizeCustomers() {
    if (AlgorithmSettings.randomizeCustomers) {
        AlgorithmSettings.randomizeCustomers = false;
        HTMLElements.randomizeCustomersButton.addClass("btn-danger");
        HTMLElements.randomizeCustomersButton.removeClass("btn-success");
    } else {
        AlgorithmSettings.randomizeCustomers = true;
        HTMLElements.randomizeCustomersButton.removeClass("btn-danger");
        HTMLElements.randomizeCustomersButton.addClass("btn-success");
    }
}

function changeUrl(url) {
    HTMLElements.input.val(url);
    onInputClick();
}

function toggleLocalSearch(index) {
    switch (index) {
        case GAP10OPT:
            if (AlgorithmSettings.perform10opt) {
                AlgorithmSettings.perform10opt = false;
                HTMLElements.gap10Button.addClass("btn-danger");
                HTMLElements.gap10Button.removeClass("btn-success");
            } else {
                AlgorithmSettings.perform10opt = true;
                HTMLElements.gap10Button.removeClass("btn-danger");
                HTMLElements.gap10Button.addClass("btn-success");
            }
            break;
        case GAP11OPT:
            if (AlgorithmSettings.perform11opt) {
                AlgorithmSettings.perform11opt = false;
                HTMLElements.gap11Button.addClass("btn-danger");
                HTMLElements.gap11Button.removeClass("btn-success");
            } else {
                AlgorithmSettings.perform11opt = true;
                HTMLElements.gap11Button.removeClass("btn-danger");
                HTMLElements.gap11Button.addClass("btn-success");
            }
            break;
    }
}

function showChangelog() {
    HTMLElements.changelogModal.modal("show");
    HTMLElements.changelogBody.append('<h1 style="text-align=center">Loading ...</h1>');

    if (Cache.changelog == undefined) {
        $.getJSON("https://api.bitbucket.org/2.0/repositories/acco93/gap-solver-js/commits", function (data) {
            HTMLElements.changelogBody.empty();
            Cache.changelog = data;

            var date = new Date(data.values[0].date);
            HTMLElements.changelogBody.append("<p><strong>" + date.toDateString() + "</strong> " + data.values[0].message + "</p>");
            for (var i = 1; i < data.values.length; i++) {
                date = new Date(data.values[i].date);
                HTMLElements.changelogBody.append("<p><small><strong>" + date.toDateString() + "</strong> " + data.values[i].message + "</small></p>");
            }
        });
    }

}

function toggleSA10() {
    if (AlgorithmSettings.performSA10) {
        AlgorithmSettings.performSA10 = false;
        HTMLElements.sa10Button.addClass("btn-danger");
        HTMLElements.sa10Button.removeClass("btn-success");
    } else {
        AlgorithmSettings.performSA10 = true;
        HTMLElements.sa10Button.removeClass("btn-danger");
        HTMLElements.sa10Button.addClass("btn-success");
    }
}

function toggleSA11() {
    if (AlgorithmSettings.performSA11) {
        AlgorithmSettings.performSA11 = false;
        HTMLElements.sa11Button.addClass("btn-danger");
        HTMLElements.sa11Button.removeClass("btn-success");
    } else {
        AlgorithmSettings.performSA11 = true;
        HTMLElements.sa11Button.removeClass("btn-danger");
        HTMLElements.sa11Button.addClass("btn-success");
    }
}

function toggleTS10() {
    if (AlgorithmSettings.performTS10) {
        AlgorithmSettings.performTS10 = false;
        HTMLElements.ts10Button.addClass("btn-danger");
        HTMLElements.ts10Button.removeClass("btn-success");
    } else {
        AlgorithmSettings.performTS10 = true;
        HTMLElements.ts10Button.removeClass("btn-danger");
        HTMLElements.ts10Button.addClass("btn-success");
    }
}

function toggleILS10() {
    if (AlgorithmSettings.performILS10) {
        AlgorithmSettings.performILS10 = false;
        HTMLElements.ils10Button.addClass("btn-danger");
        HTMLElements.ils10Button.removeClass("btn-success");
    } else {
        AlgorithmSettings.performILS10 = true;
        HTMLElements.ils10Button.removeClass("btn-danger");
        HTMLElements.ils10Button.addClass("btn-success");
    }
}

function toggleILS11() {
    if (AlgorithmSettings.performILS11) {
        AlgorithmSettings.performILS11 = false;
        HTMLElements.ils11Button.addClass("btn-danger");
        HTMLElements.ils11Button.removeClass("btn-success");
    } else {
        AlgorithmSettings.performILS11 = true;
        HTMLElements.ils11Button.removeClass("btn-danger");
        HTMLElements.ils11Button.addClass("btn-success");
    }
}


var processing;
function process() {

    initSession();
    processing = true;
    // load the json (download or read it according to the user needs)
    loadJSON().then(function (data) {

        if (data == undefined) {
            error("Is it a valid json?");
            terminateSession();
            return ERROR;
        }

        var instance = checkAndSetInstance(data);

        if (instance == undefined) {
            error("Malformed instance!");
            terminateSession();
            return ERROR;
        }

        if (AppSettings.verboseLog) {
            printInstance(instance);
        }

        // setup max processing time and iterations
        AlgorithmSettings.MAX_PROCESSING_MILLISECONDS = getProcessingTime();
        AlgorithmSettings.MAX_ITER = HTMLElements.iterInput.val();


        var solutionConstructionTask = addTask({
            jsFile: "js/solutionBuilders/constructiveHeuristic.js",
            parameters: {instance: instance, randomizeCustomers: AppSettings.randomizeCustomers}
        });

        solutionConstructionTask.then(function (result) {
            showResult(result);

            if (!isFeasible(result.solution.array, instance)) {
                warning("Constructive heuristic returned a not feasible solution");
            }

            var solution = result.solution;

            var tasks = [];

            if (AlgorithmSettings.perform10opt) {
                tasks.push(addTask({
                    jsFile: "js/localSearches/10opt.js",
                    parameters: {instance: instance, solution: jQuery.extend(true, {}, solution)}
                }));
            }

            if (AlgorithmSettings.perform11opt) {
                tasks.push(addTask({
                    jsFile: "js/localSearches/11opt.js",
                    parameters: {instance: instance, solution: jQuery.extend(true, {}, solution)}
                }));
            }

            if (AlgorithmSettings.performSA10) {
                tasks.push(addTask({
                    jsFile: "js/metaheuristics/simulatedAnnealing.js",
                    parameters: {
                        instance: instance,
                        solution: jQuery.extend(true, {}, solution),
                        neighbourFunctionName: "10opt",
                        MAX_ITER: AlgorithmSettings.MAX_ITER,
                        MAX_PROCESSING_MILLISECONDS: AlgorithmSettings.MAX_PROCESSING_MILLISECONDS
                    }
                }));
            }

            if (AlgorithmSettings.performSA11) {
                tasks.push(addTask({
                    jsFile: "js/metaheuristics/simulatedAnnealing.js",
                    parameters: {
                        instance: instance,
                        solution: jQuery.extend(true, {}, solution),
                        neighbourFunctionName: "11opt",
                        MAX_ITER: AlgorithmSettings.MAX_ITER,
                        MAX_PROCESSING_MILLISECONDS: AlgorithmSettings.MAX_PROCESSING_MILLISECONDS
                    }
                }));
            }


            if (AlgorithmSettings.performTS10) {
                tasks.push(addTask({
                    jsFile: "js/metaheuristics/tabuSearch.js",
                    parameters: {
                        instance: instance,
                        solution: jQuery.extend(true, {}, solution),
                        MAX_ITER: AlgorithmSettings.MAX_ITER,
                        MAX_PROCESSING_MILLISECONDS: AlgorithmSettings.MAX_PROCESSING_MILLISECONDS
                    }
                }));

            }

            if (AlgorithmSettings.performILS10) {
                tasks.push(addTask({
                    jsFile: "js/metaheuristics/iteratedLocalSearch.js",
                    parameters: {
                        instance: instance,
                        solution: jQuery.extend(true, {}, solution),
                        localSearch: "10opt",
                        MAX_ITER: AlgorithmSettings.MAX_ITER,
                        MAX_PROCESSING_MILLISECONDS: AlgorithmSettings.MAX_PROCESSING_MILLISECONDS
                    }
                }));
            }

            if (AlgorithmSettings.performILS11) {
                tasks.push(addTask({
                    jsFile: "js/metaheuristics/iteratedLocalSearch.js",
                    parameters: {
                        instance: instance,
                        solution: jQuery.extend(true, {}, solution),
                        localSearch: "11opt",
                        MAX_ITER: AlgorithmSettings.MAX_ITER,
                        MAX_PROCESSING_MILLISECONDS: AlgorithmSettings.MAX_PROCESSING_MILLISECONDS
                    }
                }));
            }


            var delta = 100 / tasks.length;

            for (var i = 0; i < tasks.length; i++) {
                tasks[i].then(function (result) {
                    showResult(result);
                    incrementProgressBar(delta);
                });
            }


            processTasks().then(function (value) {
                processing = false;
                console.log("All tasks are finished!");
                setTimeout(function () {
                    terminateSession();
                    unlockScreen();
                }, 800);

            });

        });

        processTasks();


    });

}


function abortComputation() {
    if (!processing) {
        return;
    }
    shutdown();
    warning("/!\\ Computation aborted /!\\");
    resetProgressBar();
    terminateSession();
}

function resetConfig() {

    if (AlgorithmSettings.randomizeCustomers) {
        randomizeCustomers();
    }

    if (AppSettings.verboseLog) {
        toggleLog();
    }

    HTMLElements.iterInput.val("5000");
    resetProcessingTime();


    if (!AlgorithmSettings.perform10opt) {
        toggleLocalSearch(GAP10OPT);
    }

    if (AlgorithmSettings.perform11opt) {
        toggleLocalSearch(GAP11OPT);
    }

    if (!AlgorithmSettings.performSA10) {
        toggleSA10();
    }

    if (!AlgorithmSettings.performSA11) {
        toggleSA11();
    }


    if (!AlgorithmSettings.performTS10) {
        toggleTS10();
    }

    if(!AlgorithmSettings.performILS10){
        toggleILS10();
    }

    if(!AlgorithmSettings.performILS11){
        toggleILS11();
    }


}