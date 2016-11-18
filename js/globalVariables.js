/*
  Instance variables
*/
var nCustomers;
var nStores;
var costs = [];
var requests = [];
var capacities = [];

var x;
var solution = [];

var instance;

/*
 Utility constants
*/

var KEY = 0;
var VALUE = 1;
var verboseLog = false;
var URL = 0;
var PASTED_CODE = 1;
var whatIsToBeProcessed = URL;
var randomizedCustomerOrder = false;


var GAP10OPT = 0;
var GAP11OPT = 1;

var perform10opt = true;
var perform11opt = false;

var input;
var textArea;
var processButton;

var LIGHT = 0;
var DARK = 1;
var theme = LIGHT;

/*
 variables
*/

var l; // ladda buttons
var output; // output div
var sessionDiv; // session div
var lineNum = 0;
var session = 0;
