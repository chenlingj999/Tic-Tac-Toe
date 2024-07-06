// Create the cell that will be in each slot of the board
// Each cell can then hold the value of "O" or "X"
function cell() {
    let value = "";

    const takeCell = (player) => {
        value = player;
    }

    const readCell = () => value;

    return {takeCell, readCell};
}

// Create the gameboard with 3x3 cells
// with basic methods such as viewing the board and putting things inside of a cell
function gameboard() {
    const row = 3;
    const column = 3;
    const board = [];
    let emptyCellNum = 9;

    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < column; j++) {
            board[i].push(cell());
        }
    }

    const getBoard = () => board;

    const makeMove = (player, row, column) => {
        // Check if cell is empty
        if (board[row][column].readCell() !== "") return false;

        board[row][column].takeCell(player);
        emptyCellNum--;
        return true;
    }

    const printBoard = () => {
        const boardCellValues = board.map((row) => row.map((cell) => cell.readCell()));
        console.log(boardCellValues);
    }

    const getEmptyCellNum = () => emptyCellNum;

    return {getBoard, makeMove, printBoard, getEmptyCellNum};
}

// Controller to control game logic such as turns and players
function gameController(
    playerOneName = "Player 1",
    playerTwoName = "Player 2"
) {
    const board = gameboard();

    const players = [
        {
            name: playerOneName,
            token: "O"
        },
        {
            name: playerTwoName,
            token: "X"
        }
    ];

    let activePlayer = players[0];

    const switchPlayer = () => {
        activePlayer = (activePlayer.token === players[0].token) ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const checkWin = () => {
        // Check if it is a winning move
        // Check rows
        const gameGrid = board.getBoard();
        for (let row = 0; row < 3; row++) {
            if (
                gameGrid[row][0].readCell() === gameGrid[row][1].readCell() &&
                gameGrid[row][0].readCell() === gameGrid[row][2].readCell() &&
                gameGrid[row][0].readCell() !== ""
            ) {
                return `${gameGrid[row][0].readCell()} is the winner!`;
            }
        }
        // Check columns
        for (let col = 0; col < 3; col++) {
            if (
                gameGrid[0][col].readCell() === gameGrid[1][col].readCell() &&
                gameGrid[0][col].readCell() === gameGrid[2][col].readCell() &&
                gameGrid[0][col].readCell() !== ""
            ) {
                return `${gameGrid[0][col].readCell()} is the winner!`;
            }
        }
        // Check main diagonal
        if (
            gameGrid[0][0].readCell() === gameGrid[1][1].readCell() &&
            gameGrid[0][0].readCell() === gameGrid[2][2].readCell() &&
            gameGrid[0][0].readCell() !== ""
        ) {
            return `${gameGrid[0][0].readCell()} is the winner!`;
        }
        // Check anti-diagonal
        if (
            gameGrid[0][2].readCell() === gameGrid[1][1].readCell() &&
            gameGrid[0][2].readCell() === gameGrid[2][0].readCell() &&
            gameGrid[0][2].readCell() !== ""
        ) {
            return `${gameGrid[0][2].readCell()} is the winner!`;
        }
        
        // Check if it is a tie (board is full and no winner)
        if (board.getEmptyCellNum() === 0) {
            return "Game ends in a draw.";
        }
    }

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        console.log(`Putting an ${getActivePlayer().token} in row ${row}, column ${column}.`);
        const success = board.makeMove(getActivePlayer().token, row, column);

        // If cell already taken prevent player from losing the turn
        if (!success) {
            console.log("Cell is already taken. Please choose another cell.");
            return;
        }

        const winCond = checkWin();
        if (winCond) {
            console.log(winCond);
            return winCond;
        }

        switchPlayer();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

// Function to control/display items on the screen
function screenController() {
    let game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = "";
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display current active player
        playerTurnDiv.textContent = `${activePlayer.name}'s turn.`;

        board.forEach((row, index) => {
            let rowNumber = index;
            row.forEach((cell, index) => {
                const cellBtn = document.createElement('button');
                cellBtn.classList.add("cell");
                // Add identifier to cell
                cellBtn.dataset.column = index;
                cellBtn.dataset.row = rowNumber;
                
                cellBtn.textContent = cell.readCell();
                boardDiv.appendChild(cellBtn);
            });
        });
    }

    const handleEndGame = (endGameMsg) => {
        playerTurnDiv.textContent = endGameMsg;
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell) => cell.disabled = true);

        // Restart game option
        const restart = document.createElement('button');
        restart.classList.add('.restart');
        restart.textContent = "Restart";
        restart.addEventListener('click', () => {
            // Create new game
            game = gameController();
            restart.remove();
            updateScreen();
        });

        const endGame = document.querySelector('.endGame');
        endGame.appendChild(restart);
    }

    function boardClickHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedCol = e.target.dataset.column;

        if (!selectedCol || !selectedRow) return;
        
        const endGameMsg = game.playRound(selectedRow, selectedCol);

        updateScreen();
        
        // Check if game ended
        if (endGameMsg) {
            handleEndGame(endGameMsg);
        }
    }

    // Add the event listener to board
    boardDiv.addEventListener('click', boardClickHandler);

    updateScreen();
}

screenController();