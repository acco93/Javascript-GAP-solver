function decode(instance, result){
    var matrix = new Array(instance.nStores);
    for(var i=0;i<instance.nStores;i++){
        matrix[i] = new Array(instance.nCustomers);
        for(var j=0;j<instance.nCustomers;j++){
            matrix[i][j] = 0;
        }
    }

    for (var property in result) {
        if (result.hasOwnProperty(property)) {
            if(property.startsWith("x")){
                var splitted = property.split("_");
                matrix[splitted[1]][splitted[2]] = result[property];
            }
        }

    }

    return matrix;
}