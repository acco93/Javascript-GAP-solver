
/*
 * Attempts to improve the cost of the solution by reassigning each customer to
 * a store that has space left
 */
function gap10opt (){
  
  /*
    Compute the current solution cost and the stores occupation.
  */
  var currentCost = z(x);

  storeSum = [];
  for(var i=0;i<nStores;i++){
    storeSum[i] = 0;
    for(var j=0;j<nCustomers;j++){
      storeSum[i] += (x[i][j]*requests[i][j]);
    }
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

      var currentStore = -1;

      for(var i=0; i<nStores; i++){
        if(x[i][j] == 1) {
          currentStore = i;
          break;
        }
      }

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
          x[currentStore][j] = 0;
          x[i][j] = 1;
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

}

/*
  Rimuovi due clienti alla volte e vedi come riassegnarli
*/
function gap11opt(){

}
