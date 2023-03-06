let pattern = [];
let scorePlayer = 0;
let scoreAI = 0;
let playerChoice = 0;
let aiChoice = 0;
let gameCount = 0;
let winningMessage = '';

const gameArea = document.createElement('div');
gameArea.id = 'game-area';
	const headerOne = document.createElement('h1');
	headerOne.innerText = 'Javascript AI Rock Paper Scissors';
	gameArea.append(headerOne);

	const scoreBoard = document.createElement('div');
	scoreBoard.id = 'score-board';
		const scoreBoardPlayerP = document.createElement('p');
		scoreBoardPlayerP.innerText = 'Player';
		scoreBoard.append(scoreBoardPlayerP);

		const playerScore = document.createElement('span');
		playerScore.id = 'player-score';
		playerScore.className = 'score';
		playerScore.innerText = 0;
		scoreBoardPlayerP.append(playerScore);

		const scoreBoardAiP = document.createElement('p');
		scoreBoardAiP.innerText = 'Computer';
		scoreBoard.append(scoreBoardAiP);

		const aiScore = document.createElement('span');
		aiScore.id = 'ai-score';
		aiScore.className = 'score';
		aiScore.innerText = 0;
		scoreBoardAiP.append(aiScore);
	gameArea.append(scoreBoard);

	const playerBtnArea = document.createElement('div');
	playerBtnArea.id = 'player-btn-area';
	playerBtnArea.className = 'btn-area';
		const playerBtnAreaHeader = document.createElement('span');
		playerBtnAreaHeader.className = 'btn-header';
		playerBtnAreaHeader.innerText = 'Player';
		playerBtnArea.append(playerBtnAreaHeader);

		const rockButton = document.createElement('button');
		rockButton.id = 'rock-button';
		rockButton.className = 'btn';
		rockButton.setAttribute('data-id', 1);
			const rockButtonSpan = document.createElement('span');
			rockButtonSpan.className = 'icon-hand-grab-o';
			rockButton.append(rockButtonSpan);
		playerBtnArea.append(rockButton);

		const paperButton = document.createElement('button');
		paperButton.id = 'paper-button';
		paperButton.className = 'btn';
		paperButton.setAttribute('data-id', 2);
			const paperButtonSpan = document.createElement('span');
			paperButtonSpan.className = 'icon-hand-paper-o';
			paperButton.append(paperButtonSpan);
		playerBtnArea.append(paperButton);

		const scissorsButton = document.createElement('button');
		scissorsButton.id = 'scissors-button';
		scissorsButton.className = 'btn';
		scissorsButton.setAttribute('data-id', 3);
			const scissorsButtonSpan = document.createElement('span');
			scissorsButtonSpan.className = 'icon-hand-scissors-o';
			scissorsButton.append(scissorsButtonSpan);
		playerBtnArea.append(scissorsButton);
	gameArea.append(playerBtnArea);

	const aiBtnArea = document.createElement('div');
	aiBtnArea.id = 'ai-btn-area';
	aiBtnArea.className = 'btn-area';
		const aiBtnAreaHeader = document.createElement('span');
		aiBtnAreaHeader.className = 'btn-header';
		aiBtnAreaHeader.innerText = 'Computer';
		aiBtnArea.append(aiBtnAreaHeader);

		const airockButton = document.createElement('button');
		airockButton.id = 'ai-rock-button';
		airockButton.className = 'btn';
			const airockButtonSpan = document.createElement('span');
			airockButtonSpan.className = 'icon-hand-grab-o';
			airockButton.append(airockButtonSpan);
		aiBtnArea.append(airockButton);

		const aipaperButton = document.createElement('button');
		aipaperButton.id = 'ai-paper-button';
		aipaperButton.className = 'btn';
		aipaperButton.setAttribute('data-id', 2);
			const aipaperButtonSpan = document.createElement('span');
			aipaperButtonSpan.className = 'icon-hand-paper-o';
			aipaperButton.append(aipaperButtonSpan);
		aiBtnArea.append(aipaperButton);

		const aiscissorsButton = document.createElement('button');
		aiscissorsButton.id = 'ai-scissors-button';
		aiscissorsButton.className = 'btn';
		aiscissorsButton.setAttribute('data-id', 3);
			const aiscissorsButtonSpan = document.createElement('span');
			aiscissorsButtonSpan.className = 'icon-hand-scissors-o';
			aiscissorsButton.append(aiscissorsButtonSpan);
		aiBtnArea.append(aiscissorsButton);
	gameArea.append(aiBtnArea);

	const notification = document.createElement('div');
	notification.id = 'notification';
	gameArea.append(notification);
document.body.append(gameArea);

setBtnEvents();

function setBtnEvents(){
	rockButton.addEventListener('click', playerInput);
	paperButton.addEventListener('click', playerInput);
	scissorsButton.addEventListener('click', playerInput);
}

function removeBtnEvents(){
	rockButton.removeEventListener('click', playerInput);
	paperButton.removeEventListener('click', playerInput);
	scissorsButton.removeEventListener('click', playerInput);
}

function playerInput(){
	removeBtnEvents();
	let choice = this.getAttribute('data-id');
	this.className = 'btn-active';
	playerChoice = parseInt(choice);
	gameCount++;
	setTimeout(aiPrediction, 2000);
	setTimeout(checkWin, 3000);
}

function prepareData(){
	if (pattern.length < 1) {
		for(let i = 0; i < 10; i++){
			pattern.push(Math.floor(Math.random() * 3) + 1);
		}
	}
}

function updatePattern(){
	if (gameCount !== 0){
		pattern.shift();
		pattern.push(playerChoice);
	}
}

function aiPrediction(){
	prepareData();
	const net = new brain.recurrent.LSTMTimeStep();
	net.train([pattern], { iterations: 100, log: false });
	const predicted = net.run(pattern);
	const roundedPredicted = Math.round(predicted);
	aiChoice = (1 <= roundedPredicted && roundedPredicted <= 3)? (roundedPredicted % 3) + 1 : 1;
	document.getElementById('ai-'+stringOf(aiChoice)+'-button').className = 'btn-active';
	updatePattern();
}

function checkWin(){
	if(playerChoice === aiChoice){
		winningMessage = 'draw';
	}
	else if(
		(playerChoice === 1 && aiChoice === 3) ||
		(playerChoice === 3 && aiChoice === 2) ||
		(playerChoice === 2 && aiChoice === 1)
	){
		winningMessage = 'You win';
		scorePlayer++;
		playerBtnArea.getElementsByClassName('btn-active')[0].className = 'btn-win';
		aiBtnArea.getElementsByClassName('btn-active')[0].className = 'btn-lose';
	}
	else{
		winningMessage = 'Computer wins';
		scoreAI++;
		aiBtnArea.getElementsByClassName('btn-active')[0].className = 'btn-win';
		playerBtnArea.getElementsByClassName('btn-active')[0].className = 'btn-lose';
	}

	notification.innerText = winningMessage;
	playerScore.innerText = scorePlayer;
	aiScore.innerText = scoreAI;

	setTimeout(function(){
		notification.innerText = '';
		if(winningMessage != 'draw'){
			document.getElementsByClassName('btn-win')[0].className = 'btn';
			document.getElementsByClassName('btn-lose')[0].className = 'btn';
		}else{
			document.getElementsByClassName('btn-active')[0].className = 'btn';
			document.getElementsByClassName('btn-active')[0].className = 'btn';
		}
		setBtnEvents();
	}, 1000);
}

function stringOf(integer){
	return (integer == 1)? 'rock' : ((integer == 2)? 'paper' : ((integer == 3)? 'scissors' : ''));
}