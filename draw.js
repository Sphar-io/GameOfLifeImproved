document.addEventListener('DOMContentLoaded', function() {
	load();
}, false);

var mouseDown=false;

//creates objects for gui
function defaultValObj(){
	this.randomFill = 75;
	this.pause = function(){pauseGame();};
	this.regenerate = function(){regenerateGame();};
	this.stepAnimation = function(){stepGame();};
	this.gameMode = 'Original';
	this.gameSize = 75;
	regenerateGame();
	randomFillChange(this.randomFill);
	gameModeChange(this.gameMode);
	gameSizeChange(this.gameSize);
	initializeGrid();
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

//add event handlers
//canvas.addEventListener("mousemove", getPosition, false);
//canvas.addEventListener("mousedown", dragChange, false);
//canvas.addEventListener("mouseup", dragChange, false);
//document.addEventListener("keydown", keypressCheck, false);

function dragChange(event){
	mouseDown != mouseDown;
	gamePaused = true;
}

function getPosition(){
	var x = event.pageX;
	var y = event.pageY;
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	if(mousedown){ //check if the mouse is down
		if (x < width && y < height){ //check if over canvas
			curGen[x][y] = 1 - curGen[x][y] //flip cell position (either 1-0 = 1 or 1-1 = 0)
		}
	}
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
