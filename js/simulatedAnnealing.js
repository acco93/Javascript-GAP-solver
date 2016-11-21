
function tryT(solution, cost, neighbourFunction, k){

  var t = Math.random() * cost;

  info("random t: "+t);

  var deltaT = t/100;
  var times = 0;
  do {
      var accepted = 0;

      for(var i=0;i<100;i++){

        neighbour = neighbourFunction(solution, cost);
        //console.log(cost);
        //console.log(neighbour);
        p = Math.exp(-(neighbour.z-cost)/(k*t));

        alert(neighbour.z+" @ "+cost+" @ "+(neighbour.z-cost)+" @ "+((neighbour.z-cost)/(k*t)));
      

        r = Math.random();

        //console.log(-(neighbour.z-cost)/(k*t)+" @@@ "+p+" --- "+r);

        if(neighbour.z < cost || r < p){
          accepted ++;
        }

      }

      if(accepted < 40){
        t+=deltaT;
      } else if(accepted > 60) {
        t-=deltaT;
      }

    console.log(accepted +" "+t);
    times++;
  }while(t>0 && (accepted < 40 || accepted >60) && times < 100);

  if(t<=0){
    t = 0.001;
  }

  return t;

}


function simulatedAnnealing(solution, neighbourFunction){

  var bestSolution = solution.slice();
  var bestCost = z(solution);

  var currentSolution = solution.slice();
  var currentCost = bestCost;

  var k = 1.0;
  var i = 0;
  var MAX_ITER = 10000;
  var MAX_T = tryT(currentSolution, currentCost, neighbourFunction, k);
  info("T: "+MAX_T);
  var t = MAX_T;
  //var deltaT = MAX_T / MAX_ITER;
  var deltaT = 0.9;

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

    t*=deltaT;
    i++;

  }

    info("T: "+t);
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
