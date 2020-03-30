function findTimeIndex(arr, time) {
    let head = 0;
    let tail = arr.length - 1;

    while (tail - head > 1) {
        let mid = Math.floor((head + tail) / 2);
        let midNum = arr[mid].time;

        if (time > midNum) {
            head = mid;
        } else if (time < midNum) {
            tail = mid - 1;
        } else {
            return mid;
        }
    }

    if (head == tail) {
        return head;
    } else {
        if (time >= arr[tail].time) {
            return tail;
        } else {
            return head;
        }
    }
}    

export default findTimeIndex;