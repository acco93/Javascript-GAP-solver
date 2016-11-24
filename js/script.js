/*
  Document ready!
*/
$(document).ready(function(){

  // Bind all HTML elements to variables"
  HTMLElements.textArea = $('#textarea');
  HTMLElements.processButton = $('#processButton');
  HTMLElements.input = $('#input');
  HTMLElements.output = $("#output");
  HTMLElements.l = Ladda.create(document.querySelector( '.ladda-button' ));
  HTMLElements.verboseLogButton = $("#verboseLogButton");
  HTMLElements.randomizeCustomersButton = $("#randomizeCustomersButton");
  HTMLElements.gap10Button = $("#gap10Button");
  HTMLElements.gap11Button = $("#gap11Button");
  HTMLElements.changelogBody = $("#changelogBody");
  HTMLElements.changelogModal = $("#changelogModal");

  // Bind behaviors to actions
  HTMLElements.textArea.click(onTextAreaClick);
  HTMLElements.input.click(onInputClick);


  $.getJSON("https://api.bitbucket.org/2.0/repositories/acco93/gap-solver-js/?callback=", function( data ) {
    var htmlLastModified = new Date(document.lastModified);
    var repoLastUpdate = new Date(data.updated_on);

    if(htmlLastModified.getTime() - repoLastUpdate.getTime() > 0){
      $("#lastUpInfo").html('<small style="color: green;">UP TO DATE</small>');
    } else {
      $("#lastUpInfo").html('<small style="color: red;">Repo version is more updated!</small>');
    }

  });



});

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

/*
  Load a json file from the appropriate place
*/
function loadJSON(){

  // Since I may have to asynchronously download it,
  // create a promise
  var deferred = new $.Deferred();

  if(AppSettings.whatToProcess == PASTED_CODE){

    // read the text area
    var text = HTMLElements.textArea.val();
    var json;

    // try to parse the JSON
    try {
      json = $.parseJSON(text);
    }catch(e) {
        deferred.resolve(undefined);
    }
    deferred.resolve(json);

  } else {

    // download the url from the specified url
    var url = HTMLElements.input.val();
    return downloadJSON(url);
  }

  // return the promise, so the user is able to wait for it or do whatever he wants
  return deferred.promise();
}

/*
  Download a json from the given url
*/
function downloadJSON(url) {

    var startTime = new Date();

    // create a promise
    var deferred = new $.Deferred();

    $.getJSON( url, function( data ) {

      deferred.resolve(data);


    }).fail(function() {

      error("ERROR: Not able to get the JSON");

      deferred.resolve(undefined);

    }).always(function(){

      var endTime = new Date();

      info("Dowload time: "+(endTime-startTime)+" milliseconds.");

    });

    return deferred.promise();
}

/*
  Check if the instance is correct! And set global instance variables.
*/
function checkAndSetInstance(data){

  if(data.magazzini == undefined || data.magazzini <= 0 || !isNumber(data.magazzini) || !Number.isInteger(data.magazzini)){
    error("magazzini should be an integer value > 0")
    return false;
  } else {
    nStores = data.magazzini;
  }

  if(data.clienti == undefined || data.clienti <= 0 || !isNumber(data.clienti) ||!Number.isInteger(data.clienti)){
    error("clienti should be an integer value > 0")
    return false;
  } else {
    nCustomers = data.clienti;
  }

  $.each(data.costi, function(i, array){
    if(array == undefined) {
      error("costi should be a "+data.magazzini+"x"+data.clienti+" matrix of numbers");
      return false;
    }
    costs[i] = new Array(data.clienti);
    $.each(array, function(j,value){
        if(value == undefined || !isNumber(value)){
          error("costi should be a "+data.magazzini+"x"+data.clienti+" matrix of numbers");
          return false;
        }
        costs[i][j] = value;
    });
  });

  $.each(data.req, function(i, array){
    if(array == undefined) {
      error("req should be a "+data.magazzini+"x"+data.clienti+" matrix of numbers");
      return false;
    }
    requests[i] = new Array(data.clienti);
    $.each(array, function(j,value){
    if(value == undefined || !isNumber(value)){
        error("req should be a "+data.magazzini+"x"+data.clienti+" matrix of numbers");
        return false;
      }
      requests[i][j] = value;
    });
  });

  $.each(data.cap, function(i,value){
    if(value == undefined || !isNumber(value)){
      error("cap should be a "+data.magazzini+" elements array of numbers");
      return false;
    }
      capacities[i] = value;
  });

  return true;
}

/*
  Check if a given object is a number.
*/
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/*
  Print instance info
*/
function printInstance() {
  info("Instance info:");
  info("Stores: "+nStores);
  info("Customers: "+nCustomers);
  info("Costs: ");
  printMatrix(costs,nStores,nCustomers);
  info("Requests: ");
  printMatrix(requests,nStores,nCustomers);
  info("Stores capacities: "+capacities);
}

/*
  Print loong and useless info
*/
function verbosePrint(solution){

  var reqSum = new Array(nStores);

  for(var i=0;i<nStores;i++){
    reqSum[i] = 0;
  }

  for(var j=0;j<nCustomers;j++){
    reqSum[solution[j]] += requests[solution[j]][j];
  }

  for(var i=0;i<nStores;i++){
    log("Store "+i+" requests: "+reqSum+" < "+capacities[i]);
  }

  log("Solution:" + solution);

}

/*
  App entry point
*/
function process() {

  // lock buttons
  HTMLElements.l.start();
  // start session div
  HTMLElements.output.append('<div session='+session+'>');
  // and get it
  HTMLElements.sessionDiv = $('div[session="'+session+'"]');

  // load the json (download or read it according to the user needs)
  loadJSON().then(function(data){

    if(data == undefined){
      error("Is it a valid json?");
      terminateSession();
      return ERROR;
    }


    if(!checkAndSetInstance(data)){
      error("Malformed instance!");
      terminateSession();
      return ERROR;
    }

    if(AppSettings.verboseLog){
      printInstance();
    }

    // customers may be considered in a random order!
    var customersIndexes = [];
    for(var j=0;j<nCustomers;j++){
      customersIndexes[j]=j;
    }



  if(AlgorithmSettings.randomizedCustomerOrder){
    log("Shuffling customers ... ");
    knuthShuffle(customersIndexes);
  }

    var startTime = new Date();
    var solution = solveConstructive(customersIndexes);
    var endTime = new Date();

    info("[Constructive heuristic] Processing time: "+(endTime-startTime)+" milliseconds.");
    log("Solution cost: "+z(solution));

    log("is feasible: "+isFeasible(solution));

    if(AppSettings.verboseLog){
      verbosePrint(solution);
    }

      if(isFeasible(solution)){

      if(AlgorithmSettings.perform10opt) {
        var solutionCpy = solution.slice();
        startTime = new Date();
        solutionCpy = gap10opt(solutionCpy);
        endTime = new Date();
        info("[1-0 opt] Processing time: "+(endTime-startTime)+" milliseconds.");
        log("Solution cost: "+z(solutionCpy));
        log("is feasible: "+isFeasible(solutionCpy));
        if(AppSettings.verboseLog){
          verbosePrint(solutionCpy);
        }
      }

      if(AlgorithmSettings.perform11opt) {
        var solutionCpy = solution.slice();
        startTime = new Date();
        solutionCpy = gap11opt(solutionCpy);
        endTime = new Date();
        info("[1-1 opt] Processing time: "+(endTime-startTime)+" milliseconds.");
        log("Solution cost: "+z(solutionCpy));
        log("is feasible: "+isFeasible(solutionCpy));
        if(AppSettings.verboseLog){
          verbosePrint(solutionCpy);
        }
      }

      {
        var solutionCpy = solution.slice();
        startTime = new Date();
        solutionCpy = simulatedAnnealing(solutionCpy, gap10optSA);
        endTime = new Date();
        info("[Simulated annealing (using 10opt move)] Processing time: "+(endTime-startTime)+" milliseconds.");
        log("Solution cost: "+z(solutionCpy));
        log("is feasible: "+isFeasible(solutionCpy));
        if(AppSettings.verboseLog){
          verbosePrint(solutionCpy);
        }
      }


      {
        var solutionCpy = solution.slice();
        startTime = new Date();
        solutionCpy = simulatedAnnealing(solutionCpy, gap11optSA);
        endTime = new Date();
        info("[Simulated annealing (using 11opt move)] Processing time: "+(endTime-startTime)+" milliseconds.");
        log("Solution cost: "+z(solutionCpy));
        log("is feasible: "+isFeasible(solutionCpy));
        if(AppSettings.verboseLog){
          verbosePrint(solutionCpy);
        }
      }



      } else {
        // constructive heuristic returned a not feasible solution
      }

  terminateSession();

  });


}

function terminateSession(){
  // add a clear session button
  addClearSessionButton(session);
  // increment the session count variable
  session++;
  // add a line to separate sessions
  HTMLElements.sessionDiv.append('<hr>');
  // end session div
  HTMLElements.output.append('</div>');
  // scroll to bottom
  $('html,body').animate({scrollTop: document.body.scrollHeight},"slow");
  // unlock button
  HTMLElements.l.stop();
}


/*
  Add an output line
*/
function println(text, color){
  html = '<div class="console" style="color:'+color+';"><span style="color:#D3D3D3;margin-right:1em; font-size: 75%;">'+lineNum +'</span>';
  if (typeof text == 'object') {
          html+=((JSON && JSON.stringify ? JSON.stringify(text) : text));
      } else {
          html+=(text);
      }
  html+=('</div>');
  HTMLElements.sessionDiv.append(html);
  lineNum++;
}

/*
  Print a matrix
*/
function printMatrix(matrix, rows, columns){
  html = '<div class="" style="color:#5cb85c;">';
  html +='<table class="table table-hover" style="font-size: 12px; margin-left:1em;">'
  for(var i=0;i<rows;i++){
    html +='<tr>';
    for(var j=0;j<columns;j++){
      html+= '<td title="(Store: '+i+', Customer: '+j+')">'+matrix[i][j]+'</td>';
      //html+=matrix[i][j]+" "
    }
    if(i<rows-1){
        //html+='<br><span style="color:#D3D3D3;margin-right:1em; font-size: 75%;">'+lineNum +'</span>';
    }
    html +='</tr>';
  }
  html+=('</table></div>');
  HTMLElements.sessionDiv.append(html);
  lineNum++;
}

function info(text){
  println(text, '#5cb85c');
}

function error(text){
  println("[x.x] "+text, '#f00');
}

function warning(text){
  println(text, '#f0ad4e');
}

function log(text){
  println(text, '');
}

function addClearSessionButton(session){
  println('<button type="button" class="btn btn-default" onclick="clearSession('+session+')">Clear Session</button>');
}

function clearSession(session){

  var div = $('div[session="'+session+'"]');

  // lock buttons
  HTMLElements.l.start();
  div.fadeOut("fast",function(){
    div.remove();
    // unlock buttons
    HTMLElements.l.stop();
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
  if(AlgorithmSettings.randomizedCustomerOrder){
    AlgorithmSettings.randomizedCustomerOrder = false;
    HTMLElements.randomizeCustomersButton.addClass("btn-danger");
    HTMLElements.randomizeCustomersButton.removeClass("btn-success");
  } else {
    AlgorithmSettings.randomizedCustomerOrder = true;
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
