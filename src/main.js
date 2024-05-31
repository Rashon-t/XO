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
    board: [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ],
    players: [
        { mark: "X" },
        { mark: "O" }
    ],
    isXTurn: true
}

App.divs.forEach((div, index) => {
    div.addEventListener('click', () => {
        if (!Game.gameLocked) {
            let isCellOccupied = div.textContent === "X" || div.textContent === "O";
            if (!isCellOccupied) {
                Game.isXTurn = draw(Game.isXTurn, div, index);
                play(Game.board);
            }
            color();
        }
    })
})

function draw(isXTurn, div, index) {
    let xMark = Game.players[0].mark;
    let oMark = Game.players[1].mark;
    if (isXTurn) {
        div.textContent = xMark;
        Game.board[index] = xMark;
        return false;
    } else {
        div.textContent = oMark;
        Game.board[index] = oMark;
        return true;
    }
}

function play(board) {
    const winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            const winningCells = [a, b, c];
            for (let cellIndex of winningCells) {
                App.divs[cellIndex].classList.add("winner");
            }
            updateScore(board[a]);
            lockGame();
            return;
        }
    }
    if (!board.includes(0)) {
        App.divs.forEach((i) => {
            i.classList.add("winner");
        })
        lockGame();
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

App.restartButton.addEventListener('click', () => {
    resetGame();
});

function resetGame() {
    Game.board = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ];
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