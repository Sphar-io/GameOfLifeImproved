document.addEventListener('DOMContentLoaded', function() {
	load();
}, false);

var mouseDown=false;
var lastX = 0;
var lastY = 0;
var curX;
var curY;

function initListeners() {
	//add event handlers
	canvas.addEventListener("mousemove", getPosition, false);
	canvas.addEventListener("mousedown", clickDown, false);
	canvas.addEventListener("mouseup", clickUp, false);
	document.addEventListener("keydown", keypressCheck, false);
}

//creates objects for gui
function defaultValObj(){
	this.randomFill = 75;
	this.pause = function(){pauseGame();};
	this.regenerate = function(){regenerateGame();};
	this.stepAnimation = function(){stepGame();};
	this.clearGame = function(){clearGame();};
	this.gameMode = 'Original';
	this.gameSize = 75;
	this.acorn = function(){};
	//initializes game
	regenerateGame();
	randomFillChange(this.randomFill);
	gameModeChange(this.gameMode);
	gameSizeChange(this.gameSize);
	initializeGrid();
	initListeners();
}

function generatePatterns(){
	this.acorn = function(){};
}
var gui;
//creates gui items
window.onload = function() {
	//create objects for gui
	var menu = new defaultValObj();
	var patterns = new generatePatterns();
	gui = new dat.GUI();
	//start adding to gui
	//Folder for simulation settings
	var f1 = gui.addFolder('Simulation Settings');
		f1.add(menu, 'gameMode', ['Original', 'Maze']).onChange(gameModeChange);
		f1.add(menu, 'randomFill', 0, 100).onChange(randomFillChange);
		f1.add(menu, 'gameSize', 0, 100).onChange(gameSizeChange);
		//subfolder for patterns
		var f1s1 = f1.addFolder('Example Patterns');
			f1s1.add(patterns, 'acorn');
	//folder for controls
	var f2 = gui.addFolder('Controls');
		f2.add(menu, 'pause');
		f2.add(menu, 'regenerate');
		f2.add(menu, 'stepAnimation');
		f2.add(menu, 'clearGame');
	//end adding to gui


	//opens menus
	f1.open();
	f2.open();

	//call first tick of program after window is loaded
	regenerateGame();
	update();
}

//functions when a value is changed
function gameModeChange(value){
	gameMode = value;
	fillRandom(); //re-initializes
	draw();
}

function clearGame(){
	stepCount = 0;
	var tempFill = fillAmount;
	fillAmount = 0;
	fillRandom();
	draw();
	fillAmount = tempFill;
}

function randomFillChange(value){
	fillAmount = value;
	fillRandom(); //re-initializes
	draw();
}

function gameSizeChange(value){
	var tempSize = value/100 //decimal
	tempSize = Math.floor(tempSize*canvas.width);
	width = tempSize;
	height = tempSize;
	initializeGrid();
	regenerateGame();
	draw();
}

//functions when a button is pressed
function pauseGame(){
	gamePaused = !gamePaused;
}

function regenerateGame(){
	stepCount = 0; //restarts
	canvasData = ctx.createImageData(canvas.width, canvas.height);
	data = canvasData.data;
	fillRandom();
	draw();
}

function stepGame(){
	genCount++;
	golStep();
	draw();
}

function draw(){
	for (var i = 0; i < curGen.length; i++) {
		for (var j = 0; j < curGen[i].length; j++) {
			var index = ((canvas.width*j+i)*4);
			var alpha = 0;
			if(curGen[i][j]==1){
				alpha = 255;
			}
			data[index+3] = alpha;	
		}
	}
	//move to center of page
	ctx.putImageData(canvasData,0,0);
}

function clickDown(event){
	mouseDown = !mouseDown;
	gamePaused = true;
}

function clickUp(event){
	mouseDown = !mouseDown;
	gamePaused = false;
}

function getPosition(event){
	var rect = canvas.getBoundingClientRect();
	curX = Math.floor(event.clientX - rect.left);
  	curY = Math.floor(event.clientY - rect.top);
	if(mouseDown){ //check if the mouse is down
		if (curX < (width) && curY < (height)){
			drawLine();
		}
	}
	lastX = curX;
	lastY = curY;
}
function keypressCheck(event){
	if(event.which == 80) { //space bar
		pauseGame ();
	}
}

//bresenham line formula
  function drawLine () {
    // Translate coordinates
    var x1 = curX;
    var y1 = curY;
    var x2 = lastX;
    var y2 = lastY;

    // Define differences and error check
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;

    // Main loop
    while (!((x1 == x2) && (y1 == y2))) {
      var e2 = err << 1;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
      // Set coordinates
      curGen[x1][y1] = 1;
    }
    draw();
}




//game step function
function update() {
	if(!gamePaused){
		genCount++;
		golStep();
		draw();
		requestAnimationFrame(update);
	}else {
		//try again
		requestAnimationFrame(update);
	}

}
