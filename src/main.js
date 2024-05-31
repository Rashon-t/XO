const $ = (selector) => document.querySelector(selector);

const App = {
    grids: $("#grids"),
    divs: $("#grids").querySelectorAll("div"),
    xButton: $("#X"),
    oButton: $("#O"),
    xScoreDisplay: $("#x"),
    oScoreDisplay: $("#o"),
    restartButton: $("#restart")
};

const Game = {
    gameLocked: false,
    xScore: 0,
    oScore: 0,
    board: Array(9).fill(0),
    players: [
        { mark: "X" },
        { mark: "O" }
    ],
    isXTurn: true
};

const WINNING_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

App.divs.forEach((div, index) => {
    div.addEventListener('click', () => !Game.gameLocked && handlePlayerMove(div, index));
});

App.restartButton.addEventListener('click', resetGame);

function handlePlayerMove(div, index) {
    if (div.textContent !== "") return;
    Game.isXTurn = draw(Game.isXTurn, div, index);
    if (play(Game.board) && !Game.isXTurn) {
        setTimeout(botMove, 700);
    }
    updateTurnIndicator();
}

function draw(isXTurn, div, index) {
    const mark = isXTurn ? Game.players[0].mark : Game.players[1].mark;
    div.textContent = mark;
    Game.board[index] = mark;
    return !isXTurn;
}

function play(board) {
    const winner = checkWinner(board);
    if (winner) {
        highlightWinningCells(winner.pattern);
        updateScore(winner.mark);
        lockGame();
        return false;
    } else if (!board.includes(0)) {
        App.divs.forEach(div => div.classList.add("winner"));
        lockGame();
        return false;
    }
    return true;
}

function checkWinner(board) {
    for (let pattern of WINNING_PATTERNS) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { mark: board[a], pattern };
        }
    }
    return null;
}

function highlightWinningCells(pattern) {
    pattern.forEach(index => App.divs[index].classList.add("winner"));
}

function updateTurnIndicator() {
    App.xButton.style.borderBottomColor = Game.isXTurn ? "rgba(125, 125, 125, 1)" : "rgba(125, 125, 125, 0.5)";
    App.oButton.style.borderBottomColor = Game.isXTurn ? "rgba(125, 125, 125, 0.5)" : "rgba(125, 125, 125, 1)";
}

function updateScore(winnerMark) {
    if (winnerMark === "X") {
        App.xScoreDisplay.textContent = ++Game.xScore;
    } else if (winnerMark === "O") {
        App.oScoreDisplay.textContent = ++Game.oScore;
    }
}

function resetGame() {
    Game.board = Array(9).fill(0);
    Game.isXTurn = true;
    App.divs.forEach(div => {
        div.textContent = '';
        div.classList.remove("winner");
    });
    unlockGame();
    updateTurnIndicator();
}

function lockGame() {
    Game.gameLocked = true;
}

function unlockGame() {
    Game.gameLocked = false;
}

function botMove() {
    const bestMove = minimax(Game.board, Game.players[1].mark).index;
    const div = App.divs[bestMove];
    Game.isXTurn = draw(Game.isXTurn, div, bestMove);
    play(Game.board);
    updateTurnIndicator();
}

function minimax(newBoard, player) {
    const availSpots = newBoard.reduce((acc, val, index) => val === 0 ? acc.concat(index) : acc, []);
    const winner = checkWinner(newBoard);
    if (winner) {
        return { score: winner.mark === Game.players[1].mark ? 10 : -10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    const moves = availSpots.map(spot => {
        newBoard[spot] = player;
        const score = minimax(newBoard, player === Game.players[1].mark ? Game.players[0].mark : Game.players[1].mark).score;
        newBoard[spot] = 0;
        return { index: spot, score };
    });
    return moves.reduce((best, move) => (
        (player === Game.players[1].mark && move.score > best.score) || 
        (player === Game.players[0].mark && move.score < best.score) ? move : best
    ), moves[0]);
}