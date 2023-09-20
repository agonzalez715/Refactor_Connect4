class Player {//represents a pla=yer in the game
    constructor (color) {
        this.color = color; //this decides what color the player will use/be
    }
}

class Game {//main class that represents the connect4 game
    constructor(p1, p2, HEIGHT, WIDTH) {//sets up the initial game state
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;
        //the two lines above represent the size of the gameboard
        this.p1 = p1;
        this.p2 = p2;
        //the two lines above represent the players in the game
        this.currPlayer = p1; //keeps track of whose turn it is
        this.gameOver = false;//a flag to indiate if a game has ended or not
    }

    init() {//initializes the game
        this.board = [];//initialising the board, an array to represent an empty board game
        this.makeBoard();//sets up logical board
        this.clearBoard();//clears the visual html board for restarting the game
        this.makeHtmlBoard();//sets up the visual board
        this.currPlayer = this.p1;
        this.gameOver = false;
        //the two lines above reset the game state to starting conditions
    }

    clearBoard() {//function initializes
        const board = document.getElementById('board');//references the html element and assigns to board variable 
        while (board.firstChild) {//as long as there is a firstChild element
            board.removeChild(board.lastChild);//it will remove the child element to clear the board until there are none left
        }
    }

    makeBoard() {//creates the logc for the game board/initialize the 2d array
        for (let y = 0; y < this.HEIGHT; y++) {//loop will run as many times as is defined by height
            this.board.push(Array.from({ length: this.WIDTH }));//creates a new array with a length of this.WIDTH, and will basically create an array of arrays
            //the newly created array, representing a row, is then added to the 'board' array
        }
    }

    makeHtmlBoard() {//creates the visual game board using html elements
        const board = document.getElementById('board');

        // Create the clickable top row
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        top.addEventListener('click', function(evt) { this.handleClick(evt); }.bind(this));

        for (let x = 0; x < this.WIDTH; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);
        }

        board.append(top);

        // Create the main game board rows
        for (let y = 0; y < this.HEIGHT; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < this.WIDTH; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }

            board.append(row);
        }
    }

    findSpotForCol(x) {//given an column, it finds the next available row in theat column
        for (let y = this.HEIGHT - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }
        return null;
    }

    placeInTable(y, x) {//places a piece on the visual board 
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.background = this.currPlayer.color;//use color attribute from player class
        piece.style.top = -50 * (y + 2);

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    endGame(msg) {//ends the game and shows a message
        alert(msg);
    }

    handleClick(evt) {//event handler for when a player tries to place a piece in a column

        //if the game is over, dont allow any further moves 
        if(this.gameOver) return;

        const x = +evt.target.id;
        const y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }

        // Update board and place piece
        this.board[y][x] = this.currPlayer.color;//storing players color
        this.placeInTable(y, x);

        // Check for win or tie
        if (this.checkForWin()) {
            return this.endGame(`Player ${this.currPlayer.color} won!`);
        }

        if (this.board.every(function(row) { return row.every(function(cell) { return cell; }); })) {
            return this.endGame('Tie!');
        }

        // Switch players
        this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
    }

    checkForWin() {
        const _this = this; 

        function _win(cells) {
            return cells.every(function(cell) {
                const y = cell[0];
                const x = cell[1];
                return (
                    y >= 0 &&
                    y < _this.HEIGHT &&
                    x >= 0 &&
                    x < _this.WIDTH &&
                    _this.board[y][x] === _this.currPlayer
                );
            });
        }

        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

                // Check each possible winning combination
                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
        return false;
    }
}

const p1 = new Player('red');
const p2 = new Player('blue');

const game = new ConnectFour(p1, p2, 6, 7);  // Set the HEIGHT and WIDTH as needed

document.getElementById('start-game').addEventListener('click', function() {
    const p1Color = document.getElementById('p1-color').value; // default to red if no value
    const p2Color = document.getElementById('p2-color').value;// default to blue if no value

    const p1 = new Player(p1Color);
    const p2 = new Player(p2Color);

    const game = new Game(p1, p2, 6, 7);
    game.init();
});

// You'd create a new game with:
// const game = new ConnectFour();

//points to consider
//instead of constantly checking for user input, the game waits for events, like a button click, to happen and then reacts 
//the game always knows its current state(who the current player is, what the board looks like, if the game has ended, etc). this makes it easier to handle events and update the game
