
/*
 * Attempts to improve the cost of the solution by reassigning each customer to
 * a store that has space left
 */
function gap10opt (solution){

  /*
    Compute the current solution cost and the stores occupation.
  */
  var currentCost = z(solution);

  var storeSum = new Array(nStores);

  for(var i=0;i<nStores;i++){
    storeSum[i] = 0;
  }

  for(var j=0;j<nCustomers;j++){
    storeSum[solution[j]] += requests[solution[j]][j];
  }

  /*
    Repeat untill there isn't an improvement
  */
  do{

    var improved = false;

    /*
      For each customer ... (column)
    */
    for(var j=0; j<nCustomers; j++){

      /*
        Find the current store
      */

      currentStore = solution[j];

      for(var i=0;i<nStores; i++){
        /*
          Consider each store different from the current
        */
        if(i == currentStore){ continue; }

        /*
          Build another solution where ...
        */

        /*
          Check for capacities
        */
        newCost = currentCost - costs[currentStore][j] + costs[i][j]
        if(storeSum[i]+requests[i][j] <= capacities[i] && newCost < currentCost){

          solution[j] = i;
          improved = true;
          /*
            Update some variables
          */
          storeSum[currentStore] -= requests[currentStore][j];
          currentCost = newCost;
          storeSum[i] += requests[i][j];
          break;
        }

      }

      if(improved){
        break;
      }

    }

  } while(improved);

  return solution;

}

/*
  Rimuovi due clienti alla volte e vedi come riassegnarli
*/
function gap11opt(solution){
  /*
    Compute the current solution cost and the stores occupation.
  */
  var currentCost = z(solution);

  var storeSum = new Array(nStores);

  for(var i=0;i<nStores;i++){
    storeSum[i] = 0;
  }

  for(var j=0;j<nCustomers;j++){
    storeSum[solution[j]] += requests[solution[j]][j];
  }


  /*
    Repeat untill there isn't an improvement
  */
  do {
    var improved = false;

    /*
      For each customer pair...
    */
    for(var j=0; j<nCustomers-1; j++){

      var currentStoreJ = solution[j];

      for(var k=j+1; k<nCustomers; k++){


        var currentStoreK = solution[k];

        for(var ij=0;ij<nStores;ij++){
          for(var ik=0;ik<nStores;ik++){
            newCost = currentCost - costs[currentStoreJ][j] + costs[ij][j] - costs[currentStoreK][k] + costs[ik][k];

            /*
              Remove customers
            */
            storeSum[currentStoreJ] -= requests[currentStoreJ][j];
            storeSum[currentStoreK] -= requests[currentStoreK][k];
            /*
              Add to the new store, this is needed since both customers may be added to the same store
              and using the if I can't check both the same time!
            */
            storeSum[ij] += requests[ij][j];
            storeSum[ik] += requests[ik][k];

            if(storeSum[ij]<= capacities[ij] && storeSum[ik]<=capacities[ik] && newCost < currentCost){

              solution[j] = ij;
              solution[k] = ik;

              improved = true;

              currentCost = newCost;

              /*storeSum[ij] += requests[ij][j];
              storeSum[ik] += requests[ik][j];
              */

              break;
            } else {
              /*
                Re-fix variables
              */
              storeSum[currentStoreJ] += requests[currentStoreJ][j];
              storeSum[currentStoreK] += requests[currentStoreK][k];
              storeSum[ij] -= requests[ij][j];
              storeSum[ik] -= requests[ik][k];
            }
          }
          if(improved){break;}
        }
        if(improved){break;}
      }
      if(improved){break;}
    }

  } while(improved);

  return solution;

}
