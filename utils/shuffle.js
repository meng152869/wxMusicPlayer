
Array.prototype.shuffle = function(){
    let tempArr = this.slice();

    let arr = [];

    while(tempArr.length>0){
        let ind = Math.floor(Math.random() * tempArr.length);

        arr.push(tempArr[ind]);

        tempArr.splice(ind,1);
    }

    return arr;
}



