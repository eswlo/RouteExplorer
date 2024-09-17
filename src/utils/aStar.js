// import { useState } from 'react';
import * as CONSTANTS from './constants';
import { MinHeap } from './minHeap';

let tempPath = [];
let runSearch = true;
let delayTime = 0;

function setDelayTime(newDelayTime) {
    delayTime = newDelayTime;
}

function terminateSearch() {
    runSearch = false;
    console.log(`terminate in search: ${runSearch}`);
}

function reset() {
    tempPath = [];
    runSearch = true;
    delayTime = 0;
}

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
    cell.isQueued = true;
    if (cell.state === CONSTANTS.DEFAULTSTATE) {
        cell.color = CONSTANTS.QUEUECOLOR;
    }
    queue.heapPush(cell);
    updateGrid([cell]);
}

function addToSetAndRender(cell, visitedSet, updateGrid) {
    cell.isVisited = true;
    if (cell.state === CONSTANTS.DEFAULTSTATE) {
        cell.color = CONSTANTS.VISITEDCOLOR;
    }
    visitedSet.add(cell);
    updateGrid([cell]);
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

function drawFinalPath(cell, startCell, endCell, updateGrid) {
    const finalPath = [];
    let curr = cell;
    while (curr.id !== startCell.id) {
        finalPath.unshift(curr);
        // console.log(curr.x, curr.y);
        curr = curr.prev;
    }
    finalPath.unshift(curr);
    finalPath.forEach((cell) => {
        if (cell.id !== startCell.id && cell.id !== endCell.id) {
            cell.color = CONSTANTS.PATHCOLOR;
        }
    })
    updateGrid(finalPath);
    return "Route Found";
}

function retoreTempPath(tempPath, startCell, updateGrid) {
    tempPath.forEach((cell) => {
        if (cell.id !== startCell.id) {
            cell.color = CONSTANTS.VISITEDCOLOR;
        }
    });
    updateGrid(tempPath);
}

function drawTempPath(cell, startCell, updateGrid) {
    if (tempPath.length != 0) {
        retoreTempPath(tempPath, startCell, updateGrid);
        tempPath = [];
    }
    let curr = cell;
    while (curr.id !== startCell.id) {
        tempPath.unshift(curr);
        // console.log(curr.x, curr.y);
        curr = curr.prev;
    }
    tempPath.unshift(curr);
    tempPath.forEach((cell) => {
        if (cell.id !== startCell.id) {
            cell.color = CONSTANTS.PATHCOLOR;
        }
    })
    updateGrid(tempPath);
}


function getDistance(cell1, cell2) {
    const x = Math.abs(cell1.x - cell2.x);
    const y = Math.abs(cell1.y - cell2.y);
    return Math.sqrt((x*x + y*y));
}

function isNewPathShorter(curr, neighbor) {
    return ((curr.g + getDistance(curr, neighbor)) < neighbor.g)
}

async function aStar(startCell, endCell, grid, updateGrid) {    
    console.log("in astar");
    console.log(runSearch);
    const queue = new MinHeap();
    const visitedSet = new Set();

    startCell.g = 0;
    startCell.h = getDistance(startCell, endCell);
    startCell.f = startCell.g + startCell.h;
    pushToQueueAndRender(startCell, queue, updateGrid);


    while (!queue.isEmpty() && runSearch) {
        await new Promise(resolve => setTimeout(resolve, delayTime)); // Wait for certain amount of tiie between each loop

        const curr = queue.heapPop(); // pop the cell with lowest f cost
        addToSetAndRender(curr, visitedSet, updateGrid);
        drawTempPath(curr, startCell, updateGrid);

        if (curr.id === endCell.id) {
            return drawFinalPath(curr, startCell, endCell, updateGrid);
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
    return "Rote Not Found"
}


export {terminateSearch, aStar, reset, setDelayTime}