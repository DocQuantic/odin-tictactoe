const gameBoard = (function(){
    let gridSize = 3;
    let grid;
    
    function setupGrid(){
        grid = new Array(gridSize**2);
        for(let i=0; i<grid.length; i++){
            grid[i] = "";
        }
    }

    function setGridElement(row, col, value){
        grid[(col-1)+gridSize*(row-1)] = value;
    }

    function getGrid(){
        return grid;
    }

    setupGrid();
    
    return {setGridElement, getGrid};
})();

const gameManager = (function(){
    let turnNumber = 0;
    let currentPlayer = 1;

    function nextTurn(){
        turnNumber++;
    }
})();

function createPlayer(name){
    let score = 0;

    function increaseScore(){
        score++;
    }

    function getScore(){
        return score;
    }

    return {name, increaseScore, getScore};
}