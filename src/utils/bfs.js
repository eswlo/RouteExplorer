import * as CONSTANTS from './constants';
import getVisitedCellFreq from "./getVisitedCellFreq";


let tempPath = [];
const visitedSet = new Set();
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


function regularBFS(startCell, endCell, grid, updateGrid, handleSearchDone) {
    return bfs(startCell, endCell, grid, updateGrid, false, handleSearchDone);
}

function randomizedBFS(startCell, endCell, grid, updateGrid, handleSearchDone) {
    return bfs(startCell, endCell, grid, updateGrid, true, handleSearchDone);
}

function terminateSearch() {
    runSearch = false;
}

function reset() {
    tempPath = [];
    visitedSet.clear();
    runSearch = true;
    delayTime;
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


function retoreTempPath(restorePath, startCell, updateGrid) {
    restorePath.forEach((cell) => {
        if (cell.id !== startCell.id) {
            cell.color = CONSTANTS.VISITEDCOLOR;
        }
        cell.makeSound = false;
    });
    // console.log('restorePath');
    // console.log(restorePath);
    updateGrid(restorePath);
}

function drawTempPath(path, startCell, endCell, updateGrid, lastCellID) {
    if (tempPath.length !== 0) {
        retoreTempPath(tempPath, startCell, updateGrid);
        tempPath = [];
    }
    tempPath = [...path];
    tempPath.forEach((cell) => {
        if (cell.id !== startCell.id) {
            cell.color = CONSTANTS.PATHCOLOR;
        }
        if (cell.id === lastCellID && cell.id != startCell.id) {
            cell.freq = getVisitedCellFreq(cell, startCell, endCell);
            cell.makeSound = true;
        }
        // updateGrid([cell]);
    })
    // console.log('tempPath');
    // console.log(tempPath);
    updateGrid(tempPath);
}



function drawFinalPath(finalPath, startCell, endCell, updateGrid, handleSearchDone) {
    // console.log("drawFinalPath");
    finalPath.forEach((cell) => {
        if (cell.id !== startCell.id && cell.id !== endCell.id) {
            cell.color = CONSTANTS.PATHCOLOR;
        }
    });
    reset();
    handleSearchDone();
    updateGrid(finalPath);
    return "Route Found";
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


export default async function bfs(startCell, endCell, grid, updateGrid, isRandomized, handleSearchDone) {
    const pathQueue = [];
    // console.log(endCell);
    pathQueue.push([startCell]);
    visitedSet.add(startCell);
    while (pathQueue.length !== 0 && runSearch) {
        // await new Promise(resolve => setTimeout(resolve, delayTime)); // Wait for certain amount of tiie between each loop
        await delay();
        const path = pathQueue.shift();
        // console.log(`path`);
        // console.log(path); 
        const pathSize = path.length;
        const curr = path[pathSize - 1];
        const lastCellID = curr.id;
        drawTempPath(path, startCell, endCell, updateGrid, lastCellID);
        if (curr.id === endCell.id) {
            return drawFinalPath(path, startCell, endCell, updateGrid, handleSearchDone);
        } else {
            let neighborCellsArr = getNeighborCellsArr(curr, grid);
            if (isRandomized) {
                const shuffledNeighborCellsArr = shuffleArray(neighborCellsArr);
                neighborCellsArr = [...shuffledNeighborCellsArr];
            }
            neighborCellsArr.forEach((nc) => {
                if (!visitedSet.has(nc) && (nc.state === CONSTANTS.DEFAULTSTATE || nc.state === CONSTANTS.ENDSTATE)) {
                    if (nc.state === CONSTANTS.DEFAULTSTATE) {
                        nc.color = CONSTANTS.QUEUECOLOR;
                    }                    
                    const newPath = [...path];
                    newPath.push(nc);
                    visitedSet.add(nc);
                    pathQueue.push(newPath);
                }
            });
        }
    }
    reset();
    handleSearchDone();
    return "No route found";
}


export {
    regularBFS,
    randomizedBFS,
    terminateSearch,
    reset,
    setDelayTime,
    pause
}