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
        HTMLElements.verboseLogButton.addClass("btn-default");
        HTMLElements.verboseLogButton.removeClass("btn-success");
    } else {
        AppSettings.verboseLog = true;
        HTMLElements.verboseLogButton.removeClass("btn-default");
        HTMLElements.verboseLogButton.addClass("btn-success");
    }
}

function randomizeCustomers() {
    if (AlgorithmSettings.randomizeCustomers) {
        AlgorithmSettings.randomizeCustomers = false;
        HTMLElements.randomizeCustomersButton.addClass("btn-default");
        HTMLElements.randomizeCustomersButton.removeClass("btn-success");
    } else {
        AlgorithmSettings.randomizeCustomers = true;
        HTMLElements.randomizeCustomersButton.removeClass("btn-default");
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
                HTMLElements.gap10Button.addClass("btn-default");
                HTMLElements.gap10Button.removeClass("btn-success");
            } else {
                AlgorithmSettings.perform10opt = true;
                HTMLElements.gap10Button.removeClass("btn-default");
                HTMLElements.gap10Button.addClass("btn-success");
            }
            break;
        case GAP11OPT:
            if (AlgorithmSettings.perform11opt) {
                AlgorithmSettings.perform11opt = false;
                HTMLElements.gap11Button.addClass("btn-default");
                HTMLElements.gap11Button.removeClass("btn-success");
            } else {
                AlgorithmSettings.perform11opt = true;
                HTMLElements.gap11Button.removeClass("btn-default");
                HTMLElements.gap11Button.addClass("btn-success");
            }
            break;
    }
}

function showChangelog() {
    HTMLElements.changelogModal.modal("show");


    if (Cache.changelog == undefined) {
        HTMLElements.changelogBody.append('<h1 style="text-align=center">Loading ...</h1>');
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
        HTMLElements.sa10Button.addClass("btn-default");
        HTMLElements.sa10Button.removeClass("btn-success");
        HTMLElements.sa10Button.text("OFF");
    } else {
        AlgorithmSettings.performSA10 = true;
        HTMLElements.sa10Button.removeClass("btn-default");
        HTMLElements.sa10Button.addClass("btn-success");
        HTMLElements.sa10Button.text("ON");
    }
}

function toggleSA11() {
    if (AlgorithmSettings.performSA11) {
        AlgorithmSettings.performSA11 = false;
        HTMLElements.sa11Button.addClass("btn-default");
        HTMLElements.sa11Button.removeClass("btn-success");
        HTMLElements.sa11Button.text("OFF");
    } else {
        AlgorithmSettings.performSA11 = true;
        HTMLElements.sa11Button.removeClass("btn-default");
        HTMLElements.sa11Button.addClass("btn-success");
        HTMLElements.sa11Button.text("ON");
    }
}

function toggleTS10() {
    if (AlgorithmSettings.performTS10) {
        AlgorithmSettings.performTS10 = false;
        HTMLElements.ts10Button.addClass("btn-default");
        HTMLElements.ts10Button.removeClass("btn-success");
        HTMLElements.ts10Button.text("OFF");
    } else {
        AlgorithmSettings.performTS10 = true;
        HTMLElements.ts10Button.removeClass("btn-default");
        HTMLElements.ts10Button.addClass("btn-success");
        HTMLElements.ts10Button.text("ON");
    }
}

function toggleILS10() {
    if (AlgorithmSettings.performILS10) {
        AlgorithmSettings.performILS10 = false;
        HTMLElements.ils10Button.addClass("btn-default");
        HTMLElements.ils10Button.removeClass("btn-success");
        HTMLElements.ils10Button.text("OFF");
    } else {
        AlgorithmSettings.performILS10 = true;
        HTMLElements.ils10Button.removeClass("btn-default");
        HTMLElements.ils10Button.addClass("btn-success");
        HTMLElements.ils10Button.text("ON");
    }
}

function toggleILS11() {
    if (AlgorithmSettings.performILS11) {
        AlgorithmSettings.performILS11 = false;
        HTMLElements.ils11Button.addClass("btn-default");
        HTMLElements.ils11Button.removeClass("btn-success");
        HTMLElements.ils11Button.text("OFF");
    } else {
        AlgorithmSettings.performILS11 = true;
        HTMLElements.ils11Button.removeClass("btn-default");
        HTMLElements.ils11Button.addClass("btn-success");
        HTMLElements.ils11Button.text("ON");
    }
}

function toggleVNS() {
    if (AlgorithmSettings.performVNS) {
        AlgorithmSettings.performVNS = false;
        HTMLElements.vnsButton.addClass("btn-default");
        HTMLElements.vnsButton.removeClass("btn-success");
        HTMLElements.vnsButton.text("OFF");
    } else {
        AlgorithmSettings.performVNS = true;
        HTMLElements.vnsButton.removeClass("btn-default");
        HTMLElements.vnsButton.addClass("btn-success");
        HTMLElements.vnsButton.text("ON");
    }
}

function toggleRR() {
    if (AlgorithmSettings.performRR) {
        AlgorithmSettings.performRR = false;
        HTMLElements.rrButton.addClass("btn-default");
        HTMLElements.rrButton.removeClass("btn-success");
    } else {
        AlgorithmSettings.performRR = true;
        HTMLElements.rrButton.removeClass("btn-default");
        HTMLElements.rrButton.addClass("btn-success");
    }
}

var processing;
var executor;
function process() {

    initSession();
    processing = true;

    $('#currentTask').html("Downloading the json");

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

        if (AlgorithmSettings.MAX_ITER < 0) {
            error("Max iterations should be an integer value >= 0 where 0 means &#8734;");
            terminateSession();
            return ERROR;
        } else if (AlgorithmSettings.MAX_ITER == 0) {
            AlgorithmSettings.MAX_ITER = Number.POSITIVE_INFINITY;
        }


        if (AlgorithmSettings.MAX_ITER > 1000000 && AppSettings.showGraphs) {
            warning("Automatically turning off graphs (too many points may cause the page to crash)");
            showGraph();
        }

        var linearRelaxation;
        if (AlgorithmSettings.performRR) {
            $('#currentTask').html("Linear relaxation (Sync)");
            linearRelaxation = solver.Solve(encode(instance));
            info('Linear relaxation cost: '+linearRelaxation.result);
            HTMLElements.sessionDiv.append('<div class="separator"></div>');
        }

        executor = new SingleWorkerExecutor();
        executor.setOutputView($('#currentTask'));

        var solutionConstructionTask = executor.addWorkerTask({
            name: "Constructive heuristic",
            timeout: undefined,
            parameters: [
                instance,
                AlgorithmSettings.randomizeCustomers
            ],
            filesToLoad: [
                "../../js/solutionBuilders/constructiveHeuristic.js"
            ],
            functionToCall: "constructiveHeuristic"
        });

        solutionConstructionTask.then(function (result) {

            showResult(result);

            if (!isFeasible(result.solution.array, instance, false)) {
                warning("Sorry I'm not able to build feasible solution!");
                terminateSession();
                return;
            }


            var solution = result.solution;

            var tasks = [];

            if (AlgorithmSettings.perform10opt) {
                tasks.push(executor.addWorkerTask({
                    name: "1-0 opt",
                    timeout: undefined,
                    parameters: [
                        jQuery.extend(true, {}, solution),
                        instance
                    ],
                    filesToLoad: [
                        "../../js/localSearches/10opt.js"
                    ],
                    functionToCall: "gap10opt"
                }));
            }


            if (AlgorithmSettings.perform11opt) {
                tasks.push(executor.addWorkerTask({
                    name: "1-1 opt",
                    timeout: undefined,
                    parameters: [
                        jQuery.extend(true, {}, solution),
                        instance
                    ],
                    filesToLoad: [
                        "../../js/localSearches/10opt.js",
                        "../../js/localSearches/11moves.js",
                        "../../js/localSearches/11opt.js"
                    ],
                    functionToCall: "gap11opt"
                }));
            }


            if (AlgorithmSettings.performSA10) {
                tasks.push(executor.addWorkerTask({
                    name: "Simulated annealing (1-0 moves)",
                    timeout: AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                    parameters: [
                        jQuery.extend(true, {}, solution),
                        instance,
                        AlgorithmSettings.MAX_ITER,
                        AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                        AppSettings.showGraphs
                    ],
                    filesToLoad: [
                        "../../js/metaheuristics/simulatedAnnealing.js"
                    ],
                    functionToCall: "simulatedAnnealing10Move"
                }));
            }

            if (AlgorithmSettings.performSA11) {
                tasks.push(executor.addWorkerTask({
                    name: "Simulated annealing (1-1 moves)",
                    timeout: AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                    parameters: [
                        jQuery.extend(true, {}, solution),
                        instance,
                        AlgorithmSettings.MAX_ITER,
                        AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                        AppSettings.showGraphs
                    ],
                    filesToLoad: [
                        "../../js/metaheuristics/simulatedAnnealing.js"
                    ],
                    functionToCall: "simulatedAnnealing11Move"
                }));
            }

            if (AlgorithmSettings.performTS10) {
                tasks.push(executor.addWorkerTask({
                    name: "Tabu search (1-0 opt)",
                    timeout: AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                    parameters: [
                        jQuery.extend(true, {}, solution),
                        instance,
                        AlgorithmSettings.MAX_ITER,
                        AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                        AppSettings.showGraphs
                    ],
                    filesToLoad: [
                        "../../js/metaheuristics/tabuSearch.js"
                    ],
                    functionToCall: "tabuSearch"
                }));
            }

            if (AlgorithmSettings.performILS10) {
                tasks.push(executor.addWorkerTask({
                    name: "Iterated local search (1-0 opt)",
                    timeout: AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                    parameters: [
                        jQuery.extend(true, {}, solution),
                        instance,
                        AlgorithmSettings.MAX_ITER,
                        AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                        AppSettings.showGraphs
                    ],
                    filesToLoad: [
                        "../../js/metaheuristics/iteratedLocalSearch.js",
                        "../../js/utilities/algorithmUtilities.js",
                        "../../js/localSearches/10opt.js"
                    ],
                    functionToCall: "iteratedLocalSearch10opt"
                }));
            }

            if (AlgorithmSettings.performILS11) {
                tasks.push(executor.addWorkerTask({
                    name: "Iterated local search (1-1 opt)",
                    timeout: AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                    parameters: [
                        jQuery.extend(true, {}, solution),
                        instance,
                        AlgorithmSettings.MAX_ITER,
                        AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                        AppSettings.showGraphs
                    ],
                    filesToLoad: [
                        "../../js/metaheuristics/iteratedLocalSearch.js",
                        "../../js/utilities/algorithmUtilities.js",
                        "../../js/localSearches/10opt.js",
                        "../../js/localSearches/11moves.js",
                        "../../js/localSearches/11opt.js"
                    ],
                    functionToCall: "iteratedLocalSearch11opt"
                }));
            }

            if (AlgorithmSettings.performVNS) {
                tasks.push(executor.addWorkerTask({
                    name: "VNS",
                    timeout: AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                    parameters: [
                        jQuery.extend(true, {}, solution),
                        instance,
                        AlgorithmSettings.MAX_ITER,
                        AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                        AppSettings.showGraphs
                    ],
                    filesToLoad: [
                        "../../js/utilities/algorithmUtilities.js",
                        "../../js/metaheuristics/vns.js",
                        "../../js/localSearches/vnd.js",
                        "../../js/localSearches/10opt.js",
                        "../../js/localSearches/11moves.js",
                        "../../js/localSearches/21moves.js",
                        "../../js/localSearches/111moves.js",
                        "../../js/localSearches/211move.js"
                    ],
                    functionToCall: "vns"
                }));
            }

            if (AlgorithmSettings.performGrasp) {
                tasks.push(executor.addWorkerTask({
                    name: "GRASP",
                    timeout: AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                    parameters: [
                        instance,
                        AlgorithmSettings.randomizeCustomers,
                        //10, // k: candidate list elements
                        AlgorithmSettings.MAX_ITER,
                        AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                        AppSettings.showGraphs
                    ],
                    filesToLoad: [
                        "../../js/utilities/algorithmUtilities.js",
                        "../../js/metaheuristics/grasp.js",
                        "../../js/localSearches/10opt.js",
                        "../../js/localSearches/11moves.js",
                        "../../js/localSearches/11opt.js"
                    ],
                    functionToCall: "grasp"
                }));
            }

            if (AlgorithmSettings.performRR) {
                //var linearRelaxation = solver.Solve(encode(instance));

                tasks.push(executor.addWorkerTask({
                    name: "Randomized rounding",
                    timeout: AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                    parameters: [
                        instance,
                        linearRelaxation,
                        AlgorithmSettings.MAX_ITER,
                        AlgorithmSettings.MAX_PROCESSING_MILLISECONDS,
                        AppSettings.showGraphs
                    ],
                    filesToLoad: [
                        "../../js/utilities/algorithmUtilities.js",
                        "../../js/decoders/jsLPSolverDecoder.js",
                        "../../js/metaheuristics/randomizedRounding.js"
                    ],
                    functionToCall: "randomizedRounding"
                }));

            }


            var delta = 100 / tasks.length;

            for (var i = 0; i < tasks.length; i++) {
                tasks[i].then(function (result) {
                    showResult(result);
                    incrementProgressBar(delta);
                });
            }


            executor.processTasks().then(function (value) {
                processing = false;

                setTimeout(function () {
                    terminateSession();
                    unlockScreen();
                }, 800);

            });

        });

        executor.processTasks();


    });

}


function abortComputation() {
    if (!processing || executor == undefined) {
        return;
    }
    executor.shutdown();
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

    if (!AlgorithmSettings.performILS10) {
        toggleILS10();
    }

    if (!AlgorithmSettings.performILS11) {
        toggleILS11();
    }

    if (!AlgorithmSettings.performVNS) {
        toggleVNS();
    }

    if (!AlgorithmSettings.performGrasp) {
        toggleGrasp();
    }

    if (!AlgorithmSettings.performRR) {
        toggleRR();
    }

}

function resetJsonExample() {
    var example = {
        "name": "esempietto",
        "numcustomers": 6,
        "numfacilities": 3,
        "cost": [[11, 12, 13, 14, 15, 16],
            [21, 22, 23, 24, 25, 26],
            [31, 32, 33, 34, 35, 36]],
        "req": [[4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4]],
        "cap": [10, 10, 10]
    };
    HTMLElements.textArea.val(JSON.stringify(example, undefined, 4));
    onTextAreaClick();
}

function randomJsonExample() {

    var name = "random example";
    var nCustomers = Math.floor(Math.random() * 100) + 1;
    var nStores = Math.floor(Math.random() * 10) + 1;

    var costs = new Array(nStores);
    var req = new Array(nStores);
    var cap = new Array(nStores);

    for (var i = 0; i < nStores; i++) {
        costs[i] = new Array(nCustomers);
        req[i] = new Array(nCustomers);
        for (var j = 0; j < nCustomers; j++) {
            costs[i][j] = Math.floor(Math.random() * 100);
            req[i][j] = Math.floor(Math.random() * 50);
        }
        cap[i] = Math.floor(Math.random() * 500);
    }

    var randomExample = {
        "name": name,
        "numcustomers": nCustomers,
        "numfacilities": nStores,
        "cost": costs,
        "req": req,
        "cap": cap
    };

    HTMLElements.textArea.val(JSON.stringify(randomExample, undefined, 4));
    onTextAreaClick();
}

function prettyPrint() {
    var ugly = document.getElementById('textarea').value;
    var obj = JSON.parse(ugly);
    var pretty = JSON.stringify(obj, undefined, 4);
    document.getElementById('textarea').value = pretty;
    onTextAreaClick();
}

function toggleGrasp() {
    if (AlgorithmSettings.performGrasp) {
        AlgorithmSettings.performGrasp = false;
        HTMLElements.graspButton.addClass("btn-default");
        HTMLElements.graspButton.removeClass("btn-success");
    } else {
        AlgorithmSettings.performGrasp = true;
        HTMLElements.graspButton.removeClass("btn-default");
        HTMLElements.graspButton.addClass("btn-success");
    }
}


function clearInput() {

    HTMLElements.input.val("");
    $("#urlList").each(function () {
        $(this).find('li').each(function () {
            $(this).show();
        });
    });
    HTMLElements.noUrlMatch.hide();
    HTMLElements.input.focus();
}

function showGraph() {
    if (AppSettings.showGraphs) {
        HTMLElements.showGraphButton.removeClass("btn-success");
        HTMLElements.showGraphButton.addClass("btn-default");
        AppSettings.showGraphs = false;
    } else {
        HTMLElements.showGraphButton.removeClass("btn-default");
        HTMLElements.showGraphButton.addClass("btn-success");
        AppSettings.showGraphs = true;
    }


}

function disableAllButtons(){

    if (AlgorithmSettings.randomizeCustomers) {
        randomizeCustomers();
    }

    if (AppSettings.verboseLog) {
        toggleLog();
    }

    if (AlgorithmSettings.perform10opt) {
        toggleLocalSearch(GAP10OPT);
    }

    if (AlgorithmSettings.perform11opt) {
        toggleLocalSearch(GAP11OPT);
    }

    if (AlgorithmSettings.performSA10) {
        toggleSA10();
    }

    if (AlgorithmSettings.performSA11) {
        toggleSA11();
    }


    if (AlgorithmSettings.performTS10) {
        toggleTS10();
    }

    if (AlgorithmSettings.performILS10) {
        toggleILS10();
    }

    if (AlgorithmSettings.performILS11) {
        toggleILS11();
    }

    if (AlgorithmSettings.performVNS) {
        toggleVNS();
    }

    if (AlgorithmSettings.performGrasp) {
        toggleGrasp();
    }

    if (AlgorithmSettings.performRR) {
        toggleRR();
    }


}