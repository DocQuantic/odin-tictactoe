const ScreenManager = (function(){
    const gameManager = (function(){
        let turnNumber = 0;
        const players = {player1: createPlayer("Player1", 1), player2: createPlayer("Player2", 2)}
        let currentPlayer = players.player1;
        const gridSize = 3;
        let isGameOver = false;
        let winPlayer;
    
        function playTurn(row, col){
            value = currentPlayer.getToken();
    
            gameBoard.setGridElement(row, col, value);
            gameBoard.showGrid();
    
            const winner = checkEndGame();
            winPlayer = winner === 1 ? players.player1 : players.player2
            if(winner !== 0){
                console.log(`Congratulations ! ${winPlayer.name} won the game`);
                isGameOver = true;
                winPlayer.increaseScore();
                
                return;
            };
    
            nextTurn();
        }
    
        function nextTurn(){
            turnNumber++;
    
            currentPlayer = currentPlayer === players.player1 ? players.player2 : players.player1;
        }
    
        function checkEndGame(){
            grid = gameBoard.getGrid();
            const isEqual = (element, i, arr) => element === arr[0];
    
            //check rows and columns
            for(let i=0; i<gridSize; i++){
                const row = [grid[0 + gridSize*i], grid[1 + gridSize*i], grid[2 + gridSize*i]];
                const col = [grid[i], grid[gridSize + i], grid[2*gridSize + i]]
    
                if(row.every(isEqual) || col.every(isEqual)){
                    const winner = row.every(isEqual) ? row[0] : col[0];
    
                    return winner;
                }
            }
    
            //check diagonals
            const diag1 = [];
            const diag2 = [];
            for(let i=0; i<gridSize; i++){
                diag1.push(grid[(gridSize+1)*i])
                diag2.push(grid[(gridSize-1)*(i+1)])
            }
            
            if(diag1.every(isEqual) || diag2.every(isEqual)){
                const winner = diag1.every(isEqual) ? diag1[0] : diag2[0];
    
                return winner;
            }
    
            return 0;
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
    
        const gameBoard = (function (gridSize) {
            let grid;
            
            function setupGrid(){
                grid = new Array(gridSize**2);
                for(let i=0; i<grid.length; i++){
                    grid[i] = 0;
                }
            }
        
            function setGridElement(row, col, value){
                console.log(col);
                console.log(row);
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
            currentPlayer = players.player1;
            turnNumber = 0;
            gameBoard.resetGrid();
        }
    
        return {playTurn, getCurrentPlayer, getGridSize, getGameOver, getWinner, newGame};
    })();

    function generateGameBoardCells(gridSize){
        const gameBoard = document.querySelector(".game-board");

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
                            showWinnerMessage(winner);
                            updatePlayerScore(winner);
                        }
                    }
                })
                gameBoard.appendChild(cell);
            }
        }
    }

    function updatePlayerScore(player){
        const playerToken = player.getToken();
        const score = document.querySelector(playerToken === 1 ? ".p1 > .score" : ".p2 > .score");
        score.innerText = player.getScore();
    }

    function showGameOver(player){

    }

    generateGameBoardCells(gameManager.getGridSize())
})();