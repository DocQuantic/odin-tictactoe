const ScreenManager = (function(){
    const gameManager = (function(){
        let turnNumber = 0;
        let gameNumber = 0;
        let players;
        let currentPlayer;
        const gridSize = 3;
        let isGameOver = false;
        let winPlayer;
    
        function playTurn(row, col){
            value = currentPlayer.getToken();
    
            gameBoard.setGridElement(row, col, value);
            gameBoard.showGrid();
    
            winPlayer = checkWinner();
            if(winPlayer !== null){
                isGameOver = true;
                winPlayer.increaseScore();
                
                return;
            } else if(winPlayer === null && turnNumber === 8){
                isGameOver = true;

                return;
            } else {
                nextTurn();
            };
        }
    
        function nextTurn(){
            turnNumber++;
    
            currentPlayer = currentPlayer === players.player1 ? players.player2 : players.player1;
        }
    
        function checkWinner(){
            grid = gameBoard.getGrid();
            const isEqual = (element, i, arr) => element === arr[0];
            let winnerToken;
            let winPlayer = null;
    
            //check rows and columns
            for(let i=0; i<gridSize; i++){
                const row = [grid[0 + gridSize*i], grid[1 + gridSize*i], grid[2 + gridSize*i]];
                const col = [grid[i], grid[gridSize + i], grid[2*gridSize + i]]
    
                if(row.every(isEqual) || col.every(isEqual)){
                    winnerToken = row.every(isEqual) ? row[0] : col[0];
                    if(winnerToken !== 0){
                        break;
                    }
                }
            }
    
            //check diagonals
            if(winnerToken !== 0){
                const diag1 = [];
                const diag2 = [];
                for(let i=0; i<gridSize; i++){
                    diag1.push(grid[(gridSize+1)*i]);
                    diag2.push(grid[(gridSize-1)*(i+1)]);
                }
                
                if(diag1.every(isEqual) || diag2.every(isEqual)){
                    winnerToken = diag1.every(isEqual) ? diag1[0] : diag2[0];
                }
            }            

            switch(winnerToken){
                case 1:
                    winPlayer = players.player1;
                    break;
                case 2:
                    winPlayer = players.player2;
                    break;
                default:
                    winPlayer = null;
                    break;
            }
    
            return winPlayer;
        }
    
        function createPlayer(name, token){
            let score = 0;
        
            function increaseScore(){
                score++;
            }

            function getName(){
                return name;
            }
        
            function getScore(){
                return score;
            }
    
            function getToken(){
                return token;
            }
        
            return {increaseScore, getName, getScore, getToken};
        }

        function createPlayers(player1Name, player2Name){
            players = {player1: createPlayer(player1Name, 1), player2: createPlayer(player2Name, 2)};
            
            currentPlayer = players.player1;
        }
    
        const gameBoard = (function (gridSize) {
            let grid;
            
            function setupGrid(){
                grid = new Array(gridSize**2);
                for(let i=0; i<grid.length; i++){
                    grid[i] = 0;
                }
            }
        
            function setGridElement(row, col, value){
                grid[(col)+gridSize*(row)] = value;
            }
        
            function getGrid(){
                return grid;
            }

            function showGrid(){
                console.log(grid);
            }
        
            function resetGrid(){
                for(let i=0; i<grid.length; i++){
                    grid[i] = 0;
                }
            }
        
            setupGrid();
            
            return {setGridElement, getGrid, showGrid, resetGrid};
        })(gridSize);
    
        function getGridSize(){
            return gridSize;
        }
    
        function getCurrentPlayer(){
            return currentPlayer;
        }

        function getGameOver(){
            return isGameOver;
        }

        function getWinner(){
            return winPlayer;
        }

        function newGame(){
            turnNumber = 0;
            gameNumber++;
            currentPlayer = gameNumber%2 === 0 ? players.player1 : players.player2;
            isGameOver = false;
            gameBoard.resetGrid();
        }
    
        return {createPlayers, playTurn, getCurrentPlayer, getGridSize, getGameOver, getWinner, newGame};
    })();

    function initializeUI(gridSize){
        const gameBoard = document.querySelector(".game-board");
        const resetBtn = document.querySelector("#reset-btn");
        const newGameBtn = document.querySelector("#new-game-btn");
        const dialogBtn = document.querySelector("#dialog-btn");
        const nameInput = document.querySelectorAll("input");

        for(let i=0; i<gridSize; i++){
            for(let j=0; j<gridSize; j++){
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.classList.add("unplayed");
                cell.setAttribute("id", `${i}-${j}`);

                cell.addEventListener("mouseenter", () => {
                    if(cell.classList[1] === "unplayed" && !gameManager.getGameOver()){
                        cell.innerText = gameManager.getCurrentPlayer().getToken() === 1 ? "X" : "O";
                    }
                    })
                cell.addEventListener("mouseleave", () => {
                    if(cell.classList[1] === "unplayed" && !gameManager.getGameOver()){
                        cell.innerText = "";
                    }
                    })
                cell.addEventListener("click", () => {
                    if(cell.classList[1] === "unplayed" && !gameManager.getGameOver()){
                        const cellId = cell.getAttribute("id");
                        const cellRow = Number(cellId[0]);
                        const cellCol = Number(cellId[2]);
                        cell.innerText = gameManager.getCurrentPlayer().getToken() === 1 ? "X" : "O";
                        gameManager.playTurn(cellRow, cellCol);
                        cell.classList.remove("unplayed");
                        cell.classList.add("played");
                        if(gameManager.getGameOver()){
                            const winner = gameManager.getWinner();
                            showGameOver(winner);
                            if(winner !== null){
                                updatePlayerScore(winner);
                            }
                        }
                    }
                })
                gameBoard.appendChild(cell);
            }
        }

        resetBtn.addEventListener("click", () => {
            gameManager.newGame();
            resetGridUI();
            hideGameOver();
        })

        newGameBtn.addEventListener("click", () => {
            showDialog();
            
            gameManager.newGame();
            resetGridUI();
            resetScoresUI();
            hideGameOver();
        })

        dialogBtn.addEventListener("click", (event) => {
            const dialog = document.querySelector(".dialog");
            const main = document.querySelector(".main");

            const player1 = nameInput[0].value === "" ? "Player 1" : nameInput[0].value;
            const player2 = nameInput[1].value === "" ? "Player 2" : nameInput[1].value;

            gameManager.createPlayers(player1, player2)

            updateUIPlayerNames(player1, player2);
            dialog.classList.remove("flex");
            dialog.classList.add("hide");
            main.classList.remove("hide");
            main.classList.add("grid")
        })
    }

    function updateUIPlayerNames(player1Name, player2Name){
        const playerNames = document.querySelectorAll(".player > .name");
        playerNames[0].innerText = `${player1Name} :` ;
        playerNames[1].innerText = `: ${player2Name}`;
    }

    function updatePlayerScore(player){
        const playerToken = player.getToken();
        const score = document.querySelector(playerToken === 1 ? ".p1 > .score" : ".p2 > .score");
        score.innerText = player.getScore();
    }

    function showGameOver(player){
        const gameOverElement = document.querySelector("#game-over");

        if(player === null){
            gameOverElement.innerText = "It's a tie !"
        } else {
            gameOverElement.innerText = `Congratulations! ${player.getName()} won the game.`
        }

        gameOverElement.classList.remove("game-not-over");
        gameOverElement.classList.add("game-over");
    }

    function hideGameOver(){
        const gameOverElement = document.querySelector("#game-over");

        gameOverElement.classList.remove("game-over");
        gameOverElement.classList.add("game-not-over");
    }

    function resetGridUI(){
        const cells = document.querySelectorAll(".cell");

        cells.forEach((cell) => {
            cell.innerText = "";
            cell.classList.remove("played");
            cell.classList.add("unplayed");
        })
    }

    function resetScoresUI(){
        const scores = document.querySelectorAll(".score");

        scores.forEach((score) => {
            score.innerText = "0";
        })
    }

    function showDialog(){
        const dialog = document.querySelector(".dialog");
        const main = document.querySelector(".main");
        dialog.classList.remove("hide");
        dialog.classList.add("flex");
        main.classList.remove("grid");
        main.classList.add("hide");
    }

    initializeUI(gameManager.getGridSize())
    showDialog()
})();