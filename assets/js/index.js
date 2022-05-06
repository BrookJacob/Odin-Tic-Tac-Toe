const gameBoard = (() => {

    const board = [];
    var players = [];
    var currentPlayer;

    const init = (sideLength, playerOne, secondPlayer) => {
        if (board.length != 0) {
            board.splice(0, board.length);
        }
        if (players.length != 0) {
            players.splice(0, players.length);
        }

        for (let i = 0; i < sideLength; i++) {
            board.push(Array(sideLength).fill(''));
        }

        players.push(playerOne);
        players.push(secondPlayer);
        currentPlayer = players[0];
        displayController.init(board.length);
    };

    const takeTurn = (event) => {
        let boardArrayX = event.target.dataset.x;
        let boardArrayY = event.target.dataset.y;

        if (board[boardArrayY][boardArrayX] == '') {
            board[boardArrayY][boardArrayX] = currentPlayer.gamePiece;
            displayController.validPlay(currentPlayer, event.target);
            let winStatus = winConditions();
            if (winStatus == 'nothing') {
                if (changePlayer().computer == true) {
                    let computerTurnTile = computerTurn();
                    board[computerTurnTile.dataset.y][computerTurnTile.dataset.x] = currentPlayer.gamePiece;
                    displayController.validPlay(currentPlayer, computerTurnTile);
                    let computerWinStatus = winConditions();
                    if (computerWinStatus == 'nothing') {
                        changePlayer();
                    } else {
                        displayController.winnerDisplay(computerWinStatus);
                    }

                } else {
                    changePlayer();
                }

            } else {
                displayController.winnerDisplay(winStatus);
            }
        } else {
            displayController.invalidPlay(event.target);
        }

    };

    const getCurrentPlayer = (number) => {
        return currentPlayer;
    };

    const changePlayer = () => {
        if (currentPlayer == players[players.length - 1]) {
            currentPlayer = players[0]
        } else {
            currentPlayer = players[players.indexOf(currentPlayer) + 1];
        }
        return currentPlayer;
    };

    const computerTurn = () => {
        let possibleComputerTurns = [];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] == '') {
                    possibleComputerTurns.push([i, j]);
                }
            }
        }
        let randomNumber = Math.floor(Math.random() * possibleComputerTurns.length);
        let randomTile = possibleComputerTurns[randomNumber];

        const gameTile = document.querySelector(`[data-x="${randomTile[1]}"][data-y="${randomTile[0]}"]`);
        return gameTile;
    }

    const winConditions = () => {

        //Check for win along x-axis of board nested array
        for (let i = 0; i < board.length; i++) {
            if (board[i].every(piece => piece == currentPlayer.gamePiece)) {
                return 'win';
            }
        }

        //Check for win along y-axis of board nested array
        for (let i = 0; i < board.length; i++) {
            let yAxisArray = [];
            for (let j = 0; j < board.length; j++) {
                yAxisArray.push(board[j][i]);
            }
            if (yAxisArray.every(piece => piece == currentPlayer.gamePiece)) {
                return 'win';
            }
        }

        //Check for win along the top left to bottom right diagonal
        let topLeftBottomRightDiagonalArray = [];
        for (let i = 0; i < board.length; i++) {
            topLeftBottomRightDiagonalArray.push(board[i][i]);
        }
        if (topLeftBottomRightDiagonalArray.every(piece => piece == currentPlayer.gamePiece)) {
            return 'win';
        }

        //Check for win along the bottom left to top right diagonal
        let bottomLeftTopRightDiagonalArray = [];
        for (let i = 0; i < board.length; i++) {
            bottomLeftTopRightDiagonalArray.push(board[board.length - 1 - i][i]);
        }
        if (bottomLeftTopRightDiagonalArray.every(piece => piece == currentPlayer.gamePiece)) {
            return 'win';
        }


        //Check for tie by comparing every piece against the board array's initial fill of ''
        if (board.flat().every(piece => piece != '')) {
            return 'tie';
        }
        return 'nothing';
    }
    return { init, board, players, takeTurn, getCurrentPlayer };
})();



const Player = (name, gamePiece, computer = false) => {

    return { name, gamePiece, computer };
}

const displayController = (() => {

    const startDisplay = () => {
        const startModal = document.getElementsByClassName('start-modal')[0];
        startModal.style.display = 'flex';
        start.innerText = 'Restart';

        const startButton = document.getElementsByClassName('start-game')[0];
        startButton.addEventListener('click', function() {
            const playerOneNameInput = document.getElementsByClassName('player-name')[0].value;
            const playerTwoNameInput = document.getElementsByClassName('player-name')[1].value;
            const playerOnePieceInput = document.getElementsByClassName('player-piece')[0].value;
            const playerTwoPieceInput = document.getElementsByClassName('player-piece')[1].value;
            const playerTwoComputer = document.getElementsByClassName('computer-check')[0].checked;

            const playerOne = Player(playerOneNameInput, playerOnePieceInput);
            const playerTwo = Player(playerTwoNameInput, playerTwoPieceInput, playerTwoComputer);
            gameBoard.init(3, playerOne, playerTwo);

            startModal.style.display = 'none';

        });

        window.addEventListener('click', function() {
            if (event.target == startModal) {
                startModal.style.display = 'none';
            }
        });

    };

    const init = (boardArrayLength) => {
        const board = document.getElementsByClassName('game-board')[0];

        if (board.hasChildNodes()) {
            while (board.firstChild) {
                board.removeChild(board.lastChild);
            }
        }

        board.style.grid = `repeat(${boardArrayLength}, 1fr) / repeat(${boardArrayLength}, 1fr)`;

        for (let i = 0; i < boardArrayLength; i++) {
            for (let j = 0; j < boardArrayLength; j++) {
                const gameTile = document.createElement('div');
                gameTile.classList.add('game-tile');
                gameTile.dataset.x = j;
                gameTile.dataset.y = i;
                board.appendChild(gameTile);

                gameTile.addEventListener('click', gameBoard.takeTurn);
            }
        }
    };

    const validPlay = (currentPlayer, gameTile) => {
        const gamePiece = document.createElement('p');
        gamePiece.innerText = currentPlayer.gamePiece;
        gameTile.appendChild(gamePiece);
    };

    const invalidPlay = (gameTile) => {

        gameTile.classList.add('invalid-play');

        window.setTimeout(function() {
            gameTile.classList.remove('invalid-play');
        }, 300);
    };

    const winnerDisplay = (winStatus) => {
        const winnerModal = document.getElementsByClassName('winner-modal')[0];
        winnerModal.style.display = 'flex';

        const winMessage = document.getElementsByClassName('win-message')[0];

        if (winStatus == 'win') {
            winMessage.innerText = `${gameBoard.getCurrentPlayer().name} has won the game!`
        } else {
            winMessage.innerText = "It's a Tie!";
        }

        const gameTiles = Array.from(document.getElementsByClassName('game-tile'));
        gameTiles.forEach(gameTile => gameTile.removeEventListener('click', gameBoard.takeTurn));

        const closeButton = document.getElementsByClassName('close')[0];
        closeButton.addEventListener('click', function() {
            winnerModal.style.display = 'none';
        })

        window.addEventListener('click', function() {
            if (event.target == winnerModal) {
                winnerModal.style.display = 'none';
            }
        }, { once: true });

    };
    return { startDisplay, init, validPlay, invalidPlay, winnerDisplay };
})();


const start = document.getElementsByClassName('modal-start')[0];
start.addEventListener('click', function() {
    displayController.startDisplay();
});