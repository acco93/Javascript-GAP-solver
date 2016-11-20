

function simulatedAnnealing(solution, neighbourFunction){

  var bestSolution = solution.slice();
  var bestCost = z(solution);

  var currentSolution = solution.slice();
  var currentCost = bestCost;

  var k = 1;
  var i = 0;
  var MAX_ITER = 1000000;
  var MAX_T = 100;
  var t = MAX_T;
  var deltaT = MAX_T / MAX_ITER;

  while(i<MAX_ITER){

    result = neighbourFunction(currentSolution, currentCost);

    if(result.z < currentCost){
      // perform the moves
      for(var m=0; m<result.moves.length; m++){
        var j = result.moves[m].j;
        var i = result.moves[m].i;
        currentSolution[j] = i;
      }
      currentCost = result.z;

      if(currentCost < bestCost){
        // edit the best solution
        bestSolution = currentSolution.slice();
        bestCost = currentCost;
      }

    } else {
      p = Math.exp(-(result.z-currentCost)/(k*t));

      if(Math.random()<p){
        // perform the moves
        for(var m; m<result.moves.length; m++){
          var j = result.moves[m].j;
          var i = result.moves[m].i;
          currentSolution[j] = i;
        }
        currentCost = result.z;

      }
    }

    t-=deltaT;
    i++;

  }

  return bestSolution;

}

function gap10optSA (solution, cost){

  // chose a customer and a store random index
  var customerIndex = Math.floor((Math.random() * nCustomers));
  var storeIndex = Math.floor((Math.random() * nStores));


  var storeSum = new Array(nStores);

  for(var i=0;i<nStores;i++){
    storeSum[i] = 0;
  }

  for(var j=0;j<nCustomers;j++){
    storeSum[solution[j]] += requests[solution[j]][j];
  }

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

function gap11optSA(solution, cost){

  // chose a customer and a store random index
  var customerIndexJ = Math.floor((Math.random() * nCustomers));
  var storeIndexJ = Math.floor((Math.random() * nStores));
  var customerIndexK;

  do{
      customerIndexK = Math.floor((Math.random() * nCustomers));
  } while(customerIndexK == customerIndexJ);

  var storeIndexK = Math.floor((Math.random() * nStores));

  var storeSum = new Array(nStores);

  for(var i=0;i<nStores;i++){
    storeSum[i] = 0;
  }

  for(var j=0;j<nCustomers;j++){
    storeSum[solution[j]] += requests[solution[j]][j];
  }

  currentStoreJ = solution[customerIndexJ];
  currentStoreK = solution[customerIndexK];




  /*
    Remove customers
  */
  storeSum[currentStoreJ] -= requests[currentStoreJ][customerIndexJ];
  storeSum[currentStoreK] -= requests[currentStoreK][customerIndexK];
  /*
    Add to the new store, this is needed since both customers may be added to the same store
    and using the if I can't check both the same time!
  */
  storeSum[storeIndexJ] += requests[storeIndexJ][customerIndexJ];
  storeSum[storeIndexK] += requests[storeIndexK][customerIndexK];

  newCost = cost;

  moves = [];

  if(storeSum[storeIndexJ]<= capacities[storeIndexJ] && storeSum[storeIndexK]<=capacities[storeIndexK]){

    moves.push({j: customerIndexJ, i: storeIndexJ});
    moves.push({j: customerIndexK, i: storeIndexK});

    newCost = cost - costs[currentStoreJ][customerIndexJ] + costs[storeIndexJ][customerIndexJ]
                          - costs[currentStoreK][customerIndexK] + costs[storeIndexK][customerIndexK];

  }

  return {
    moves: moves,
    z: newCost
  };

}
