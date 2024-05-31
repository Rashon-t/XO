const App = {
    grids: document.getElementById("grids"),
    divs: grids.querySelectorAll("div"),
    xButton: document.getElementById("X"),
    oButton: document.getElementById("O"),
    xScoreDisplay: document.getElementById("x"),
    oScoreDisplay: document.getElementById("o"),
    restartButton: document.getElementById("restart")
}

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
}

const WINNING_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

App.divs.forEach((div, index) => {
    div.addEventListener('click', () => {
        if (!Game.gameLocked) {
            handlePlayerMove(div, index);
        }
    });
});

App.restartButton.addEventListener('click', resetGame);

function handlePlayerMove(div, index) {
    if (div.textContent !== "") return;
    Game.isXTurn = draw(Game.isXTurn, div, index);
    play(Game.board);
    if (!Game.isXTurn && !Game.gameLocked) {
        Game.gameLocked = true;
        setTimeout(() => {
            botMove();
            if (!checkWinner(Game.board) && Game.board.includes(0)) {
                Game.gameLocked = false;
            }
        }, 700);
    }
    color();
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
    } else if (!board.includes(0)) {
        App.divs.forEach(div => div.classList.add("winner"));
        lockGame();
    }
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
    for (let index of pattern) {
        App.divs[index].classList.add("winner");
    }
}

function color() {
    if (Game.isXTurn) {
        App.xButton.style.borderBottomColor = "rgba(125, 125, 125, 1)";
        App.oButton.style.borderBottomColor = "rgba(125, 125, 125, 0.5)";
    } else {
        App.xButton.style.borderBottomColor = "rgba(125, 125, 125, 0.5)";
        App.oButton.style.borderBottomColor = "rgba(125, 125, 125, 1)";
    }
}

function updateScore(winnerMark) {
    if (winnerMark === "X") {
        Game.xScore += 1;
        App.xScoreDisplay.textContent = Game.xScore;
    } else if (winnerMark === "O") {
        Game.oScore += 1;
        App.oScoreDisplay.textContent = Game.oScore;
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
    color();
}

function lockGame() {
    Game.gameLocked = true;
}

function unlockGame() {
    Game.gameLocked = false;
}

function botMove() {
    let bestMove = minimax(Game.board, Game.players[1].mark).index;
    let div = App.divs[bestMove];
    Game.isXTurn = draw(Game.isXTurn, div, bestMove);
    play(Game.board);
    color();
}

function minimax(newBoard, player) {
    const availSpots = newBoard.reduce((acc, val, index) => {
        if (val === 0) acc.push(index);
        return acc;
    }, []);
    const winner = checkWinner(newBoard);
    if (winner) {
        return { score: winner.mark === Game.players[1].mark ? 10 : -10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    const moves = availSpots.map(spot => {
        const move = { index: spot };
        newBoard[spot] = player;
        move.score = minimax(newBoard, player === Game.players[1].mark ? Game.players[0].mark : Game.players[1].mark).score;
        newBoard[spot] = 0;
        return move;
    });
    return moves.reduce((best, move) => {
        if ((player === Game.players[1].mark && move.score > best.score) ||
            (player === Game.players[0].mark && move.score < best.score)) {
            return move;
        }
        return best;
    }, moves[0]);
}