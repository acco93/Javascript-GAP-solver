function tabuSearch (solution, neighbourFunction){

  var NEIGHBOUR_NUM = 100;
  var MAX_ITER = 10000;
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

  // generate 100 neighbour solutions

  do{

    var bestNeighbour = neighbourFunction(currentSolution, currentCost, storeSum);

    for(var i=0;i<NEIGHBOUR_NUM - 1; i++){
      result = neighbourFunction(currentSolution, currentCost, storeSum);               // aspiration criteria
      if((result.z < bestNeighbour.z && !areMovesTabu(tabuList, result.moves, iter)) || result.z < bestCost){
        bestNeighbour = result;
      }
    }

    // now bestNeighbour contains the best neighbour! :D
    // apply the changes!
    currentCost = result.z;
    for(var m = 0; m < result.moves.length; m++){

      var i = result.moves[m].i;
      var j = result.moves[m].j;
      // modify the solution and the storeSum!
      // oldStore = currentSolution[j]
      storeSum[currentSolution[j]] -= requests[currentSolution[j]][j];
      // newStore = i
      storeSum[i] -= requests[i][j];

      currentSolution[j] = i;

      // add the moves to the tabu list
      tabuList[i][j] = iter+TABU_TENURE;
    }

    // check if currentSolution is better than bestSolution
    if(currentCost < bestCost){
      bestSolution = currentSolution.slice();
      bestCost = currentCost;
    }



    iter ++;
  } while(iter < MAX_ITER);


  return bestSolution;

}

function gap10optTS (solution, cost, storeSum){

  // chose a customer and a store random index
  var customerIndex = Math.floor((Math.random() * nCustomers));
  var storeIndex = Math.floor((Math.random() * nStores));

  /* current customer store */
  currentStore = solution[customerIndex];

  var newCost = cost;
  var moves = [];

  if(storeIndex != currentStore && storeSum[storeIndex]+requests[storeIndex][customerIndex] <= capacities[storeIndex]){

    moves.push({j: customerIndex, i: storeIndex});

    newCost = cost - costs[currentStore][customerIndex] + costs[storeIndex][customerIndex];

  }

  return {
    moves: moves,
    z: newCost
  };

}

function areMovesTabu(tabuList, moves, iter){

  for(var m=0; m < moves.length; m++){
    var i = moves[m].i;
    var j = moves[m].j;
    if(tabuList[i][j] > iter){
      return true;
    }
  }

  return false;
}
