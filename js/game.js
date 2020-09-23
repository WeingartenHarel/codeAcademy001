'use strict';
console.log('mines sweeper');
//debugger;
var number = 1
console.log('', number);

var gBoard;
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
};

function initGame() {
    console.log('init game')
    timer('#timer');
    gBoard = buildBoard();
    console.table(gBoard);
    //console.log(gBoard);
    setMinesMenualy();
    randomizeMines(gBoard ,gLevel.MINES)
    printMat(gBoard, '.board-container');
    setMinesNegsCount(gBoard);
}

function setMinesMenualy() {  
    console.log('setMinesMenualy', gBoard[0][1]);
    console.log('setMinesMenualy', gBoard[0][1].isMine);

}

function randomizeMines(board,mines) {
    console.log(' randomizeMines', mines);

    for (var i = 0; i < mines; i++) {
        console.log('randomiz', i);
        var locationI = getRandomIntInclusive(0, gBoard.length-1);
        var locationJ = getRandomIntInclusive(0, gBoard.length-1);
        var location = {
            i: locationI,
            j: locationJ,
        } 
        console.log('location', location);
        board[location.i][location.j].isMine = true;
    }


}

function buildBoard() {
    console.log('buildBoard',);
    var SIZE = gLevel.SIZE;
    //console.log('gLevel.SIZE', gLevel.SIZE)
    var board = [];

    
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            //board[i][j] = cell;
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true,
                isEmpty:false,
            }
            board[i][j] = cell;
      }
    }

    //board[0][1].isMine = true;
    //board[3][3].isMine = true;
    return board;
}

//
//var selector = 
//var elCell = document.querySelector(selector);
//var cellCoord = getCellCoord(elCell.id); // {i:2, j:3
function setMinesNegsCount(board) {
    console.log('setMinesNegsCount', board);

    for (var a = 0; a < board.length ; a++) {
        //console.log('b', b)
        for (var b = 0; b < board.length; b++) {
            //console.log('a ,', a, 'a ,', b)
            var cell = board[a][b];
            var pieceCoord = {
                i: a,
                j: b, 
            }
            //console.log('check pieceCoord =', pieceCoord);
            board[a][b].minesAroundCount = finNegs(pieceCoord);
            //console.log('setMinesNegsCount pieceCoord= ', pieceCoord, 'finNegs =', finNegs(pieceCoord));
            //gBoard[a][b] = 
        }
    }
   
}




// left click
function cellClicked(event, elCell, i, j) {
    event.preventDefault();
    //console.log(elCell, elCell.dataset.i, elCell.dataset.j)
    //console.log(elCell.attributes)
    //console.log(elCell.dataset.i, elCell.dataset.j)
    //console.log(i, j)
    //console.log(event)
    //update modal 
    //gBoard[i][j].isShown = true;

    var location = { i: i, j: j }
    //console.log('location', location)
    renderCell(location,) 
}

//right click
function cellMarked(e) {
    //e.preventDefault()
    //if (ev.which == 3) {
    console.log('right click', e, '\n', e.target, '\n', e.target.id);
    var location = {
        i: e.target.dataset.i,
        j: e.target.dataset.j,
    }
    console.log('location', location)
    e.target.innerHTML = '&#9873;';
    gBoard[location.i][location.j].mark = true;
        //console.log(elCell, elCell.dataset.i, elCell.dataset.j)
    //} 
}

function finNegs(pieceCoord) {
    var res = []; // [{i:7, j:0}]
    //console.log('finNegs , find neighbors', pieceCoord);
    var countNegs = 0;
    //var pieceCoord = {
    //    i: 2,
    //    j: 2,
    //}
  
   // console.log('pieceCoord', pieceCoord);
   var rowIdx = pieceCoord.i - 1;
   var colIdx = pieceCoord.j - 1;
   var rowIdxLength = rowIdx + 3;
    var colIdxLength = colIdx + 3;

    for (var i = rowIdx; i < rowIdxLength ; i++) {

        if (i < 0 || i >= rowIdxLength) continue;
        for (var j = colIdx; j < colIdxLength; j++) {
            if (j < 0 || j >= rowIdxLength) continue;
            if (i === pieceCoord.i && j === pieceCoord.j) continue;
            //console.log('a', a, 'b', b)
            if (i >= 0 && i <= 3 && j >= 0 && j <= 3 ) {
                //console.log('check',)
                var coord = { i: i, j: j };
                var cell = gBoard[i][j].isMine;
                if (cell === true) {
                     //console.log('find ', coord);
                     countNegs++;         
                 }
            }
        }
    }
    //console.log('setMinesNegsCount countNegs= ', countNegs)
    return countNegs;   
}





function getCellCoord(strCellId) {
    var parts = strCellId.split('-');
    var coord = {
        i: +parts[1],
        j: +parts[2],
    };
    // var coord = {};
    // coord.i = +parts[1];
    // coord.j = +parts[2];
    return coord;
    
}
/*
function updateScore(diff) {
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score
}
function checkScore(diff) {
    if (gGame.score === gNumberofFood-1) win()
}
function win(){
   if (window.confirm("You Win ,Play again ?")) {
       init();
   }
}
function gameOver() {
    console.log('Game Over');
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    if (window.confirm("Play again")) {
        init();
    }
}



function createCherrysTimer() {
    gTimer = setInterval(function () {  }, 15000);
    
}

gBoard – A Matrix
containing cell objects:
Each cell: {
    minesAroundCount: 4,
        isShown: true,
            isMine: false,
                isMarked: true

}
*/