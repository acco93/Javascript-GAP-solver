/*
  Returns codes
*/
var SUCCESS = 0;
var ERROR = 1;

/*
 Utility objects
*/

var AppSettings = {
  verboseLog: false,
  whatToProcess: URL,
};

var AlgorithmSettings = {
    randomizeCustomers: false,
    perform10opt: true,
    perform11opt: false,
    performSA10: true, // simulatedAnnealing 10 move
    performSA11: true,
    performTS10: true,  // tabuSearch 10 move
    performILS10: true,
    performILS11: false,
    MAX_ITER: 5000,
    MAX_PROCESSING_MILLISECONDS: 3000
};

var HTMLElements = {
    input: undefined,
    textArea: undefined,
    processButton: undefined,
    output: undefined,  // output div
    sessionDiv: undefined, // current session div
    verboseLogButton: undefined,
    randomizeCustomersButton: undefined,
    gap10Button: undefined,
    gap11Button: undefined,
    changelogModal: undefined,
    changelogBody: undefined,
    lastUpInfo: undefined,

};

var Cache = {
  instances: [],
  changelog: undefined
};

var lineNum = 0;
var session = 0;
