function solveConstructive(){
  //info("Solving using a constructive heuristic...")


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
    requestsCustomer = new Array(nStores);
    for(var i=0;i<nStores;i++){
      requestsCustomer[i] = new Array(2);
      requestsCustomer[i][KEY] = i;
      requestsCustomer[i][VALUE] = requests[i][j];
    }
    requestsCustomer.sort(compareKeyValue)
    // ora ho le richieste del cliente ordinate per richiesta minore
    // le scorro e assegno al primo magazzino libero

    for(var i=0;i<nStores;i++){
      realIndexStore = requestsCustomer[i][KEY];
      if(requestsSum[realIndexStore]+requests[realIndexStore][j] <= capacities[realIndexStore]){
        x[realIndexStore][j] = 1;
        requestsSum[realIndexStore]+=requests[realIndexStore][j];
        //info("Customer "+j+" assigned to store "+realIndexStore);
        break;
      }
    }

  }


  if(verboseLog){
    for(var i=0;i<nStores;i++){
      var reqSum = 0;
      for(var j=0;j<nCustomers;j++){
        reqSum += (x[i][j]*requests[i][j]);
      }
      log("Store "+i+" requests: "+reqSum+" < "+capacities[i]);
    }

    log("Solution:")
    printMatrix(x, nStores, nCustomers)
    log("Cost: "+z(x));
    log("is feasible: "+ isFeasible(x));

    gap10opt();

    log("Solution:")
    printMatrix(x, nStores, nCustomers)
    log("Cost: "+z(x));
    log("is feasible: "+ isFeasible(x));
    }
}


/*
  Returns <0 if valueA<valueB
          >0 if valueA>valueB
          =0 if valueA==valueB
*/

function compareKeyValue(entryA, entryB){
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
