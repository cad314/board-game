//Input Controls Panel Singleton
var UIController = {
	displayID: 0,
	width: 800,
	borderWidth: 10,
	padding: 5,
	headerHeight: 50,
	canvasWidth: 800,
	canvasHeight: 400,
	consoleHeight: 100,
	inputHeight: 40,
	targetContainer: undefined,
	header: undefined,
	canvas: undefined,
	ctx: undefined,
	console: undefined,
	input: undefined,
	boardImageSource: "",
	boardImage: undefined,
	viewPort: [0,0,0,0,0,0,0,0],//X, Y, Width, Height, DX, DY, DWidth, DHeight
	
	initalize: function(targetContainerID, boardImgURL, onReady){
	
		with(this){
			//Provide a random number class ID for uniquely identifying display components
			displayID = Math.floor((Math.random() * 1000000) + 1);
			
			//Create HTML display components with unique class names
			var displayHTML = "<h1 class='panel" + displayID + "' id='header" + displayID + "'></h1>";
			displayHTML += "<canvas class='panel" + displayID + "' id='gameCanvas" + displayID + "'></canvas>";
			displayHTML += "<div class='fluid" + displayID + "'><p class='panel" + displayID + "' id='console";
			displayHTML += displayID + "'></p><form class='panel" + displayID + "' id='input" + displayID;
			displayHTML += "'></form></div>";
			
			//Get target container and set its HTML
			targetContainer = $("#" + targetContainerID);
			targetContainer.html(displayHTML);
			
			//Save display elements
			header = $("#header" + displayID);
			canvas = document.getElementById("gameCanvas" + displayID);
			ctx = canvas.getContext("2d");
			console = $("#console" + displayID);
			input = $("#input" + displayID);
		
			//Set display elements on screen
			//width,borderWidth,headerHeight,canvasHeight,consoleHeight,inputHeight
			resizePanels();
			setPadding(padding,padding);
		
			setBackgroundColors("black","black","black","black");
			setTextColors("white","white","white");
			initializeBoard(boardImgURL,onReady);
		}
	},
	
	setPadding: function(console,input){
		this.console.css({"padding":console,"height": this.consoleHeight - (2*console)});
		this.input.css({"padding":input,"height": this.inputHeight - (2*input)});
	},
	
	setBackgroundColors: function(headerBGC,canvasBGC,consoleBGC,inputBGC){
		this.header.css("background-color",headerBGC);
		this.canvas.style.backgroundColor = canvasBGC;
		this.console.css("background-color",consoleBGC);
		this.input.css("background-color",inputBGC);
	},
	
	setTextColors: function(header,console,input){
		this.header.css("color",header);
		this.console.css("color",console);
		this.input.css("color",input);
	},
	//width,borderWidth,headerHeight,canvasHeight,consoleHeight,inputHeight
	resizePanels: function(){
		
		//set display location based on orientation
		var w = window.innerWidth;
		var h = window.innerHeight;
		
		//Update variables
		this.width = w - 40;
		this.borderWidth = 10;
		this.headerHeight = 50;
		this.consoleHeight = 120;
		this.inputHeight = 40;
		
		//Set new width and heights
		$(".panel" + this.displayID).css({"color":"#fff","margin":0,"padding":0,"marginBottom":this.borderWidth});
		this.targetContainer.css({"width":this.width,"padding":this.borderWidth});
		
		if(w >= h){
			$(".fluid" + this.displayID).css("float","right");
			this.canvasHeight = h - this.headerHeight - 40; 
			this.canvasWidth = this.canvasHeight;
			
			var minWidth = 180;
			if(w - (this.canvasWidth + 40) < minWidth){
				this.canvasHeight -= minWidth;
				this.canvasWidth = this.canvasHeight;
			}
			
			this.console.css("width",this.width - this.canvasWidth - 20);
			this.consoleHeight = this.canvasHeight - this.inputHeight - 10;
			this.canvas.style.marginBottom = 0;
			
		}
		else{
			this.width = w - 40;
			this.canvasWidth = this.width;// - (this.consoleHeight + this.inputHeight + this.headerHeight + 60);
			this.canvasHeight = this.canvasWidth;
			
			if(h - (this.consoleHeight + this.inputHeight + this.headerHeight + 60) < this.canvasHeight){
				this.canvasWidth = h - (this.consoleHeight + this.inputHeight + this.headerHeight + 60);
				this.canvasHeight = this.canvasWidth;
			}
			else{
				this.consoleHeight = h - this.headerHeight - this.canvasHeight - this.inputHeight - 60;
			}
		}
		
		this.header.css({"height": this.headerHeight,"line-height": this.headerHeight + "px","text-align": "center"});
		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;
		this.canvas.style.width = this.canvasWidth;
		this.canvas.style.height = this.canvasHeight;
		this.console.css("height",this.consoleHeight);
		this.input.css({"text-align":"center","height":this.inputHeight,"marginBottom":0});
		
		if(this.boardImage){
			this.resetViewport();
		}
	},
	
	
	setHeaderText: function(txt){
		this.header.html(txt);
	},
	
	setCanvasText: function(txt,font,align,color,x,y){
		this.ctx.font = font;
		this.ctx.fillStyle = color;
		this.ctx.textAlign = align;
		this.ctx.fillText(txt,x,y);
	},
	
	initializeBoard: function(boardImgSrc,onLoad){
		
		var UIController = this;
		var imgObj = new Image();
		
		this.boardImageSource = boardImgSrc;
		imgObj.src = boardImgSrc;
		
		//Once image is loaded, draw on canvas
		imgObj.onload = function(){
			UIController.boardImage = imgObj;
			UIController.resetViewport();
			onLoad();
		};
	},
	
	redrawBoard: function(){
		var view = this.viewPort;
		this.ctx.clearRect(0, 0, this.width, this.canvasHeight);
		this.ctx.drawImage(this.boardImage, view[0], view[1], view[2], view[3], view[4], view[5], view[6], view[7]);
	},
	
	setViewport: function(x,y,width,height,dx,dy,dwidth,dheight){
		
		this.viewPort[0] = x;
		this.viewPort[1] = y;
		this.viewPort[2] = width;
		this.viewPort[3] = height;
		this.viewPort[4] = dx;
		this.viewPort[5] = dy;
		this.viewPort[6] = dwidth;
		this.viewPort[7] = dheight;
		
		this.redrawBoard();
	},
	
	resetViewport: function(){
		
		if(this.boardImage){
				
			var w = this.boardImage.width;
			var h = this.boardImage.height;
			
			if(window.innerWidth < window.innerHeight){
				ratio = this.canvasWidth/w;
			}
			else{
				ratio = this.canvasHeight/h;
			}
			
			this.viewPort = [0,0,w,h,0,0,this.canvasWidth,this.canvasHeight];
			
			this.redrawBoard();
		}
	},
	
	//Converts board image coordinates to canvas coordinates
	imgToCanvasCoord: function(coords){
		var ratio = this.canvasWidth / this.boardImage.width;
		return [coords[0]*ratio,coords[1]*ratio];
	},
	
	//x,y coordinates are canvas based
	drawPoint: function(x, y, color, radius){
		
		var ctx = this.ctx;
		if(x >= 0 && x <= this.width && y >= 0 && y <= this.canvasHeight){
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.stroke();
		}
	},
	
	setConsoleHTML: function(html){
		this.console.html(html);
	},
	
	setInputHTML: function(html){
		this.input.html(html);
	},
	
	addControl: function(name,type,ctrlText,action){
		var newHTML = this.input.html() + "\n<input type='" + type + "' id='" + this.displayID + name  + "' value='" + ctrlText + "' onClick='" + action + "' />";
		this.input.html(newHTML);
	},
	
	setCtrlAttribute: function(name,attribute,value){
		var ctrlID = "#"+ this.displayID + name;
		$(ctrlID).attr(attribute,value);
	},
	
	getCtrlValue: function(name){
		var ctrlID = "#"+ this.displayID + name;
		return $(ctrlID).val();
	},
	
	setCtrlValue: function(name, value){
		var ctrlID = "#"+ this.displayID + name;
		$(ctrlID).val(value);
	},
	
	removeCtrl: function(name){
		var ctrlID = "#"+ this.displayID + name;
		$(ctrlID).remove();
	},
	
	clearControls: function(){
		this.setInputHTML("");
	},
	
	clearCanvas: function(){
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	},
	
	addYesNo: function(name,actionYes,actionNo){
		this.addControl(name+"yes","button","Yes",actionYes);
		this.addControl(name+"no","button","No",actionNo);
	},
	
	removeYesNo: function(name){
		this.removeCtrl(name+"yes");
		this.removeCtrl(name+"no");
	}
};

var GameController = {
	
	boardCoordsImg: [[311,244],[516,243],[726,221],[925,183],[1134,173],[1352,212],[1539,226],[1720,228],[1971,182],[2186,188],[2417,204],[2585,366],[2503,552],[2307,633],[2094,636],[1864,573],[1624,567],[1403,594],[1183,593],[966,571],[734,543],[493,562],[310,682],[289,900],[456,1018],[665,1042],[876,1017],[1061,973],[1266,924],[1483,889],[1691,904],[1901,953],[2128,1017],[2334,982],[2523,1069],[2531,1313],[2364,1421],[2132,1415],[1899,1343],[1681,1300],[1463,1324],[1255,1352],[1038,1352],[820,1329],[588,1336],[391,1456],[349,1672],[501,1802],[716,1816],[926,1770],[1140,1712],[1361,1679],[1593,1672],[1823,1703],[2070,1774],[2295,1773],[2504,1805],[2660,1972],[2503,2157],[2257,2156],[2026,2129],[1804,2130],[1590,2166],[1365,2185],[1135,2177],[892,2128],[662,2126],[427,2176],[274,2325],[318,2519],[512,2626],[736,2620],[940,2575],[1151,2508],[1371,2457],[1607,2431],[1828,2464],[2041,2500],[2249,2529],[2494,2550]],
	boardCoordsCanvas: [],
	UI: UIController,
	playerCount: 0,
	playerColors: ["blue","red","yellow","green","orange","purple","cyan"],
	playerRadius: 5,
	currentPlayer: 1,
	skipList: [],
	playerPosition: [],
	gameTrack: [],
	boardActions: {
		monkey: [5, 11, 16, 20, 29, 36, 43, 54, 62, 72],
		giraffe: [21],
		hyena: [44, 64],
		cheetah: [41],
		elephant: [7, 28, 48, 75],
		trap: [13, 68],
		lion: [32],
		brokenbridge: [55],
		buryexplorer: [57],
		finish: [80]
	},
		
	initalizeGame: function(playerCount){
		this.boardCoordsCanvas = [];
		this.currentPlayer = 1;
		this.skipList = [];
		this.playerPosition = [];
		this.gameTrack = [];
		
		//Initialize game track and canvas coords arrays
		for(var coord of this.boardCoordsImg){
			this.boardCoordsCanvas.push(this.UI.imgToCanvasCoord(coord));
			this.gameTrack.push(0);
		}
		
		this.setPlayers(playerCount);
	},
	
	setPlayers: function(numPlayers){
		this.playerCount = numPlayers;
		
		for(var i = 0; i < numPlayers; i++){
			this.playerPosition.push(0);
			this.gameTrack[0] += (1 << (i));
		}
	},
	
	setRadius: function(radius){
		this.playerRadius = radius;
	},
	
	skipPlayer: function(player){
		this.skipList.push(player);
	},
	
	getNextPlayer: function(player){
		var next = player+1;
		
		if(next > this.playerCount){
			next = 1;
		}
		
		var skip = this.skipList.indexOf(next);
		
		if(skip >= 0){
			var skipped = this.skipList[skip];
			this.skipList.splice(skip,1);
			return this.getNextPlayer(skipped);
		}
		
		return next;
	},
	
	getPosition: function(player){
		return this.playerPosition[player - 1];
	},
	
	getColorArray: function(trackVal){
		var colArr = [];
		for(var i = 0; i < this.playerCount; i++){
			if((trackVal >> i) & 1){
				
				if(i == this.currentPlayer-1){
					colArr.push("white");
				}
				else{
					colArr.push(this.playerColors[i]);
				}
			}
		}
		return colArr;
	},
	
	movePlayerForward: function(player, numSpaces){
		return this.movePlayerToPosition(player,this.getPosition(player) + numSpaces);
	},
	
	movePlayerBack: function(player, numSpaces){
		return this.movePlayerToPosition(player,this.getPosition(player) - numSpaces);
	},
	
	movePlayerToPosition: function(player, position){
		var curPos = this.playerPosition[player-1];
		
		this.playerPosition[player-1] = position;
		this.gameTrack[curPos] -= (1 << (player - 1));
		this.gameTrack[position] += (1 << (player - 1));
		
		return this.getAction(position);
	},
	
	getAction: function(position){
		
		if(position >= this.boardActions["finish"][0]){
			return "finish";
		}
		
		for(var action in this.boardActions){
			var spaces = this.boardActions[action];
			for(var space of spaces){
				if(space == position + 1){
					return action;
				}
			}
		}
		return "empty";
	},
	
	//Coordinates are canvas based
	drawPoints: function(coord, colorArray, radius){
		
		var count = colorArray.length;
		var dist = radius*2;
		var x = coord[0];
		var y = coord[1];
		
		//Draw points based on count
		if(count == 1){
			UI.drawPoint(x, y, colorArray[0], radius);
		}
		else if(count == 2){
			UI.drawPoint(x, y - dist, colorArray[0], radius);
			UI.drawPoint(x, y + dist, colorArray[1], radius);
		}
		else if(count == 3){
			UI.drawPoint(x - dist, y - dist, colorArray[0], radius);
			UI.drawPoint(x - dist, y + dist, colorArray[1], radius);
			UI.drawPoint(x + dist, y, colorArray[2], radius);
		}
		else if(count == 4){
			UI.drawPoint(x - dist, y - dist, colorArray[0], radius);
			UI.drawPoint(x - dist, y + dist, colorArray[1], radius);
			UI.drawPoint(x + dist, y - dist, colorArray[2], radius);
			UI.drawPoint(x + dist, y + dist, colorArray[3], radius);
		}
		else if(count == 5){
			UI.drawPoint(x - dist, y - dist, colorArray[0], radius);
			UI.drawPoint(x - dist, y + dist, colorArray[1], radius);
			UI.drawPoint(x + dist, y - dist, colorArray[2], radius);
			UI.drawPoint(x + dist, y + dist, colorArray[3], radius);
			UI.drawPoint(x, y, colorArray[4], radius);
		}
		else if(count == 6){
			UI.drawPoint(x - dist*.75, y - dist*1.25, colorArray[0], radius);
			UI.drawPoint(x - dist*.75, y + dist*1.25, colorArray[1], radius);
			UI.drawPoint(x + dist*.75, y - dist*1.25, colorArray[2], radius);
			UI.drawPoint(x + dist*.75, y + dist*1.25, colorArray[3], radius);
			UI.drawPoint(x + dist*1.5, y, colorArray[4], radius);
			UI.drawPoint(x - dist*1.5, y, colorArray[5], radius);
		}
		else if(count == 7){
			UI.drawPoint(x - dist*.75, y - dist*1.25, colorArray[0], radius);
			UI.drawPoint(x - dist*.75, y + dist*1.25, colorArray[1], radius);
			UI.drawPoint(x + dist*.75, y - dist*1.25, colorArray[2], radius);
			UI.drawPoint(x + dist*.75, y + dist*1.25, colorArray[3], radius);
			UI.drawPoint(x + dist*1.5, y, colorArray[4], radius);
			UI.drawPoint(x - dist*1.5, y, colorArray[5], radius);
			UI.drawPoint(x, y, colorArray[6], radius);
		}
	},
	
	drawPlayersAtPosition: function(position, radius){
		var players = this.gameTrack[position];
		
		if(players > 0){
			this.drawPoints(this.boardCoordsCanvas[position],this.getColorArray(players),radius);
		}
		
	},
	
	drawPlayersOnBoard: function(){
		this.UI.redrawBoard();
		//this.UI.resizePanels();
		for(val of this.playerPosition){
			this.drawPlayersAtPosition(val,this.playerRadius);
		}
	},
	
	//Draws a point on each in game board space
	drawAllBoardPoints: function(color, radius){
		
		for(coord of GC.boardCoordsCanvas){
			UI.drawPoint(coord[0],coord[1],color,radius);
		}
	}
};

//Global variables
var UI = UIController;
var GC = GameController;
var playerNames = [];

var main = function(){

	playerNames = [];

	//Initialize the User Interface
	UI.initalize("container","jungle_board_edit.jpg",function(){
		with(UI){
			
			setHeaderText("Super Amazing Board Game!");
			setConsoleHTML("Please enter the number of players below. Then press 'Start'!");

			addControl("numPlayers","number","2","");
			setCtrlAttribute("numPlayers","min","2");
			setCtrlAttribute("numPlayers","max","7");
			addControl("btnStart","button","Start","acceptStart()");
		}
	});
};

//Confirms player count before starting game
function acceptStart() {
	
	GC.playerCount = UI.getCtrlValue("numPlayers");
	UI.setConsoleHTML("Are you sure you want " + GC.playerCount + " players?");
	UI.clearControls();
	UI.addYesNo("accept","setPlayerInfo(0)","main()");
}

function setPlayerInfo(player){
	if(player >= GC.playerCount){
		startGame(GC.playerCount);
	}
	else{
		getName(player);
	}
}

function getName(player){
	with(UI){
		clearControls();
		setConsoleHTML("Player " + (player + 1) + ", please enter your name and click 'Done'");
		addControl("name","text","","");
		setCtrlAttribute("name","maxlength","50");
		addControl("btnDone","button","Done","setName(" + player + ")");
	}
}

function setName(player){
	var name = UI.getCtrlValue("name");
	
	if(name.length == 0){
		UI.setConsoleHTML("You didn't enter a name. Please enter a player name.");
	}
	else{
		playerNames.push(name);
		getColor(player);
	}
}

function getColor(player){
	with(UI){
		clearControls();
		setConsoleHTML("Thanks " + playerNames[player] + "! Now please choose your player color. :)");
		addControl("color","color",GC.playerColors[player],"");
		addControl("btnDone","button","Done","setColor(" + player + ")");
	}
}

function setColor(player){
	var color = UI.getCtrlValue("color");
	GC.playerColors[player] = color;
	
	setPlayerInfo(player+1);
}

//Shows player count and makes game ready to begin
function startGame(playerCount) {
	
	GC.initalizeGame(playerCount);
	
	UI.setConsoleHTML("The game is ready to begin! There will be a total of " + GC.playerCount + " players.<br />Click to begin!");
	UI.clearControls();
	UI.addControl("begin","button","Begin","takeTurn()");
	
	GC.drawPlayersOnBoard();
}

//Current player takes turn
function takeTurn(){
	
	GC.drawPlayersOnBoard();
	UI.setConsoleHTML("It is now " + playerNames[GC.currentPlayer - 1] + "'s turn. Roll the dice!");
	UI.clearControls();
	UI.addControl("rollDice","button","Roll","takeOption(0)");
}

function takeOption(num){
	var moves = randomMoves();
	var steps = moves[num];
	
	var space = GC.movePlayerForward(GC.currentPlayer,steps);
	
	if(space == "finish"){
		GC.drawPlayersOnBoard();
		playerWins(GC.currentPlayer,steps);
	}
	else{
		var consoleTxt = playerNames[GC.currentPlayer-1] + " you rolled a " + steps;
		consoleTxt += " and are at position " + (GC.playerPosition[GC.currentPlayer-1] + 1) + ".<br />";
		
		GC.drawPlayersOnBoard();
		UI.clearControls();
		
		if(space == "monkey"){
			
			consoleTxt += "You landed on the monkey! You get to go again!";
			UI.addControl("again","button","Go Again","takeTurn()");
		}
		else if(space == "giraffe"){
			
			consoleTxt += "You landed on the giraffe! You got to go down its neck! Click 'Next' for next player.";
			GC.movePlayerToPosition(GC.currentPlayer,25);
			UI.addControl("next","button","Next Player","takeTurn()");
			GC.currentPlayer = GC.getNextPlayer(GC.currentPlayer);
			GC.drawPlayersOnBoard();
		}
		else if(space == "hyena"){
			
			consoleTxt += "You landed on a hyena! You got to go forward 3 spaces! Click 'Next' for next player.";
			GC.movePlayerForward(GC.currentPlayer,3);
			UI.addControl("next","button","Next Player","takeTurn()");
			GC.currentPlayer = GC.getNextPlayer(GC.currentPlayer);
		}
		else if(space == "cheetah"){
			
			consoleTxt += "You landed on a super fast cheetah! You got to go forward 6 spaces! Click 'Next' for next player.";
			GC.movePlayerForward(GC.currentPlayer,6);
			UI.addControl("next","button","Next Player","takeTurn()");
			GC.currentPlayer = GC.getNextPlayer(GC.currentPlayer);
		}
		else if(space == "elephant"){
			
			consoleTxt += "You landed on an elephant! You lose the next turn :(. Click 'Next' for next player.";
			GC.skipPlayer(GC.currentPlayer);
			UI.addControl("next","button","Next Player","takeTurn()");
			GC.currentPlayer = GC.getNextPlayer(GC.currentPlayer);
		}
		else if(space == "trap"){
			
			consoleTxt += "How terrible! You landed on an elephant trap! You have to start over! :C<br />Click 'Next' for next player.";
			GC.movePlayerToPosition(GC.currentPlayer,0);
			UI.addControl("next","button","Next Player","takeTurn()");
			GC.currentPlayer = GC.getNextPlayer(GC.currentPlayer);
		}
		else if(space == "lion"){
			
			consoleTxt += "Oh no! You landed on a lion! You went back 6 spaces! Click 'Next' for next player.";
			GC.movePlayerBack(GC.currentPlayer,6);
			UI.addControl("next","button","Next Player","takeTurn()");
			GC.currentPlayer = GC.getNextPlayer(GC.currentPlayer);
		}
		else if(space == "brokenbridge"){
			
			consoleTxt += "Oh no! You landed on the broken bridge! You drifted down stream to lowest bridge! ";
			consoleTxt += ":C<br />Click 'Next' for next player.";
			GC.movePlayerToPosition(GC.currentPlayer,9);
			UI.addControl("next","button","Next Player","takeTurn()");
			GC.currentPlayer = GC.getNextPlayer(GC.currentPlayer);
		}
		else if(space == "buryexplorer"){
			
			consoleTxt += "You had to stop and bury a poor explorer. You lose the next 2 turns :(.";
			consoleTxt += "<br />Click 'Next' for next player.";
			GC.skipPlayer(GC.currentPlayer);
			GC.skipPlayer(GC.currentPlayer);
			UI.addControl("next","button","Next Player","takeTurn()");
			GC.currentPlayer = GC.getNextPlayer(GC.currentPlayer);
		}
		else
		{
			
			consoleTxt += "The space is empty. Click 'Next' for next player."
			UI.clearControls();
			UI.addControl("next","button","Next Player","takeTurn()");
			GC.currentPlayer = GC.getNextPlayer(GC.currentPlayer);
		}
		
		UI.setConsoleHTML(consoleTxt);
	}
}

function playerWins(player,roll){
	
	UI.clearControls();
	
	GC.playerPosition[GC.currentPlayer-1] = GC.boardActions["finish"][0]-1;
	
	var consoleTxt = playerNames[GC.currentPlayer-1] + " rolled a " + roll + " and won!! Yay!! Woohoo!! ;)<br />";
	consoleTxt += "Final player positions:<br >";
	for(var i = 0;i < GC.playerCount; i++){
		consoleTxt += playerNames[i] + "'s position: " + (GC.playerPosition[i] + 1) + "<br />";
	}
	consoleTxt += "Do you wish to play again?";
	
	UI.setConsoleHTML(consoleTxt);
	UI.addYesNo("playAgain","main()","ok()");
}

function ok(){
	UI.clearControls();
	var consoleTxt = "You suck! Don't you know how hard I worked on this game? Do you you think it's not worth your time?<br />";
	consoleTxt += "Haha I'm just kidding. Honestly since you don't want to play again I'm not sure what else to do.<br />";
	consoleTxt += "I guess if you change your mind, just click 'Play Again' below. I'll be ready when you are :)";
	UI.setConsoleHTML(consoleTxt);
	UI.addControl("play","button","Play Again","main()");
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function randomMoves(){
	var moves = [];
	
	moves.push(getRndInteger(1,6));
	
	var num = getRndInteger(1,6);
	while(num == moves[0]){
		num = getRndInteger(1,6);
	}
	
	moves.push(num);
	
	num = getRndInteger(1,6);
	while(num == moves[0] || num == moves[1]){
		num = getRndInteger(1,6);
	}
	
	moves.push(num);
	return moves;
}

main();