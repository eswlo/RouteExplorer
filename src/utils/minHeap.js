class MinHeap {

    constructor() {
        this.queue = [];
    }

    root() {
        return 0;
    }

    leftChild(currentIdx) {
        return (2 * currentIdx + 1);
    }

    rightChild(currentIdx) {
        return (2 * currentIdx + 2);
    }

    parent(currentIdx) {
        return Math.floor((currentIdx - 1)/2);
    }

    hasAChild(currentIdx) {
        let hasC;
        const s = this.queue.length;
        if ((this.leftChild(currentIdx) <= (s - 1)) || (this.rightChild(currentIdx) <= (s - 1))) {
            hasC = true;
        } else {
            hasC = false;
        }
        return hasC;
    }

    swap(idx1, idx2) {
        let temp = this.queue[idx1];
        this.queue[idx1] = this.queue[idx2];
        this.queue[idx2] = temp;
    }

    heapifyDown(currentIdx) {
        const n = currentIdx;
        const root_n = this.root();

        if (n < root_n) {
            return;
        }

        while(this.hasAChild(currentIdx)) {
            const lc = this.leftChild(currentIdx);
            const rc = this.rightChild(currentIdx);
            if (lc >= this.queue.length) {
                // leaf
                break;
            } else if (lc < this.queue.length && rc >= this.queue.length) {
                // only left child
                if (this.queue[lc].f < this.queue[currentIdx].f) {
                    this.swap(lc, currentIdx);
                    currentIdx = lc;
                } else {
                    break;
                }
            } else {
                //2 children
                if (this.queue[lc].f < this.queue[rc].f) {
                    if (this.queue[lc].f < this.queue[currentIdx].f) {
                        this.swap(lc, currentIdx);
                        currentIdx = lc;
                    } else {
                        break;
                    }
                } else {
                    if (this.queue[rc].f < this.queue[currentIdx].f) {
                        this.swap(rc, currentIdx);
                        currentIdx = rc;
                    } else {
                        break;
                    }
                }
            }
        }
        n--;
        let newN = n;
        this.heapifyDown(newN);
    }


    heapifyUp(currentIdx){
        while (currentIdx > this.root()) {
            const parentIdx = this.parent(currentIdx);
            if (this.queue[currentIdx].f < this.queue[parentIdx].f) {
                this.swap(currentIdx, parentIdx);            
            }
            currentIdx--;
        }
    }

    heapPop() {
        if (this.queue.length === 0) return null;
        const n = Math.floor((this.queue.length) / 2);
        this.heapifyDown(n);
        const ret = this.queue[0];
        this.swap(0, this.queue.length - 1);
        this.queue.pop();
        const nn = Math.floor((this.queue.length) / 2);
        this.heapifyDown(nn);
        return ret;
    }

    heapPush(cell){
        this.queue.push(cell);
        const currI = this.queue.length - 1;
        this.heapifyUp(currI);
    }
}

export { MinHeap };