
/*
 Print instance info
 */
function printInstance(instance) {
    info("Instance info:");
    info("Stores: " + instance.nStores);
    info("Customers: " + instance.nCustomers);
    info("Costs: ");
    printMatrix(instance.costs, instance.nStores, instance.nCustomers);
    info("Requests: ");
    printMatrix(instance.requests, instance.nStores, instance.nCustomers);
    info("Stores capacities: " + instance.capacities);
}

/*
 Print loong and useless info
 */
function verbosePrint(solution, instance) {

    for (var i = 0; i < instance.nStores; i++) {
        log("Store " + i + " requests: " + solution.storeSum[i] + " < " + instance.capacities[i]);
    }

	var extSolution = new Array(instance.nStores);

    log("Solution:");
	for(var i=0;i<instance.nStores;i++){
		extSolution[i] = "[Store "+i+"] ";
	}	

	for(var j=0;j<instance.nCustomers; j++){
		extSolution[solution.array[j]] += ""+j+" ";	
	}

	for(var i=0;i<instance.nStores;i++){	
		log(extSolution[i]);
	}

	console.log(solution);

    log("z: " +solution.z);
}




function drawGraph(title, uniqueName, datap) {
    println('<div id="chart' + uniqueName + '" style="height: 400px; width: 100%;"></div>');

    var chart = new CanvasJS.Chart("chart" + uniqueName, {
        title: {
            text: title
        },
        axisX: {
            lineThickness:0,
            tickThickness:0,
            valueFormatString:" "//space
        },
        data: [{
            type: "line",
            dataPoints: datap
        }]
    });
    chart.render();
}

function initSession(){
    // lock buttons
    lockScreen();
    // start session div
    HTMLElements.output.append('<div session=' + session + '>');
    // and get it
    HTMLElements.sessionDiv = $('div[session="' + session + '"]');
}

function terminateSession() {
    // add a clear session button
    addClearSessionButton(session);
    // increment the session count variable
    session++;
    // add a line to separate sessions
    HTMLElements.sessionDiv.append('<hr>');
    // end session div
    HTMLElements.output.append('</div>');
    // scroll to bottom
    $('html,body').animate({scrollTop: document.body.scrollHeight}, "slow");
    resetProgressBar();
    // unlock button
    unlockScreen();
}


/*
 Add an output line
 */
function println(text, color) {
    html = '<div class="console" style="color:' + color + ';"><span style="color:#D3D3D3;margin-right:1em; font-size: 75%;">' + lineNum + '</span>';
    if (typeof text == 'object') {
        html += ((JSON && JSON.stringify ? JSON.stringify(text) : text));
    } else {
        html += (text);
    }
    html += ('</div>');
    HTMLElements.sessionDiv.append(html);
    lineNum++;
}

/*
 Print a matrix
 */
function printMatrix(matrix, rows, columns) {
    html = '<div class="" style="color:#5cb85c;">';
    html += '<table class="table table-hover" style="font-size: 12px; margin-left:1em;">'
    for (var i = 0; i < rows; i++) {
        html += '<tr>';
        for (var j = 0; j < columns; j++) {
            html += '<td title="(Store: ' + i + ', Customer: ' + j + ')">' + matrix[i][j] + '</td>';
            //html+=matrix[i][j]+" "
        }
        if (i < rows - 1) {
            //html+='<br><span style="color:#D3D3D3;margin-right:1em; font-size: 75%;">'+lineNum +'</span>';
        }
        html += '</tr>';
    }
    html += ('</table></div>');
    HTMLElements.sessionDiv.append(html);
    lineNum++;
}

function info(text) {
    println(text, '#5cb85c');
}

function error(text) {
    println("[x.x] " + text, '#f00');
}

function warning(text) {
    println(text, '#f0ad4e');
}

function log(text) {
    println(text, '');
}

function addClearSessionButton(session) {
    println('<button type="button" class="btn btn-default" onclick="clearSession(' + session + ')">Clear Session</button>');
}

function showResult(data){

    info("["+data.functionName+"] Processing time: " + data.processingTime + " milliseconds.");
    log("Solution cost: " + data.solution.z);
    log("Is feasible: " + isFeasible(data.solution.array, data.instance));

    if (AppSettings.verboseLog) {
        verbosePrint(data.solution, data.instance);
    }

    if(data.graph != undefined){
        drawGraph(data.functionName, data.graph.name+""+session, data.graph.data);
    }

}

function incrementProgressBar(delta) {

    var progress = $('#progressBar');
    var currentValue = parseInt(progress.attr('aria-valuenow'));
    progress.attr('aria-valuenow', currentValue+delta).css('width',(currentValue+delta)+"%");

}

function resetProgressBar() {
    var progress = $('#progressBar');
    progress.attr('aria-valuenow', 0).css('width', 0);
}