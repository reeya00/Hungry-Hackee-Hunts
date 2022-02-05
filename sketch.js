let colsNum, rowsNum;
let cellSize = 40;
let grid = [];

let currentCell;

function setup() {
    let canvas = createCanvas(400, 400);
    canvas.position(150, 50);
    colsNum = floor(width / cellSize);
    rowsNum = floor(height / cellSize);
    frameRate(5);
    
    for (let row = 0; row < rowsNum; row++) {
        for (let column = 0; column < colsNum; column++) {
            let cell = new Cell(row, column);
            grid.push(cell);
        }
    }

    currentCell = grid[0]; //starting from grid[0]
}

function draw() {
    background(51);
    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    currentCell.visited = true;
    currentCell.highlight();
    // randomly choosing one of the unvisited neighbours
    let nextCell = currentCell.checkNeighbours();
    if (nextCell) {
        nextCell.visited = true;
        removeWalls(currentCell, nextCell);
        // make the chosen cell the current cell and mark it as visited
        currentCell = nextCell;
    }
}

function index(row, column) {
    if (row < 0 || column < 0 || column > colsNum - 1 || row > rowsNum - 1) {
        return -1;
    }
    return column + row * colsNum;
}

function Cell(row, column) {
    this.row = row;
    this.column = column;
    this.walls = [true, true, true, true]; // top right bottom left
    this.visited = false;

    this.checkNeighbours = function() {
        let neighbours = [];

        let top    = grid[index(row - 1, column)];
        let right  = grid[index(row, column + 1)];
        let bottom = grid[index(row + 1, column)];
        let left   = grid[index(row, column - 1)];

        if (top && !top.visited) {
            neighbours.push(top);
        }
        if (right && !right.visited) {
            neighbours.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbours.push(bottom);
        }
        if (left && !left.visited) {
            neighbours.push(left);
        }

        if (neighbours.length > 0) {
            let r = floor(random(0, neighbours.length));
            return neighbours[r];
        }
    }

    this.show = function() {
        let x = this.column * cellSize;
        let y = this.row * cellSize;
        stroke(255);

        if (this.walls[0]) {
            line(x, y, x + cellSize, y);
        }
        if (this.walls[1]) {
            line(x + cellSize, y, x + cellSize, y + cellSize);
        }
        if (this.walls[2]) {
            line(x, y + cellSize, x + cellSize, y + cellSize);
        }
        if (this.walls[3]) {
            line(x, y, x, y + cellSize);
        }

        if (this.visited) {
            noStroke();
            fill(0, 255, 0, 100);
            rect(x, y, cellSize, cellSize);
        }
    }

    this.highlight = function() {
        let x = this.column * cellSize;
        let y = this.row * cellSize;
        noStroke();
        fill(255, 0, 0, 100);
        rect(x, y, cellSize, cellSize);
    }
    
}

function removeWalls(cell1, cell2) {
    let x = cell1.column - cell2.column;
    if (x === 1) {
        cell1.walls[3] = false;
        cell2.walls[1] = false;
    }
    else if (x === -1) {
        cell1.walls[1] = false;
        cell2.walls[3] = false;
    }

    let y = cell1.row - cell2.row;
    if (y === 1) {
        cell1.walls[0] = false;
        cell2.walls[2] = false;
    }
    if (y === -1) {
        cell1.walls[2] = false;
        cell2.walls[0] = false;
    }
}