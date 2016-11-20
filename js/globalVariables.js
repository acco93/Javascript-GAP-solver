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
/*
  Theme valus
*/
var LIGHT = 0;
var DARK = 1;
/*
  Returns codes
*/
var SUCCESS = 0;
var ERROR = 1;
/*
  Instance variables
*/
var nCustomers;
var nStores;
var costs = [];
var requests = [];
var capacities = [];

/*
 Utility objects
*/

var AppSettings = {
  verboseLog: false,
  whatToProcess: URL,
  theme: LIGHT
};

var AlgorithmSettings = {
    randomizedCustomerOrder: false,
    perform10opt: true,
    perform11opt: false
};

var HTMLElements = {
    input: undefined,
    textArea: undefined,
    processButton: undefined,
    output: undefined,  // output div
    l: undefined, // ladda buttons
    sessionDiv: undefined, // current session div
    verboseLogButton: undefined,
    randomizeCustomersButton: undefined,
    gap10Button: undefined,
    gap11Button: undefined
};


var lineNum = 0;
var session = 0;
