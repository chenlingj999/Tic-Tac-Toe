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

    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < column; j++) {
            board[i].push(cell());
        }
    }

    const getBoard = () => board;

    const makeMove = (player, row, column) => {
        // Check if cell is empty
        if (board[row][column].readCell() == "") return;

        board[row][column].takeCell(player);
    }

    const printBoard = () => {
        const boardCellValues = board.map((row) => row.map((cell) => cell.readCell()));
        console.log(boardCellValues);
    }

    return {getBoard, makeMove, printBoard};
}