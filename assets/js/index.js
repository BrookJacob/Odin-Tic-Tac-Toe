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
            board[boardArrayY][boardArrayX] = currentPlayer.gamePeice;
            displayController.validPlay(currentPlayer, event.target);
            let winStatus = winConditions();
            if (winStatus == 'nothing') {
                changePlayer();
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
    };

    const winConditions = () => {

        //Check for win along x-axis of board nested array
        for (let i = 0; i < board.length; i++) {
            if (board[i].every(peice => peice == currentPlayer.gamePeice)) {
                return 'win';
            }
        }

        //Check for win along y-axis of board nested array
        for (let i = 0; i < board.length; i++) {
            let yAxisArray = [];
            for (let j = 0; j < board.length; j++) {
                yAxisArray.push(board[j][i]);
            }
            if (yAxisArray.every(peice => peice == currentPlayer.gamePeice)) {
                return 'win';
            }
        }

        //Check for win along the top left to bottom right diagonal
        let topLeftBottomRightDiagonalArray = [];
        for (let i = 0; i < board.length; i++) {
            topLeftBottomRightDiagonalArray.push(board[i][i]);
        }
        if (topLeftBottomRightDiagonalArray.every(peice => peice == currentPlayer.gamePeice)) {
            return 'win';
        }

        //Check for win along the bottom left to top right diagonal
        let bottomLeftTopRightDiagonalArray = [];
        for (let i = 0; i < board.length; i++) {
            bottomLeftTopRightDiagonalArray.push(board[board.length - 1 - i][i]);
        }
        if (bottomLeftTopRightDiagonalArray.every(peice => peice == currentPlayer.gamePeice)) {
            return 'win';
        }


        //Check for tie by comparing every peice against the board array's initial fill of ''
        if (board.flat().every(peice => peice != '')) {
            return 'tie';
        }
        return 'nothing';
    }
    return { init, board, players, takeTurn, getCurrentPlayer };
})();



const Player = (name, gamePeice) => {

    return { name, gamePeice };
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
            const playerOnePeiceInput = document.getElementsByClassName('player-peice')[0].value;
            const playerTwoPeiceInput = document.getElementsByClassName('player-peice')[1].value;

            const playerOne = Player(playerOneNameInput, playerOnePeiceInput);
            const playerTwo = Player(playerTwoNameInput, playerTwoPeiceInput);
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
        const gamePeice = document.createElement('p');
        gamePeice.innerText = currentPlayer.gamePeice;
        gameTile.appendChild(gamePeice);
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