

function translateLyricToArr(lrcStr){
    let regExp = /((\[\d\d:\d\d\.\d{1,4}\])+)(.*)\n/g;


    let result;
    let arr = [];
    while (result = regExp.exec(lrcStr)){
        // console.log(result);

        let l = result[3];
        if(!l){
            l = "-";
        }
        let times = result[1];

        let reg2 = /\[(\d\d):(\d\d\.\d{1,4})\]/g;

        let res2;
        while (res2 = reg2.exec(times)){
            // console.log(res2);
            let t = res2[1]*60+res2[2]*1;
            arr.push({
                lrc:l,
                time:t
            });
        }
    }
    
    arr.sort(function(n1,n2){
        if(n1.time>n2.time){
            return 1;
        }else if(n1.time<n2.time){
            return -1;
        }else{
            return 0;
        }
    })

    // console.log(arr);


    return arr;
}


export default translateLyricToArr;


