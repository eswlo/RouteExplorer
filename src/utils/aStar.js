// import { useState } from 'react';
import * as CONSTANTS from './constants';
import { MinHeap } from './minHeap';
import getVisitedCellFreq from "./getVisitedCellFreq";
import getDistance from './getDistance';

let tempPath = [];
let runSearch = true;
let delayTime = 0;
let isPause = false;
let resolve;


function setDelayTime(newDelayTime) {
    delayTime = newDelayTime;
}

const delay = () => {
    return new Promise((res) => {
        resolve = res;
        setTimeout(() => {
            if (!isPause) {
                resolve();
            }
        }, delayTime)
    }); // Wait for certain amount of tiie between each loop
}

const pause = () => {
    isPause = !isPause;
    if (!isPause) {
        resolve();
    };
}

function terminateSearch() {
    runSearch = false;
    // console.log(`terminate in search: ${runSearch}`);
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

function drawFinalPath(cell, startCell, endCell, updateGrid, handleSearchDone) {
    const finalPath = [];
    let curr = cell;
    while (curr.id !== startCell.id) {
        finalPath.unshift(curr);
        // console.log(curr.x, curr.y);
        curr = curr.prev;
    }
    finalPath.unshift(curr);
    finalPath.forEach((cell) => {
        cell.makeSound = false;
        if (cell.id !== startCell.id && cell.id !== endCell.id) {
            cell.color = CONSTANTS.PATHCOLOR;
            cell.freq = getVisitedCellFreq(cell, startCell, endCell);
            // console.log(cell.freq);
        }
    })
    // console.log(endCell.freq);
    handleSearchDone();
    updateGrid(finalPath);
    return "Route Found";
}

function retoreTempPath(tempPath, startCell, updateGrid) {
    tempPath.forEach((cell) => {
        if (cell.id !== startCell.id) {
            cell.color = CONSTANTS.VISITEDCOLOR;
        }
        cell.makeSound = false;
    });
    updateGrid(tempPath);
}

function drawTempPath(cell, startCell, endCell, updateGrid) {
    if (tempPath.length != 0) {
        retoreTempPath(tempPath, startCell, updateGrid);
        tempPath = [];
    }
    let curr = cell;
    const lastCellID = curr.id;
    
    while (curr.id !== startCell.id) {
        if (curr.id === lastCellID) {
            curr.makeSound = true;
        }
        tempPath.unshift(curr);
        // console.log(curr.x, curr.y);
        if (curr.prev != null) {
            curr = curr.prev;
        } else {
            break;
        }
    }
    tempPath.unshift(curr);
    tempPath.forEach((cell) => {
        if (cell.id !== startCell.id) {
            cell.color = CONSTANTS.PATHCOLOR;
            cell.freq = getVisitedCellFreq(cell, startCell, endCell);
            // console.log(cell.freq);
        }
    })
    updateGrid(tempPath);
}


function isNewPathShorter(curr, neighbor) {
    return ((curr.g + getDistance(curr, neighbor)) < neighbor.g)
}

async function aStar(startCell, endCell, grid, updateGrid, handleSearchDone) {    
    // console.log("in astar");
    // console.log(runSearch);
    const queue = new MinHeap();
    const visitedSet = new Set();

    startCell.g = 0;
    startCell.h = getDistance(startCell, endCell);
    startCell.f = startCell.g + startCell.h;
    pushToQueueAndRender(startCell, queue, updateGrid);


    while (!queue.isEmpty() && runSearch) {
        // await new Promise((resolve) => {
        //     timeoutId = setTimeout(resolve, delayTime)
        // }); // Wait for certain amount of tiie between each loop
        await delay();

        const curr = queue.heapPop(); // pop the cell with lowest f cost
        addToSetAndRender(curr, visitedSet, updateGrid);
        drawTempPath(curr, startCell, endCell, updateGrid);

        if (curr.id === endCell.id) {
            return drawFinalPath(curr, startCell, endCell, updateGrid, handleSearchDone);
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
    handleSearchDone();
    return "Rote Not Found"
}


export {terminateSearch, aStar, reset, setDelayTime, pause}