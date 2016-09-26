//initializes vars
var canvas, ctx, gamePaused, width, height, gameMode, genCount, mouseOverCanvas, mouseDown, fillAmount;

//initializes variables
function load(){
		canvas = document.getElementById("canvasA");
		ctx = canvas.getContext("2d");
		canvas.width = Math.floor(.90*window.innerHeight);
		canvas.height = Math.floor(.90*window.innerHeight);
		gamePaused=false;
		curGen = 0;
}

//every time this is called it re-initializes grid, creating empty arrays. outer array(gen[i]) is columns, inner(gen[i][j]) is rows;
function initializeGrid() {
	curGen = [[]];
	nextGen = [[]];
	for (var i = 0; i < width; i++) {
		curGen[i] = [];
		nextGen[i] = [];
	}
}

//fills grid based on fill amount. Higher amount = more fill.
function fillRandom(){
	//converts to a decimal
	var amount = (100-fillAmount)/100;
	for(var i = 0 ; i < curGen.length; i++){
		for(var j = 0 ; j < height; j++){
			(Math.random() > amount) ? curGen[i][j] = 1 : curGen[i][j] = 0;
		}
	}
}


function golStep(){ 
	for(var i=1; i <curGen.length-1; i++){ //This loops doesn't calculate outside edges, wrapping is done seperately
		for (var j = 1; j < curGen[i].length-1; j++) { 	
			var numNeighbors = 0;
			//get curent cell
			var curCell = curGen[i][j];
			//neighbor checking
			numNeighbors += curGen[i-1][j-1]; //upper row
			numNeighbors += curGen[i-1][j]; 
			numNeighbors += curGen[i-1][j+1];
			numNeighbors += curGen[i][j-1]; // center row
			numNeighbors += curGen[i][j+1];
			numNeighbors += curGen[i+1][j-1]; //lower row
			numNeighbors += curGen[i+1][j];
			numNeighbors += curGen[i+1][j+1];
			//references method based on gameMode
			nextGen[i][j] = checksLive(numNeighbors, curCell);		
		}
	}

		//swaps current to nextGen
		curGen = nextGen;
}

function checksLive(numNeighbors, curCell){
	if(gameMode=="Original"){
		if(curCell &&(numNeighbors==2 || numNeighbors ==3)){
			return 1;
		}
		if(!curCell && numNeighbors ==3){
			return 1;
		}
	}
	if(gameMode == "Maze"){
		if(curCell &&(numNeighbors >= 1 && numNeighbors <= 5)){
			return 1;
		}
		if(!curCell && numNeighbors ==3){
			return 1;
		} 
	}
	return 0;
}