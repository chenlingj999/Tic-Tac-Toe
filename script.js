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

        // Check if it is a winning move
        // Check rows
        const gameGrid = board.getBoard();
        for (let row = 0; row < 3; row++) {
            if (
                gameGrid[row][0].readCell() === gameGrid[row][1].readCell() &&
                gameGrid[row][0].readCell() === gameGrid[row][2].readCell() &&
                gameGrid[row][0].readCell() !== ""
            ) {
                console.log(`${gameGrid[row][0].readCell()} is the winner!`);
                return true;
            }
        }
        // Check columns
        for (let col = 0; col < 3; col++) {
            if (
                gameGrid[0][col].readCell() === gameGrid[1][col].readCell() &&
                gameGrid[0][col].readCell() === gameGrid[2][col].readCell() &&
                gameGrid[0][col].readCell() !== ""
            ) {
                console.log(`${gameGrid[0][col].readCell()} is the winner!`);
                return true;
            }
        }
        // Check main diagonal
        if (
            gameGrid[0][0].readCell() === gameGrid[1][1].readCell() &&
            gameGrid[0][0].readCell() === gameGrid[2][2].readCell() &&
            gameGrid[0][0].readCell() !== ""
        ) {
            console.log(`${gameGrid[0][0].readCell()} is the winner!`);
            return true;
        }
        // Check anti-diagonal
        if (
            gameGrid[0][2].readCell() === gameGrid[1][1].readCell() &&
            gameGrid[0][2].readCell() === gameGrid[2][0].readCell() &&
            gameGrid[0][2].readCell() !== ""
        ) {
            console.log(`${gameGrid[0][2].readCell()} is the winner!`);
            return true;
        }
        
        // Check if it is a tie (board is full and no winner)
        if (board.getEmptyCellNum() === 0) {
            console.log("Game ends in a draw.");
            return false;
        }

        printNewRound();
        switchPlayer();
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
    const game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = (win) => {
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
            })
        })
        // Handle win
        if (win) {
            playerTurnDiv.textContent = `${activePlayer.name} has won the game!`
            const cells = document.querySelectorAll('.cell');
            cells.forEach((cell) => cell.disabled = true);
            return;
        }
        // Handle draw
        if (win === false) {
            playerTurnDiv.textContent = `The game ends in a draw.`
            const cells = document.querySelectorAll('.cell');
            cells.forEach((cell) => cell.disabled = true);
            return;
        }
    }

    function boardClickHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedCol = e.target.dataset.column;

        if (!selectedCol || !selectedRow) return;
        
        updateScreen(game.playRound(selectedRow, selectedCol));
    }

    // Add the event listener to board
    boardDiv.addEventListener('click', boardClickHandler);

    updateScreen();
}

screenController();