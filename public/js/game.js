$.ajaxSetup({
	        headers: {'X-CSRF-Token': $('meta[name="_token"]').attr('content')}
	    });

	$(document).ready(function(){

		//================ Determine GameBoard Dimensions ===============
			
			//get gameBoard width on page load, which will be 100% of its column width
			var boardWidth = $("#gameBoard").innerWidth();
			//set gameBoard height to same as width, then retrieve it
			var boardHeight = $("#gameBoard").innerHeight(boardWidth);
				boardHeight = $("#gameBoard").innerHeight();
			//set placeholder images' dimensions
			$("#chooseLevel").height(boardHeight);
			$("#chooseLevel").width(boardWidth);
			$("#chooseLevel").removeClass('hidden');
			$("#whenReady").height(boardHeight);
			$("#whenReady").width(boardWidth);

			//if browser is resized, reconfigure gameboard dimensions
			$(window).resize(function(){
				//get current gameBoard width and set height to same
			    boardWidth = $("#gameBoard").innerWidth();
			    boardHeight = $("#gameBoard").innerHeight(boardWidth);
			    //set placeholder images' dimensions
				$("#chooseLevel").height(boardHeight[0].clientHeight);
				$("#chooseLevel").width(boardWidth);
				$("#whenReady").height(boardHeight[0].clientHeight);
				$("#whenReady").width(boardWidth);
				$(".blocks").remove();
				//resize individual tiles
				setBlockDimensions();
				//recreate the gameBoard
				buildGameBoard();
				//if the game is in session, reset positioning-coordinates according to 
				//new board dimensions and reidentify the movable blocks
				if ($("#timer").text() != '00:00:00:00') {
					positionBlocks();
					identifyMovableBlocks();
				}
			});

		//====================== Begin Game =========================

			var gameSession;
			var puzzleId;
			var puzzleSize;		//determined by user game-level selection
			var emptyCell;		//the index number of the empty cell in the position array
			var cellX = 0;		//initial x-coordinate of top-left corner of cell, relative to the gameBoard container div
			var cellY = 0;		//initial y-coordinate of top-left corner of cell, relative to the gameBoard container div
			var cells = [];		//array to hold cell coordinates
			var moves = 0;
			var cellDimension;	//determined by size of gameBoard and puzzleSize for mobile-responsiveness
			var cellPadding = 2;
			var totalBlocks;
			var initialBlockPositions = [];	//will be randomly generated
			var newBlockPositions = [];		//will be a clone of initial positions that changes as user clicks blocks
			var answerKey = [];

			//object to POST necessary game data to database when game ends
			var gameStats = {
				"initialBlockPositions": initialBlockPositions
			};


		//====================== If User Came from Profile Page =========================

			//if the user got to game from leaderboard or profile "play" buttons, 
			//see if they chose a specific puzzle or just a size, then render game accordingly
			var sizeChoiceFromProfile = $("#gameBoard").data('size');
			var arrayString = $("#playSameGame").data('positions');
			puzzleId = $("#puzzle_id").data('id');


			//if the user came from leaderboard, load the specific position array
			//of the game they clicked
			if(arrayString) {
	    		puzzleSize = parseInt(sizeChoiceFromProfile);
	    		totalBlocks = puzzleSize * puzzleSize;
	    		positionArray = arrayString.split(',');
	    		//loop through array and make sure all elements are numbers
	    		$.each(positionArray, function(index, value){
	    			positionArray[index] = parseInt(value);
	    		});
	    		initialBlockPositions = positionArray;
	    		gameStats.puzzle_id = parseInt(puzzleId);
	    		readyMode();


			//if the user came from profile, load the size they chose
			} else if(sizeChoiceFromProfile == 3 || sizeChoiceFromProfile == 4 || sizeChoiceFromProfile == 5) {
	    		puzzleSize = parseInt(sizeChoiceFromProfile);
	    		totalBlocks = puzzleSize * puzzleSize;
	    		initialBlockPositions = [];
	    		randomPositionGenerator();
	    		postInitialData();
	    		readyMode();
			}

	    //====================== Buttons =========================

	    	// Level Selection Buttons that reset key variables
	    	$(".level").on('click', function(){
	    		puzzleSize = $(this).data('value');
	    		totalBlocks = puzzleSize * puzzleSize;
	    		initialBlockPositions = [];
	    		randomPositionGenerator();
	    		postInitialData();
	    		readyMode();
	    	});

	    	// Easy Level Button for Demo-day
	    	$("#easy").on('click', function(){
	    		puzzleSize = $(this).data('value');
	    		totalBlocks = puzzleSize * puzzleSize;
	    		initialBlockPositions = [1, 2, 3, 4, 0, 5, 7, 8, 6];
	    		answerKey = [1, 2, 3, 4, 5, 6, 7, 8, 0];
	    		gameStats.puzzle_id = 1;
	    		readyMode();
	    	});


	    	// Start game button
	    	$("#start").on('click', function(){
	    		$(".blocks").remove();
	    		setBlockDimensions();
	    		buildGameBoard();
	    		timer();
	    		startGame();
	    		$(".hiya").removeClass('hidden');
	    		$(".ready, #cancel, #whenReady").addClass('hidden');
	    	});

	    	// Cancel Selection
	    	$("#cancel").on('click', function(){
	    		$(".level, #chooseLevel, #easy").removeClass('hidden');
				$("#start, #cancel, .ready, #whenReady").addClass('hidden');
	    	});

	    	// Reset game button
	    	$("#reset").on('click', function(){
	    		$(".blocks").remove();
	    		clearTimeout(t);
	    		milliseconds = 0; seconds = 0; minutes = 0; hours = 0;
	    		$("#timer").text("00:00:00:00");
	    		timer();
	    		startGame();
	    		$(".again").addClass('hidden');
	    		$(".hiya").removeClass('hidden');
	    	});

	    	// Quit game button
	    	$("#quit").on('click', function(){
	    		$(".hiya").addClass('hidden');
	    		$(".again").removeClass('hidden');
	    		clearTimeout(t);
	    		gameStats.moves = moves;
	    		var won = false;
	    		endGame(won);
	    	});

	    	// New game button
	    	$("#newGame").on('click', function(){
	    		moves = 0;
	    		$("#moves").text(moves);
	    		milliseconds = 0, seconds = 0, minutes = 0, hours = 0;
	    		$("#timer").text("00:00:00:00");
	    		$(".blocks").remove();
	    		$(".btn, .btn-floating, .ready, .again, .hiya").addClass('hidden');
	    		$(".level, #chooseLevel, #easy").removeClass('hidden');
	    	});


	    //====================== Game Logic Functions =========================

	    	function readyMode()
	    	{
	    		$(".level, #chooseLevel, #easy").addClass('hidden');
				$("#start, #cancel, .ready, #whenReady").removeClass('hidden');
	    	}

	    	function setBlockDimensions()
	    	{
	    		//set individual block dimensions
				var blockWidth = (boardWidth - (2 * puzzleSize)) / puzzleSize;
				cellDimension = blockWidth;
	    	}

	    	//generate a random array for puzzle block positions
	    	//if not solvable, keep generating another array until it is
	    	function randomPositionGenerator()
	    	{
	    		//fill the array with an integer for every block
	    		for (i = 0; i < totalBlocks; i++) {
	    			initialBlockPositions[i] = i;	
	    		}

	    		do {
		    		//shuffle the array until its puzzle is solvable
				  	var tmp, current, top = initialBlockPositions.length;
				  	if(top) while(--top) {
					    current = Math.floor(Math.random() * (top + 1));
					    tmp = initialBlockPositions[current];
					    initialBlockPositions[current] = initialBlockPositions[top];
					    initialBlockPositions[top] = tmp;
					}

				//check if randomly generated array is solvable
				} while(!isSolvable());

	    	}

	    	function isSolvable()
	    	{
	    		//check the number of inversions in randomly generated array
				var inversions = totalInversions();
				
				//locate the empty cell
				$.each(initialBlockPositions, function(index, value)
					{
						if(value == 0){
							emptyCell = index;
						}
					});

				//determine the row where the empty cell is located
				for(var n = 0; n < puzzleSize; n++) {
					for(var r = 0; r < puzzleSize; r++) {
						if (n * puzzleSize + r == emptyCell) {
							var rowOfEmptyCell = n + 1;
						}
					}
				}
				
				//odd sized puzzles must have an even # of inversions
				if(puzzleSize % 2 != 0 && inversions % 2 == 0) {
					return true;
				//even sized puzzles must have an even # of inversions
				//if the empty cell is on an even row
				} else if(puzzleSize % 2 == 0 && inversions % 2 == 0 && rowOfEmptyCell % 2 == 0) {
					return true;
				//even sized puzzles must have an odd # of inversions
				//if the empty cell is on an odd row
				} else if(puzzleSize % 2 == 0 && inversions % 2 != 0 && rowOfEmptyCell % 2 != 0) {
					return true;
				} else {
					return false;
				}
	    	}

	    	//count the total # of inversions for the positions array
	    	function totalInversions() 
	    	{
				var inversions = 0;
				//count the number of inversions for each tile, except the last one or 0
				for (var i = 0; i < totalBlocks - 1; i++) {
				  	var tileNum = initialBlockPositions[i];
				  	if(tileNum != 0){
				    	inversions += inversionsForEachTile(tileNum, i);
				    }
				}

				return inversions;
			}

			//is called by totalInversions()
			//counts the number of inversions for each tile
			function inversionsForEachTile(tileNum, i) 
			{
				var inversions = 0;
				var startingIndex = i + 1;
				var lastIndex = totalBlocks - 1;

				for (var t = startingIndex; t <= lastIndex; t++) {
				    if(tileNum > initialBlockPositions[t] && initialBlockPositions[t] != 0){
				    	inversions++;
				    }
				}

				return inversions;
			}

	    	function postInitialData()
	    	{
	    		//object to POST necessary game info to database
	    		var puzzleInfo = {
	    			"size" : puzzleSize,
	    			"type" : puzzleSize+"x"+puzzleSize,
	    			"initialBlockPositions": initialBlockPositions
	    		};
	    		//send puzzleInfo to puzzle table in database
				$.post('/play/puzzle', puzzleInfo, function(response){
					gameStats.puzzle_id = response;
					puzzleId = response;
				});
	    	}


	    	// Create gameboard grid of cells
			function buildGameBoard()
			{
				cells = [];
				cellX = 0;
				cellY = 0;
	    		// Loop for determining cell positions
		    	for(var i = 0; i < totalBlocks; i++) {
		    		//store coordinates of each cell
		    		cells[i] = [cellX, cellY];
		    		//increase the x-coordinate based on the size of each cell
		    		cellX += cellDimension + cellPadding;
		    		//reset the x-coordinate and increase the y-coordinate after the last cell of each row is positioned
		    		if ((i+1) % puzzleSize == 0) {
		    			cellX = 0;
		    			cellY += cellDimension + cellPadding;
		    		}
		    	}
		    }


	    	function startGame()
	    	{
	    		createAnswerKey();
	    		gameReset();
	    		//place blocks in their initial positions
	    		positionBlocks();
	    		//create a clone of the initial positions array to track block movements
	    		newBlockPositions = initialBlockPositions.slice(0);
	    		gameStats.newBlockPositions = newBlockPositions;
	    		identifyMovableBlocks();
	    		$("#start, #newGame").addClass('hidden');
	    		$("#quit, #reset").removeClass('hidden');
	    	}

	    	function createAnswerKey()
	    	{
	    		//reset any previous answer key
	    		answerKey = [];
	    		//fill the array with an integer for every block, starting with 1
	    		for (i = 0; i < totalBlocks - 1; i++) {
		    		answerKey[i] = i + 1;
		    	}
		    	//add a 0 on the back to represent the empty cell in the lower right corner
	    		answerKey.push(0);
	    	}

	    	function gameReset()
	    	{
	    		//create a new game session number and store in gameStats object
	    		$.get('/play/game-session', function(response){
	    			gameSession = response;
	    			gameStats.gameSession = gameSession;
	    			//reset the gameFinished and time indices of the gameStats object
	    			gameStats.gameFinished = false;
	    			gameStats.time = '';
	    		});

	    		//reset moves counter
	    		moves = 0;
	    		$("#moves").text(moves);
	    	}

	    	// Loop through cell-position array and assign its sets of coordinates to each block as they are generated
	    	function positionBlocks()
	    	{
	    		$.each(cells, function(index, coordinates) {
					
					//if game is already in progress, position blocks based on newBlockPositions array	
	    			if($("#timer").text() != '00:00:00:00'){
	    				//concurrently loop through block-positions-array and store their numeric value
						var blockNumber = newBlockPositions[index];	
	    			//if game has not begun, position blocks based on initialBlockPositions array
	    			} else {
						//concurrently loop through block-positions-array and store their numeric value
						var blockNumber = initialBlockPositions[index];
					}

					//a block number of 0 indicates the initial empty cell's position
					if(blockNumber == 0){
					emptyCell = index;
					} else{
						//generate the div for each block using the coordinates from each element of the cell's array,
						//attach their numeric value to them visually and via the data attribute
						$('#gameBoard').append("<div class='blocks' data-blocknum='"+blockNumber+"' style='top:"+coordinates[1]+"px;left:"+coordinates[0]+"px;line-height:"+cellDimension+"px;'><span class='flow-text'>"+blockNumber+"</span></div>");
					}
				});
				$(".blocks").innerWidth(cellDimension);
				$(".blocks").innerHeight(cellDimension);
	    	}


	    	function identifyMovableBlocks()
	    	{
				var c = emptyCell;
				var s = puzzleSize;

				//identify the indices of cells adjacent to the empty cell
				switch (c % s) {
					//if emptyCell is along right-side of gameboard
					case s - 1:
						var movableCells = [c-1, c+s, c-s];
						break;
					//if emptyCell is along left-side of gameboard
					case 0:
						var movableCells = [c+1, c+s, c-s];
						break;
					default:
						var movableCells = [c+1, c-1, c+s, c-s];
						break;
				}

					//attach click-event listener to adjacent blocks
					$.each(movableCells, function(index, cell) {
						//only use cells that are within the totalBlocks range: 1--9, 1--16, etc.
						if(!(cell < 0) && !(cell > totalBlocks)){
							var movableBlock = newBlockPositions[cell];
							addEventListeners(movableBlock);
						}
					});

			}


	    	function addEventListeners(movableBlock)
	    	{
	    		$('.blocks[data-blocknum="'+ movableBlock +'"]').on('click', function(){
	    			//call moves-counter
	    			movesCounter();

	    			//fetch the block number of clicked block via its data attribute
					var blockNumber = parseInt($(this).data("blocknum"));

					//fetch the index number of that block from its position array
					//it will become the next empty cell
					clickedPositionIndex = $.inArray(blockNumber, newBlockPositions);

					//swap values between the clicked block and the old empty cell and update gameStats object
					newBlockPositions[emptyCell] = blockNumber;
					newBlockPositions[clickedPositionIndex] = 0;
					gameStats.newBlockPositions = newBlockPositions;

	    			//animate the block moving to its new xy-coordinates
	    			//3rd parameter calls removeEventListeners() upon completion of animation
	    			$(this).animate({ "top": cells[emptyCell][1], "left": cells[emptyCell][0] }, "fast", removeEventListeners);
	    			// Reset global emptyCell index variable to the index of the clicked block
	    			emptyCell = clickedPositionIndex;
	    		});
	    	}


	    	function removeEventListeners()
	    	{
	    		//after each move, check against answer key to alert when player has won
				if(newBlockPositions.toString() == answerKey.toString()) {
					$('.blocks').off();
					var won = true;
					return endGame(won);
				}
				$('.blocks').off();
	    		identifyMovableBlocks();
	    	}

	    	function movesCounter()
	    	{
	    		moves += 1;
	    		$("#moves").text(moves);
	    		gameStats.moves = moves;
	    		//post to stats table to record each move
	    		$.post('/play/stats', gameStats);
	    	}

	    	function endGame(won)
	    	{
	    		var time = $("#timer").text();
	    		gameStats.gameFinished = won;
	    		gameStats.time = time;
	    		$('.blocks').off();
	    		$("#quit").addClass('hidden');
		    	$("#newGame").removeClass('hidden');
		    	if(won){
		    		clearTimeout(t);
		    		$('#win-modal').openModal({
					    dismissible: true, // Modal can be dismissed by clicking outside of the modal
					    opacity: 0.65, // Opacity of modal background
					    in_duration: 300, // Transition in duration
					    out_duration: 200, // Transition out duration
				    });
		    	}
		    	$.post('/play/stats', gameStats);
	    	}


		//====================== Game Timer =========================

		var milliseconds = 0, seconds = 0, minutes = 0, hours = 0,
		    t;

		function add() 
		{
			milliseconds++;
			if (milliseconds >= 100) {
			    milliseconds = 0;
			    seconds++;
			    if (seconds >= 60) {
			        seconds = 0;
			        minutes++;
			        if (minutes >= 60) {
			            minutes = 0;
			            hours++;
			        }
			    }
			}
		    // var timerDisplay =
		    $("#timer").text((hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00") + ":" + (milliseconds > 9 ? milliseconds : "0" + milliseconds));

		    timer();
		}

		function timer() {
		    t = setTimeout(add, 10);
		}

	});
