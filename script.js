const ScreenManager = (function(){
    const gameManager = (function(){
        let turnNumber = 0;
        const players = {player1: createPlayer("Player1", 1), player2: createPlayer("Player2", 2)}
        let currentPlayer = players.player1;
        const gridSize = 3;
    
        function playTurn(row, col){
            value = currentPlayer.getToken();
    
            gameBoard.setGridElement(row, col, value);
            gameBoard.showGrid();
    
            const winner = checkEndGame();
            const winPlayer = winner === 1 ? players.player1 : players.player2
            if(winner !== 0){
                console.log(`Congratulations ! ${winPlayer.name} won the game`);
                winPlayer.increaseScore();
    
                newGame();
                return;
            };
    
            nextTurn();
        }
    
        function newGame(){
            currentPlayer = players.player1;
            turnNumber = 0;
            gameBoard.resetGrid();
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
        
            function getScore(){
                return score;
            }
    
            function getToken(){
                return token;
            }
        
            return {name, increaseScore, getScore, getToken};
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
                grid[(col-1)+gridSize*(row-1)] = value;
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
    
        return {getCurrentPlayer, getGridSize, playTurn};
    })();

    function generateGameBoardCells(gridSize){
        const gameBoard = document.querySelector(".game-board");

        for(let i=0; i<gridSize; i++){
            for(let j=0; j<gridSize; j++){
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.classList.add("unplayed");
                cell.setAttribute("id", `${i}-${j}`);
                const cellContent = document.createElement("p");
                cell.appendChild(cellContent);

                cell.addEventListener("mouseenter", () => {
                    if(cell.classList[1] === "unplayed"){
                        cell.children[0].innerText = gameManager.getCurrentPlayer().getToken() === 1 ? "X" : "O";
                    }
                    })
                cellContent.addEventListener("mouseleave", () => {
                    if(cell.classList[1] === "unplayed"){
                        cell.children[0].innerText = "";
                    }
                    })
                cell.addEventListener("click", () => {
                    if(cell.classList[1] === "unplayed"){
                        const cellId = cell.getAttribute("id");
                        gameManager.playTurn(cell.getAttribute("id"));
                        //cell.innerText = gameManager.getCurrentPlayer().getToken() === 1 ? "X" : "O";
                    }
                })
                gameBoard.appendChild(cell);
            }
        }
    }

    generateGameBoardCells(gameManager.getGridSize())
})();