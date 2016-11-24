function tabuSearch (solution){

  var data = [];

  var MAX_ITER = 5000;
  var TABU_TENURE = 100;
  var iter = 0;

  // init the best solution
  var bestSolution = solution.slice();
  var bestCost = z(solution);

  // and the current solution
  var currentSolution = solution.slice();
  var currentCost = bestCost;

  // compute the store occupation
  var storeSum = new Array(nStores);
  for(var i=0;i<nStores;i++){
    storeSum[i] = 0;
  }
  for(var j=0;j<nCustomers;j++){
    storeSum[solution[j]] += requests[solution[j]][j];
  }

  var tabuList = [];
  for(var i=0; i<nStores; i++) {
    tabuList[i] = new Array(nCustomers);
    for(var j=0;j<nCustomers; j++){
      tabuList[i][j] = 0;
    }
  }

  for(iter = 0; iter < MAX_ITER; iter++){
    var iBest = undefined;
    var jBest = undefined;
    var bestNeighbourCost = undefined;

    for(var j=0; j<nCustomers; j++){
      var currentStore = currentSolution[j];
      for(var i=0; i<nStores; i++){

        if(i==currentStore){ continue; }

        var newCost = currentCost - costs[currentStore][j] + costs[i][j];

        if(storeSum[i]+requests[i][j] <= capacities[i] && iter >= tabuList[i][j]){
          if(bestNeighbourCost == undefined || newCost < bestNeighbourCost){
            iBest = i;
            jBest = j;
            bestNeighbourCost = newCost;
          }
        }

      }
    }

    if(iBest == undefined || jBest == undefined){
      // can't find a feasible neighbour!
      // ooooooow don't know what to do! D:
      warning("All moves are tabu! Terminating at "+iter+"/"+MAX_ITER);
      break;
    }

    currentCost = bestNeighbourCost;


    // modify the solution and the storeSum!
    // .. in the store sum values
    // old store = currentSolution[j]
    storeSum[currentSolution[jBest]] -= requests[currentSolution[jBest]][jBest];
    // new store = i
    storeSum[iBest] += requests[iBest][jBest];


    currentSolution[jBest] = iBest;

    // add the moves to the tabu list
    tabuList[iBest][jBest] = iter+TABU_TENURE;


    // check if currentSolution is better than bestSolution
    if(currentCost < bestCost){
      bestSolution = currentSolution.slice();
      bestCost = currentCost;
    }



    data[iter] = {
      x: iter,
      y: currentCost
    }

  }



  return {
          solution: bestSolution,
          data: data
        };

}
