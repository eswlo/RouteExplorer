import squaredDistance from './squaredDistance';
import * as CONSTANTS from './constants';
import { MinHeap } from './minHeap';

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
        if (rowUp >= 0) {
            arr.push(grid[rowUp][colLeft]);
        }
        if (rowDown < grid.length) {
            arr.push(grid[rowDown][colLeft]);
        }
    }
    if (colRight < grid[0].length) {
        arr.push(grid[row][colRight]);
        if (rowUp >= 0) {
            arr.push(grid[rowUp][colRight]);
        }
        if (rowDown < grid.length) {
            arr.push(grid[rowDown][colRight]);
        }
    }
    if (rowUp >= 0) {
        arr.push(grid[rowUp][col]);
    }
    if (rowDown < grid.length) {
        arr.push(grid[rowDown][col]);
    }
    return arr;
} 


function pushToQueueAndRender(cell, queue, updateGrid) {
    queue.heapPush(cell);
    updateGrid(cell);
}

function addToSetAndRender(cell, visitedSet, updateGrid) {
    if (cell.state !== CONSTANTS.STARTSTATE && cell.state !== CONSTANTS.ENDSTATE) {
        cell.color = CONSTANTS.VISITEDCOLOR;
    }
    visitedSet.add(cell);
    updateGrid(cell);
}

function calculateCosts(cell, startCell, endCell) {
    if (cell.g === null) {
        cell.g = squaredDistance(cell, startCell);
        cell.h = squaredDistance(cell, endCell);
        cell.f = cell.g + cell.h;
    } else {
        cell.g = Math.min(cell.g, cell.prev.g + squaredDistance(cell, cell.prev));
        cell.f = cell.g + cell.h;
    }
}

function getAndDrawPath(cell, startCell, updateGrid) {
    const path = [];
    let curr = cell;
    while (curr.x != startCell.x && curr.y != startCell.y) {
        path.unshift(curr);
        curr = curr.prev;
    }
    path.unshift(curr);
    path.forEach((cell) => {
        cell.color = CONSTANTS.PATHCOLOR;
        updateGrid(cell);
    })
}

export default async function aStar(startCell, endCell, grid, updateGrid) {
    const queue = new MinHeap();
    const visitedSet = new Set();

    pushToQueueAndRender(startCell, queue, updateGrid);

    while (!queue.isEmpty()) {

        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second for each loop

        const curr = queue.heapPop(); // pop the cell with lowest f cost
        addToSetAndRender(curr, visitedSet, updateGrid);
        if (curr.x === endCell.x && curr.y == endCell.y) {
            return getAndDrawPath(curr, startCell, updateGrid);
        } else {
            const neighborCellsArr = getNeighborCellsArr(curr, grid);
            neighborCellsArr.forEach((nc) => {
                if (nc.state !== CONSTANTS.BARRIERSTATE && !visitedSet.has(nc)) {
                    nc.prev = curr;
                    if (nc.state !== CONSTANTS.ENDSTATE) {
                        nc.color = CONSTANTS.QUEUECOLOR;
                    }
                    calculateCosts(nc, startCell, endCell);
                    if (!queue.contains(nc)) {
                        pushToQueueAndRender(nc, queue, updateGrid);
                    }
                }
            })
        }
    }
    return "No route found";
}



