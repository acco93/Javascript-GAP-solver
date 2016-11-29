/*
 Used in constructive heuristic to sort the stores given a customer
 */
var KEY = 0;
var VALUE = 1;
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
function onTextAreaClick(){
    HTMLElements.processButton.text("Process (the above text area)");
    AppSettings.whatToProcess = PASTED_CODE;
}

/*
 Handle input field click
 */
function onInputClick(){
    HTMLElements.processButton.text("Process (the URL)");
    AppSettings.whatToProcess = URL;
}

function clearAllSessions(){
    HTMLElements.output.empty();
}


function clearSession(session){

    var div = $('div[session="'+session+'"]');


    div.fadeOut("fast",function(){
        div.remove();
    });

}

function toggleLog(){
    if(AppSettings.verboseLog){
        AppSettings.verboseLog = false;
        HTMLElements.verboseLogButton.addClass("btn-danger");
        HTMLElements.verboseLogButton.removeClass("btn-success");
    } else {
        AppSettings.verboseLog = true;
        HTMLElements.verboseLogButton.removeClass("btn-danger");
        HTMLElements.verboseLogButton.addClass("btn-success");
    }
}

function randomizeCustomers(){
    if(AlgorithmSettings.randomizeCustomers){
        AlgorithmSettings.randomizeCustomers = false;
        HTMLElements.randomizeCustomersButton.addClass("btn-danger");
        HTMLElements.randomizeCustomersButton.removeClass("btn-success");
    } else {
        AlgorithmSettings.randomizeCustomers = true;
        HTMLElements.randomizeCustomersButton.removeClass("btn-danger");
        HTMLElements.randomizeCustomersButton.addClass("btn-success");
    }
}

function changeUrl(url){
    HTMLElements.input.val(url);
    onInputClick();
}

function toggleLocalSearch(index){
    switch(index){
        case GAP10OPT:
            if(AlgorithmSettings.perform10opt) {
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
            if(AlgorithmSettings.perform11opt) {
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

function showChangelog(){
    HTMLElements.changelogModal.modal("show");
    HTMLElements.changelogBody.append('<h1 style="text-align=center">Loading ...</h1>');

    if(Cache.changelog == undefined) {
        $.getJSON( "https://api.bitbucket.org/2.0/repositories/acco93/gap-solver-js/commits", function( data ) {
            HTMLElements.changelogBody.empty();
            Cache.changelog = data;

            var date = new Date(data.values[0].date);
            HTMLElements.changelogBody.append("<p><strong>"+date.toDateString()+"</strong> "+data.values[0].message+"</p>");
            for(var i=1;i < data.values.length; i++){
                date = new Date(data.values[i].date);
                HTMLElements.changelogBody.append("<p><small><strong>"+date.toDateString()+"</strong> "+data.values[i].message+"</small></p>");
            }
        });
    }

}

function toggleSA10(){
    if(AlgorithmSettings.performSA10){
        AlgorithmSettings.performSA10 =  false;
        HTMLElements.sa10Button.addClass("btn-danger");
        HTMLElements.sa10Button.removeClass("btn-success");
    } else {
        AlgorithmSettings.performSA10 = true;
        HTMLElements.sa10Button.removeClass("btn-danger");
        HTMLElements.sa10Button.addClass("btn-success");
    }
}

function toggleSA11(){
    if(AlgorithmSettings.performSA11){
        AlgorithmSettings.performSA11 =  false;
        HTMLElements.sa11Button.addClass("btn-danger");
        HTMLElements.sa11Button.removeClass("btn-success");
    } else {
        AlgorithmSettings.performSA11 = true;
        HTMLElements.sa11Button.removeClass("btn-danger");
        HTMLElements.sa11Button.addClass("btn-success");
    }
}

function toggleTS10(){
    if(AlgorithmSettings.performTS10){
        AlgorithmSettings.performTS10 =  false;
        HTMLElements.ts10Button.addClass("btn-danger");
        HTMLElements.ts10Button.removeClass("btn-success");
    } else {
        AlgorithmSettings.performTS10 = true;
        HTMLElements.ts10Button.removeClass("btn-danger");
        HTMLElements.ts10Button.addClass("btn-success");
    }
}

function toggleILS10(){
    if(AlgorithmSettings.performILS10){
        AlgorithmSettings.performILS10 =  false;
        HTMLElements.ils10Button.addClass("btn-danger");
        HTMLElements.ils10Button.removeClass("btn-success");
    } else {
        AlgorithmSettings.performILS10 = true;
        HTMLElements.ils10Button.removeClass("btn-danger");
        HTMLElements.ils10Button.addClass("btn-success");
    }
}

function toggleILS11(){
    if(AlgorithmSettings.performILS11){
        AlgorithmSettings.performILS11 =  false;
        HTMLElements.ils11Button.addClass("btn-danger");
        HTMLElements.ils11Button.removeClass("btn-success");
    } else {
        AlgorithmSettings.performILS11 = true;
        HTMLElements.ils11Button.removeClass("btn-danger");
        HTMLElements.ils11Button.addClass("btn-success");
    }
}

function process(){

    initSession();

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

        var startTime = new Date();
        var solution = constructiveHeuristic(instance);
        var endTime = new Date();

        info("[Constructive heuristic] Processing time: " + (endTime - startTime) + " milliseconds.");
        log("Solution cost: " + solution.z);

        var feasible = isFeasible(solution.array, instance);

        log("is feasible: " + feasible);

        if (AppSettings.verboseLog) {
            verbosePrint(solution, instance);
        }

        if(feasible){
            perform10opt(solution, instance);
            perform11opt(solution, instance);
            performSA10move(solution, instance);
            performSA11move(solution, instance);
            performTS10move(solution, instance);
            performILS10opt(solution, instance);
            performILS11opt(solution, instance);
        } else {
            warning("Constructive heuristic returned a not feasible solution");
        }

        terminateSession();

    });

}

function perform10opt(solution, instance){
    return performGenericFunction(AlgorithmSettings.perform10opt, gap10opt, solution, instance, "1-0 opt", "10opt"+session);
}

function perform11opt(solution, instance){
    return performGenericFunction(AlgorithmSettings.perform11opt, gap11opt, solution, instance, "1-1 opt","11opt"+session);
}

function performSA10move(solution, instance){
    return performGenericFunction(AlgorithmSettings.performSA10,
                                    simulatedAnnealing10Move,
                                    solution,
                                    instance,
                                    "Simulated Annealing (1-0 move)",
                                    "SA10"+session);
}

function performSA11move(solution, instance){
    return performGenericFunction(AlgorithmSettings.performSA11,
        simulatedAnnealing11Move,
        solution,
        instance,
        "Simulated Annealing (1-1 move)",
        "SA11"+session);
}

function performTS10move(solution, instance){
    return performGenericFunction(AlgorithmSettings.performTS10,
        tabuSearch,
        solution,
        instance,
        "Tabu search (1-0 move)",
        "TS11"+session);
}

function performILS10opt(solution, instance){
    return performGenericFunction(AlgorithmSettings.performILS10,
        iteratedLocalSearch10opt,
        solution,
        instance,
        "Iterated local search (1-0 opt)",
        "ILS10"+session);
}

function performILS11opt(solution, instance){
    return performGenericFunction(AlgorithmSettings.performILS11,
        iteratedLocalSearch11opt,
        solution,
        instance,
        "Iterated local search (1-1 opt)",
        "ILS11"+session);
}

function performGenericFunction(flag, fun, solution, instance, name, uniqueName){

    if(!flag){
        return solution;
    }

    // copy the solution
    var solutionCopy = {
        array: solution.array.slice(),
        z: solution.z,
        storeSum: solution.storeSum.slice()
    };



    var startTime = new Date();
    var result = fun(solutionCopy, instance);
    var endTime = new Date();
    info("["+name+"] Processing time: " + (endTime - startTime) + " milliseconds.");
    log("Solution cost: " + result.solution.z);
    log("Is feasible: " + isFeasible(result.solution.array, instance));

    if (AppSettings.verboseLog) {
        verbosePrint(result.solution, instance);
    }

    if(result.graphData != undefined){
        drawGraph(name, uniqueName, result.graphData);
    }

    return result.solution;

}
