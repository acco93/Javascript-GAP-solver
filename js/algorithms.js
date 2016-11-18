function solveConstructive(customersIndexes){

  x = new Array(nStores);
  for(var i=0;i<nStores;i++){
    x[i] = new Array(nCustomers);
    for(var j=0;j<nCustomers;j++){
      x[i][j] = 0;
    }
  }

  var requestsSum = [];
  for(var i=0;i<nStores;i++){
    requestsSum[i] = 0 ;
  }

  /*
    Per ogni cliente vado a scegliere il magazzino a cui richiedo meno
    in posizione i, j ho la richiesta del cliente j al magazzino i
    per ogni cliente ordino per richiesta crescente tenendo conto dell'indice del magazzino
      - fissato il cliente j
      - creo un vettore di magazzini, tenendo traccia dell'indice originale
      - ordino per richiesta crescente
  */

  for(var j=0; j<nCustomers;j++){

    /*
      consider the customers in the order defined in
      customersIndexes
    */

    customerIndex = customersIndexes[j];

    requestsCustomer = new Array(nStores);
    for(var i=0;i<nStores;i++){
      requestsCustomer[i] = new Array(2);
      requestsCustomer[i][KEY] = i;
      requestsCustomer[i][VALUE] = requests[i][customerIndex];
    }
    requestsCustomer.sort(ascendingCompareKeyValue)
    // ora ho le richieste del cliente ordinate per richiesta minore
    // le scorro e assegno al primo magazzino libero

    for(var i=0;i<nStores;i++){
      realIndexStore = requestsCustomer[i][KEY];
      if(requestsSum[realIndexStore]+requests[realIndexStore][customerIndex] <= capacities[realIndexStore]){

        x[realIndexStore][customerIndex] = 1;
        // array impl
        solution[customerIndex] = realIndexStore;

        requestsSum[realIndexStore]+=requests[realIndexStore][customerIndex];
        //info("Customer "+customerIndex+" assigned to store "+realIndexStore);
        break;
      }
    }

  }
}


/*
  Returns <0 if valueA<valueB
          >0 if valueA>valueB
          =0 if valueA==valueB
*/

function ascendingCompareKeyValue(entryA, entryB){
  /*
    entryA[0] = key
    entryA[1] = value
  */

  if(entryA[VALUE]==entryB[VALUE]){
    return 0;
  } else {
    return entryA[VALUE] < entryB[VALUE]?-1:1;
  }

}

function descendingCompareKeyValue(entryA, entryB){
  /*
    entryA[0] = key
    entryA[1] = value
  */

  if(entryA[VALUE]==entryB[VALUE]){
    return 0;
  } else {
    return entryA[VALUE] > entryB[VALUE]?-1:1;
  }

}

// Compute the solution cost.
function z(x){
  cost = 0;
  for(var i=0;i<nStores;i++){
    for(var j=0;j<nCustomers;j++){
      cost += (x[i][j]*costs[i][j]);
    }
  }
  return cost;
}

// Returns true if the function is feasible, false otherwise.
function isFeasible(x){
  // Check if all the customers are served, and from one store.
  for(var j=0;j<nCustomers;j++){
    var correctlyServed = 0;
    for(var i=0;i<nStores;i++){
      correctlyServed += x[i][j];
    }
    if(correctlyServed!=1){
      warning("Customer "+j+" is not correctly served! Served from "+correctlyServed+ " stores.");
      return false;
    }
  }

  // Check stores capacities
  storeSum = [];
  for(var i=0;i<nStores;i++){
    storeSum[i] = 0;
    for(var j=0;j<nCustomers;j++){
      storeSum[i] += (x[i][j]*requests[i][j]);
    }
    if(storeSum[i]>capacities[i]){
      warning("Store "+i+ " capacity is exceeded! ("+storeSum[i]+">"+capacities[i]+")");
      return false;
    }
  }
  return true;
}


function knuthShuffle(arr) {
    var rand, temp, i;

    for (i = arr.length - 1; i > 0; i -= 1) {
        rand = Math.floor((i + 1) * Math.random());//get random between zero and i (inclusive)
        temp = arr[rand];//swap i and the zero-indexed number
        arr[rand] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

function descendingRequestsSumIndexes(){
  var reqSum = [];
  var arr = new Array(nCustomers);
  for(var j=0;j<nCustomers;j++){
    reqSum[j] = new Array(2);
    reqSum[j][KEY] = j;
    reqSum[j][VALUE] = 0;
    for(var i=0;i<nStores;i++){
      reqSum[j][VALUE]+= requests[i][j];
    }
  }

  reqSum.sort(ascendingCompareKeyValue);

  for(var j=0;j<nCustomers;j++){
    arr[j] = reqSum[j][KEY];
  }

  return arr;

}
