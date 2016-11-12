/*
  Download a json from the given url
*/
function loadJSON(url) {

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
function setInstance(data) {

  nStores = data.magazzini;
  nCustomers = data.clienti;

  $.each(data.costi, function(i, array){
        costs[i] = new Array(data.clienti);
    $.each(array, function(j,value){
        costs[i][j] = value;
    });
  });

  $.each(data.req, function(i, array){
    requests[i] = new Array(data.clienti);
    $.each(array, function(j,value){
      requests[i][j] = value;
    });
  });

  $.each(data.cap, function(i,value){
      capacities[i] = value;
  });

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

  var url = $("input").val();

  loadJSON(url).then(function(data){
    if(data!=undefined){
      setInstance(data);
      //printInstance();

      var startTime = new Date();
      solveConstructive();
      var endTime = new Date();
      info("[Constructive heuristic] Processing time: "+(endTime-startTime)+" milliseconds.");
      log("Solution cost: "+z(x));
      startTime = new Date();
      gap10opt();
      endTime = new Date();
      info("[1-0 opt] Processing time: "+(endTime-startTime)+" milliseconds.");
      log("Solution cost: "+z(x));
    }
    info("Copy to clipboard");
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
  println(text, '#f00');
}

function warning(text){
  println(text, '#f0ad4e');
}

function log(text){
  println(text, '#000');
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

function changeUrl(url){
  $("#input").val(url);
}
