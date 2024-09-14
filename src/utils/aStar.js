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
    if (cell.state !== CONSTANTS.STARTSTATE && cell.state !== CONSTANTS.ENDSTATE) {
        cell.color = CONSTANTS.QUEUECOLOR;
    }
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

function setNeighborCellCosts(curr, neighbor, startCell, endCell) {
    neighbor.h = getDistance(neighbor, endCell);
    if (neighbor.f === Infinity) {
        neighbor.g = curr.g + getDistance(curr, neighbor);
        neighbor.f = neighbor.g + neighbor.h;
    } else {
        if (isNewPathShorter(curr, neighbor)) {
            neighbor.g = curr.g + getDistance(curr, neighbor);
            neighbor.f = neighbor.g + neighbor.h;
        } 
    }
}

function getAndDrawPath(cell, startCell, endCell, updateGrid) {
    const path = [];
    let curr = cell;
    while (curr.id !== startCell.id) {
        path.unshift(curr);
        // console.log(curr.x, curr.y);
        curr = curr.prev;
    }
    path.unshift(curr);
    path.forEach((cell) => {
        if (cell.id !== startCell.id && cell.id !== endCell.id) {
            cell.color = CONSTANTS.PATHCOLOR;
            updateGrid(cell);
        }
    })
}


function getDistance(cell1, cell2) {
    const x = Math.abs(cell1.x - cell2.x);
    const y = Math.abs(cell1.y - cell2.y);
    return Math.sqrt((x*x + y*y));
}

function isNewPathShorter(curr, neighbor) {
    return ((curr.g + getDistance(curr, neighbor)) < neighbor.g)
}

export default async function aStar(startCell, endCell, grid, updateGrid) {
    const queue = new MinHeap();
    const visitedSet = new Set();

    startCell.g = 0;
    startCell.h = getDistance(startCell, endCell);
    startCell.f = startCell.g + startCell.h;
    pushToQueueAndRender(startCell, queue, updateGrid);

    while (!queue.isEmpty()) {

        await new Promise(resolve => setTimeout(resolve, 10)); // Wait for certain seconds for each loop

        const curr = queue.heapPop(); // pop the cell with lowest f cost
        addToSetAndRender(curr, visitedSet, updateGrid);
        if (curr.id === endCell.id) {
            return getAndDrawPath(curr, startCell, endCell, updateGrid);
        } else {
            const neighborCellsArr = getNeighborCellsArr(curr, grid);
            for (const nc of neighborCellsArr) {
                if (nc.state === CONSTANTS.BARRIERSTATE || visitedSet.has(nc)) {
                    continue;
                }
                if (isNewPathShorter(curr, nc) || !queue.contains(nc)) {
                    setNeighborCellCosts(curr, nc, startCell, endCell);
                    nc.prev = curr;
                    if (!queue.contains(nc)) {
                        pushToQueueAndRender(nc, queue, updateGrid);
                    }
                }
            }
        }
    }
    return "No route found";
}



