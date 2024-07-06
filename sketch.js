let grid;
let rows; 
let cols;
let min_res = 10;
let max_rows;
let max_cols;
let resolution;
let active = false;
let slider;
let start_row;
let start_col;

//problem: has trouble with resizing after i scroll 
//the grid is probably bigger than the draw screen

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  }

function setup() {
    createCanvas(800,600);
    background(255);
    slider = createSlider(10, 100, 10);
    slider.position(10, 10);
    slider.size(100);
    resolution = slider.value();

    start_row = 0;
    start_col = 0;
    cols = width/resolution;
    rows = height/resolution;
    max_cols = width/min_res;
    max_rows = height/min_res;

    grid = make2DArray(max_cols, max_rows);

    if(active) run();

    for(let i = 0; i<max_cols; i++) {
        for(let j = 0; j< max_rows; j++) {
            //if(grid[i][j]!= 1) 
            grid[i][j] = floor(random(2));
        }
    }
    draw(); 
}

function draw(){
    resolution = slider.value();
    cols = width/resolution;
    rows = height/resolution;  
    if(active) calculateNext();

    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            let x = i * resolution;
            let y = j * resolution;

            if(grid[i+start_col][j+start_row] == 1){
                fill(255); 
                rect(x,y,resolution,resolution);
                stroke(0);
            }
            else{
                fill(0);
                rect(x,y,resolution,resolution);
                stroke(50);
            }
        }
    }

    if(keyIsPressed){
        // if(keyCode == DOWN_ARROW && (start_row + rows < max_rows)) start_row++;
        // if(keyCode == UP_ARROW && (start_row > 0)) start_row--;
        // if(keyCode == LEFT_ARROW && (start_col > 0)) start_col--;
        // if(keyCode == RIGHT_ARROW && (start_col + cols < max_cols)) start_col++;

        if(keyCode == DOWN_ARROW && (start_row + rows < grid[0].length)) start_row++;
        if(keyCode == UP_ARROW && (start_row > 0)) start_row--;
        if(keyCode == LEFT_ARROW && (start_col > 0)) start_col--;
        if(keyCode == RIGHT_ARROW && (start_col + cols < grid.length)) start_col++;
    }
}

function step() {
    calculateNext();
    draw();
}

function mousePressed() {
    let x = floor(mouseX/resolution);
    let y = floor(mouseY/resolution);
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
        if(active) run();
        grid[x][y] = 1; // Set the clicked cell to white (alive)
    }
}
function mouseDragged(){
    let x = floor(mouseX/resolution);
    let y = floor(mouseY/resolution);
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
        if(active) run();
        grid[x+start_col][y+start_row] = 1; // Set the clicked cell to white (alive)
    }
}


function clearGrid() {
    start_row = 0;
    start_col = 0;
    if(active) active = false;
    for (let i = 0; i < max_cols; i++) {
        for (let j = 0; j < max_rows; j++) {
            grid[i][j] = 0;
        }
    }
}

function calculateNext() {
    for (let i = 0; i < max_cols; i++) {
        for (let j = 0; j < max_rows; j++) {
            let lives = numNeighbors(max_cols, max_rows, i, j);

            if (grid[i][j] == 1 && lives >= 2 && lives <= 3) {  
                grid[i][j] = 3;
            }
            if (grid[i][j] == 0 && lives == 3) {
                grid[i][j] = 2; 
            }
        }
    }

    for (let i = 0; i < max_cols; i++) {
        for (let j = 0; j < max_rows; j++) {
            grid[i][j] >>= 1;  
        }
    }
}

function numNeighbors(m, n, i, j) {
    let lives = 0;
    for (let x = Math.max(i - 1, 0); x <= Math.min(i + 1, m - 1); x++) {
        for (let y = Math.max(j - 1, 0); y <= Math.min(j + 1, n - 1); y++) {
            lives += grid[x][y] & 1;
        }
    }
    lives -= grid[i][j] & 1;
    return lives;
}

function run() {
    active = !active;
}

