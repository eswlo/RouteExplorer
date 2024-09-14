import squaredDistanceBetweenPoints from './distanceBetweenPoints';
import { QUEUECOLOR,VISITEDCOLOR, PATHCOLOR} from './constants';

function getNeighborCellsArr(curr, grid) {
    const row = curr.y;
    const col = curr.x
    const rowUp = row - 1;
    const rowDown = row + 1;
    const colRight = col + 1;
    const colLeft = col - 1;
    const arr = [];

    if (colLeft >= 0) {
        arr.push(grid[row][colLeft]);
    }
    if (colRight < grid[0].length) {
        arr.push(grid[row][colRight]);
    }
    if (rowUp >= 0) {
        arr.push(grid[rowUp][col]);
    }
    if (rowDown < grid.length) {
        arr.push(grid[rowDown][col]);
    }
    return arr;
} 


function pushQueueAndRender(cell, queue, updateGrid) {
    queue.push(cell);
    heapify(queue);
    updateGrid(cell);
}

export default function aStart(startCell, endCell, grid, updateGrid) {
    const queue = [];
    const visitedSet = new Set();

    pushQueueAndRender(startCell, queue, updateGrid);

    while (queue) {
        const curr = heapPop(queue); // pop the cell with lowest f cost
        visitedSet.add(curr);
        if (curr.x === endCell.x && curr.y == endCell.y) {
            return drawPath();
        } else {
            const neighborCellsArr = getNeighborCellsArr(curr, grid);
            neighborCellsArr.forEach((nc) => {
                if (nc.state !== "barrier" && !visitedSet.has(nc)) {
                    // set/update g cost, set h cost, and set/update f cost
                    //set prev
                    //set color and state = 
                    if (!queue.includes(nc)) {
                        pushQueueAndRender(nc, queue, updateGrid);
                    }
                }
            })
        }
    }
    return "No route found";
}



