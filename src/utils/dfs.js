import * as CONSTANTS from './constants';

let tempPath = [];
const visitedSet = new Set();

function standardDFS(startCell, endCell, grid, updateGrid) {
    return dfs(startCell, endCell, grid, updateGrid, false);
}

function randomizedDFS(startCell, endCell, grid, updateGrid) {
    return dfs(startCell, endCell, grid, updateGrid, true);
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
    });
    // console.log('restorePath');
    // console.log(restorePath);
    updateGrid(restorePath);
}

function drawTempPath(path, startCell, updateGrid) {
    if (tempPath.length !== 0) {
        retoreTempPath(tempPath, startCell, updateGrid);
        tempPath = [];
    }
    tempPath = [...path];
    tempPath.forEach((cell) => {
        if (cell.id !== startCell.id) {
            cell.color = CONSTANTS.PATHCOLOR;
        }
    })
    // console.log('tempPath');
    // console.log(tempPath);
    updateGrid(tempPath);
}



function drawFinalPath(finalPath, startCell, endCell, updateGrid) {
    // console.log("drawFinalPath");
    finalPath.forEach((cell) => {
        if (cell.id !== startCell.id && cell.id !== endCell.id) {
            cell.color = CONSTANTS.PATHCOLOR;
        }
    })
    updateGrid(finalPath);
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


async function dfs(startCell, endCell, grid, updateGrid, isRandomized) {
    const pathStack = [];
    // console.log(endCell);
    pathStack.unshift([startCell]);
    visitedSet.add(startCell);
    while (pathStack.length !== 0) {
        await new Promise(resolve => setTimeout(resolve, 0)); // Wait for certain amount of tiie between each loop

        const path = pathStack.shift();
        // console.log(`path`);
        // console.log(path); 
        const pathSize = path.length;
        const curr = path[pathSize - 1];
        drawTempPath(path, startCell, updateGrid);
        if (curr.id === endCell.id) {
            return drawFinalPath(path, startCell, endCell, updateGrid);
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
                    pathStack.unshift(newPath);
                }
            });
        }
    }
    return "No route found";
}

export {
    standardDFS,
    randomizedDFS
}