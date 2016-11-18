
$(document).ready(function(){
  textArea = $('#textarea');
  processButton = $('#processButton');
  input = $('#input');

  $('#textarea').click(function() {
    processButton.text("Process (the above text area)");
    whatIsToBeProcessed = PASTED_CODE;
  });

  $('#input').click(function() {
    processButton.text("Process (the URL)");
    whatIsToBeProcessed = URL;
  });


});

function loadJSON(url){

  // create a promise and return it
  var deferred = new $.Deferred();

  if(whatIsToBeProcessed == PASTED_CODE){
    var text = $('#textarea').val();
    var json;

    try {
      json = $.parseJSON(text);
    }catch(e) {
        deferred.resolve(undefined);
    }
    deferred.resolve(json);


  } else {
    // URL
    var url = $("input").val();
    return downloadJSON(url);
  }

  return deferred.promise();
}

/*
  Download a json from the given url
*/
function downloadJSON(url) {

    var startTime = new Date();

    // create a promise and return it
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
  Set instance variables
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

function verbosePrint(){
  for(var i=0;i<nStores;i++){
    var reqSum = 0;
    for(var j=0;j<nCustomers;j++){
      reqSum += (x[i][j]*requests[i][j]);
    }
    log("Store "+i+" requests: "+reqSum+" < "+capacities[i]);
  }
  log("Solution:")
  printMatrix(x, nStores, nCustomers)

}

function lockButtons() {
  l = Ladda.create(document.querySelector( '.ladda-button' ));
  l.start();

}
function unlockButtons(){
  l.stop();

}


function process() {
  lockButtons();

  output = $("#output");
  startSessionDiv();
  sessionDiv = $('div[session="'+session+'"]');



  loadJSON().then(function(data){
    if(data!=undefined){

      if(!checkAndSetInstance(data)){
        error("Malformed instace!");

      } else {

      if(verboseLog){
        printInstance();
      }

      var customersIndexes = [];
      for(var j=0;j<nCustomers;j++){
        customersIndexes[j]=j;
      }



    if(randomizedCustomerOrder){
      log("Shuffling customers ... ");
      knuthShuffle(customersIndexes);
    }

      var startTime = new Date();

      //customersIndexes = descendingRequestsSumIndexes();
      solveConstructive(customersIndexes);
      var endTime = new Date();
      info("[Constructive heuristic] Processing time: "+(endTime-startTime)+" milliseconds.");
      log("Solution cost: "+z(x));
      log("is feasible: "+isFeasible(x));
      if(verboseLog){
        verbosePrint();
      }

        if(isFeasible(x)){


        if(perform10opt) {
          startTime = new Date();
          gap10opt();
          endTime = new Date();
          info("[1-0 opt] Processing time: "+(endTime-startTime)+" milliseconds.");
          log("Solution cost: "+z(x));
          log("is feasible: "+isFeasible(x));
          if(verboseLog){
            verbosePrint();
          }
        }

        if(perform11opt) {
          startTime = new Date();
          gap11opt();
          endTime = new Date();
          info("[1-1 opt] Processing time: "+(endTime-startTime)+" milliseconds.");
          log("Solution cost: "+z(x));
          log("is feasible: "+isFeasible(x));
          if(verboseLog){
            verbosePrint();
          }
        }



      } else {

      }
    }


  } else {
    error("Is it a valid json?")
  }

    clearSessionButton(session);
    session++;
    drawLine();
    endSessionDiv();
    $('html,body').animate({scrollTop: document.body.scrollHeight},"slow");

    unlockButtons();
  });


}

function startSessionDiv(){
  output.append('<div session='+session+'>');
}

function endSessionDiv(){
  output.append('</div>');
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
  sessionDiv.append(html);
  lineNum++;
}

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
  sessionDiv.append(html);
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

function drawLine(){
  sessionDiv.append('<hr>');
}

function clearSessionButton(session){
  println('<button type="button" class="btn btn-default" onclick="clearSession('+session+')">Clear Session</button>');
}

function clearSession(session){

  var div = $('div[session="'+session+'"]');

  lockButtons();
  div.fadeOut("fast",function(){
    div.remove();
    unlockButtons();
  });
  //$('div[session="'+session+'"]').remove();
}

function toggleLog(){
  if(verboseLog){
    verboseLog = false;
    $("#verboseLogButton").addClass("btn-danger");
    $("#verboseLogButton").removeClass("btn-success");
  } else {
    verboseLog = true;
    $("#verboseLogButton").removeClass("btn-danger");
    $("#verboseLogButton").addClass("btn-success");
  }
}

function randomizeCustomer(){
  if(randomizedCustomerOrder){
    randomizedCustomerOrder = false;
    $("#randomizeCustomers").addClass("btn-danger");
    $("#randomizeCustomers").removeClass("btn-success");
  } else {
    randomizedCustomerOrder = true;
    $("#randomizeCustomers").removeClass("btn-danger");
    $("#randomizeCustomers").addClass("btn-success");
  }
}

function changeUrl(url){
  $("#input").val(url);
  processButton.text("Process (the URL)");
  whatIsToBeProcessed = URL;
}

function toggleLocalSearch(index){
  switch(index){
    case GAP10OPT:
      if(perform10opt) {
        perform10opt = false;
        $("#gap10").addClass("btn-danger");
        $("#gap10").removeClass("btn-success");
      } else {
        perform10opt = true;
        $("#gap10").removeClass("btn-danger");
        $("#gap10").addClass("btn-success");
      }
    break;
    case GAP11OPT:
      if(perform11opt) {
        perform11opt = false;
        $("#gap11").addClass("btn-danger");
        $("#gap11").removeClass("btn-success");
      } else {
        perform11opt = true;
        $("#gap11").removeClass("btn-danger");
        $("#gap11").addClass("btn-success");
      }
    break;
  }
}

function changeCSS(cssFile, cssLinkIndex) {

    var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", cssFile);

    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}

function toggleTheme(){
  if(theme == LIGHT){
    theme = DARK;
    //document.getElementById('normalTheme').disabled  = true;
    //document.getElementById('darkTheme').disabled = false;
    changeCSS('styleV2.css', 4);
  } else {
    theme = LIGHT;
    //document.getElementById('normalTheme').disabled  = false;
    //document.getElementById('darkTheme').disabled = true;
    changeCSS('style.css', 4);
  }
}
