function tabuSearch (solution, neighbourFunction){

  var MAX_ITER = 500000;
  var TABU_TENURE = 25;
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

  do{

    var iBestNeighbour = -1;
    var jBestNeighbour = -1;
    var bestNeighbourCost = Number.MAX_VALUE;;

    for(var j=0;j<nCustomers; j++){

      currentStore = solution[j];

      for(var i=0;i<nStores; i++){

        if(i == currentStore) {continue;}

        newCost = currentCost - costs[currentStore][j] + costs[i][j]

        if(storeSum[i]+requests[i][j] <= capacities[i] && newCost < bestNeighbourCost && iter >= tabuList[i][j]){
          iBestNeighbour = i;
          jBestNeighbour = j;
          bestNeighbourCost = newCost;
        }

      }
    }


    currentCost = bestNeighbourCost;

    // modify the solution and the storeSum!
    // .. in the store sum values
    // old store = currentSolution[j]
    storeSum[currentSolution[jBestNeighbour]] -= requests[currentSolution[jBestNeighbour]][jBestNeighbour];
    // new store = i
    storeSum[iBestNeighbour] += requests[iBestNeighbour][jBestNeighbour];


    currentSolution[jBestNeighbour] = iBestNeighbour;

    // add the moves to the tabu list
    tabuList[iBestNeighbour][jBestNeighbour] = iter+TABU_TENURE;


    // check if currentSolution is better than bestSolution
    if(currentCost < bestCost){
      bestSolution = currentSolution.slice();
      bestCost = currentCost;
    }



    iter ++;
  } while(iter < MAX_ITER);


  return bestSolution;

}

function gap10optTS (solution, cost, storeSum, customerIndex, storeIndex){

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


/*
  Hashing indici per 11 opt
*/
