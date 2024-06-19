let grid;
let rows; 
let cols;
let min_res = 10;
let max_rows;
let max_cols;
let resolution;
let active = false;
let slider;
let start_x = 0;
let start_y = 0;

function make2DArray(rows, cols) {
    let array = new Array(rows);
    for (let i = 0; i<array.length; i++) {
        array[i] = new Array(cols);
    }
    return array;
}

function setup() {
    createCanvas(800,600);
    slider = createSlider(10, 100, 10);
    slider.position(10, 10);
    slider.size(100);
    resolution = slider.value();

    rows = width/resolution;
    cols = height/resolution;
    max_rows = width/min_res;
    max_cols = height/min_res;

    grid = make2DArray(max_rows, max_cols);

    for(let i = start_x; i<max_rows; i++) {
        for(let j = start_y; j< max_cols; j++) {
            if(grid[i][j]!= 1) grid[i][j] = floor(random(2));
        }
    }
    draw(); 
}

function draw(){
    resolution = slider.value();
    rows = width/resolution;
    cols = height/resolution;
    if(active) calculateNext();

    for(let i = start_x; i<rows; i++) {
        for(let j = 0; j< cols; j++) {
            let x = i * resolution;
            let y = j * resolution; 
            if(grid[i][j] == 1){
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
    
    if (keyIsDown(RIGHT_ARROW) === true) {
        start_x ++;
    }
    if (keyIsDown(LEFT_ARROW) === true) {
        start_x --;
    }
}

function step() {
    calculateNext();
    draw();
}

function mousePressed() {
    let x = floor(mouseX/resolution);
    let y = floor(mouseY/resolution);
    if (x >= 0 && x < rows && y >= 0 && y < cols) {
        if(active) run();
        grid[x][y] = 1; // Set the clicked cell to white (alive)
    }
}
function mouseDragged(){
    let x = floor(mouseX/resolution);
    let y = floor(mouseY/resolution);
    if (x >= 0 && x < rows && y >= 0 && y < cols) {
        if(active) run();
        grid[x][y] = 1; // Set the clicked cell to white (alive)
    }
}


function clearGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
        }
    }
}

function calculateNext() {
    for (let i = 0; i < max_rows; i++) {
        for (let j = 0; j < max_cols; j++) {
            let lives = numNeighbors(max_rows, max_cols, i, j);

            if (grid[i][j] == 1 && lives >= 2 && lives <= 3) {  
                grid[i][j] = 3;
            }
            if (grid[i][j] == 0 && lives == 3) {
                grid[i][j] = 2; 
            }
        }
    }

    for (let i = 0; i < max_rows; i++) {
        for (let j = 0; j < max_cols; j++) {
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

