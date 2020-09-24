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
    secsPassed: 0,
    isWIn:'normal',
}

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 3,
};

var gGameTimer; // set global var timer for reset
var gMessegeLoose = 'You loose, play again?';
var gMessegeWin = 'You win,play again? ';
var gClassesBevel = ['outerBevel', 'innerBevel'];
var gClassesDisplay = ['display', 'displayNone'];
var gFirstClick = false;
var gCountShownFlags = 0;
var gNbrsChecked = 0;
var gTotalCells = 0
function initGame(size, mines ,lives) {

    gLevel.SIZE = size;
    gLevel.MINES = mines;
    gLevel.LIVES = lives;
    console.log('init game', gLevel, size, mines, lives);
    gBoard = buildBoard();
    
    randomizeMines(gBoard ,gLevel.MINES)
    printMat(gBoard, '.board-container');
    setMinesNegsCount(gBoard);
 
    // check Board
    console.table(gBoard); // print board
    console.table(printTable(gBoard)); // print board
    gTotalCells = Math.pow(gBoard.length, 2); // gBoard total cells number , after gBoard created
    createLives(false);
    updateSmiley();
}

function updateSmiley() {
    //update smiley button
    var elemSmiley = document.querySelector('#button-smiley')
    elemSmiley.dataset.size = gLevel.SIZE;
    elemSmiley.dataset.mines = gLevel.MINES;
    elemSmiley.dataset.lives = gLevel.LIVES;

    if (gGame.isWIn === 'normal') {
        elemSmiley.innerHTML = '&#128578';
    } else if (gGame.isWIn) {
        elemSmiley.innerHTML = '&#128526';  
    } else {
        elemSmiley.innerHTML = ' &#128542';
    }

}

function createLives(ifClickMine) {   
    var elem = document.querySelector('.lives')
    elem.innerHTML = '';
    console.log('lives', gLevel.LIVES, elem);
    if (!ifClickMine) {
        for (var i = 0; i < gLevel.LIVES; i++) {
            elem.innerHTML += '&#x2764 ';
        }
    } else {
        elem.innerHTML -= '&#x2764 ';
        console.log('lives minus', gLevel.LIVES,);
        if (gLevel.LIVES === 0) {   
            elem.innerHTML = '0';
            gameOver(gMessegeLoose);
            gGame.isWIn = false;
            updateSmiley();
        }
    }
}

function setMinesMenualy() {  
    console.log('setMinesMenualy', gBoard[0][1]);
    console.log('setMinesMenualy', gBoard[0][1].isMine);
}

function randomizeMines(board, mines) {
    console.log(' randomizeMines', mines);
    for (var i = 0; i < mines; i++) {
        //console.log('randomiz', i);
        var locationI = getRandomIntInclusive(0, gBoard.length-1);
        var locationJ = getRandomIntInclusive(0, gBoard.length-1);
        var location = {
            i: locationI,
            j: locationJ,
        } 
        console.log('location', location);
        if (board[location.i][location.j].isMine) {
            randomizeMines(gBoard, gLevel.MINES);
        }
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
            var id = i+'-'+j;
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isEmpty: true,
                id: id,
            }
            board[i][j] = cell;
      }
    }
    return board;
}

function setMinesNegsCount(board) { //count mines neighboreds
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
    setTimer();
    playSound()
    //console.log(elCell, elCell.dataset.i, elCell.dataset.j)
    //console.log(elCell.attributes)
    //console.log(elCell.dataset.i, elCell.dataset.j)
    //console.log(i, j)
    //console.log(event)
    //update modal 
    //gBoard[i][j].isShown = true;

    var location = { i: i, j: j }
    //console.log('location', location)
    //console.log('gBoard[i][j].isShown', gBoard[i][j].isShown)
    //console.log('gBoard[i][j].isMarked', gBoard[i][j].isMarked)

    if (gBoard[i][j].isShown === false && gBoard[i][j].isMarked === false) {
        renderCell(location) 
        checkGameOver();
    }
}
// right click addEventListener
function rightClickSetEvent(selector) { // addEventListener to all cell (selector value)
    // add event listener for right click
    var matches = document.querySelectorAll(selector);
    console.log(' matches', matches);
    for (var i = 0; i < matches.length; i++) {
            matches[i].addEventListener('contextmenu', e => { // add event listener window.oncontextmenu
            e.preventDefault();
            console.log(e.target.id);
            rightClick(e); // call cellMarked
            checkGameOver();
        });
    }
}

// right click cellMarked
function rightClick(e) {
    setTimer(); //set timer
    //console.log(elCell, elCell.dataset.i, elCell.dataset.j)
    //e.preventDefault()
    //if (ev.which == 3) {
    console.log('right click', e, '\n', e.target, '\n', e.target.id);
    var location = {
        i: e.target.dataset.i,
        j: e.target.dataset.j,
    }
    //console.log('location', location) 

    if (!gBoard[location.i][location.j].isMarked && !gBoard[location.i][location.j].isShown) { // &&gCountShownFlags < gLevel.MINES
        gBoard[location.i][location.j].isMarked = true;
        e.target.innerHTML = '&#9873;';
        gGame.markedCount++
    } else if (gBoard[location.i][location.j].isMarked) {
        gBoard[location.i][location.j].isMarked = false;
        e.target.innerHTML = '';
        gGame.markedCount--
    }   
}

function checkGameOver() {
    console.log('check game over');
    //console.log('check game over totalCells = ',totalCells); 
    console.log('countCells', gGame.shownCount, gGame.markedCount)
    var win = (gGame.shownCount + gGame.markedCount === gTotalCells) ? true : false
   ///for (var i = 0; i < gBoard.length; i++) {
   ///    for (var j = 0; j < gBoard.length; j++) {
   ///        if (gBoard[i][j].isShown === true || gBoard[i][j].isMarked === true) { //|| gBoard[i][j].isMarked === true ||
   ///            //gGame.shownCount++
   ///            //
   ///            
   ///        }
   ///    }
   ///}
    console.log('win =', win);
    //return win
    if (win) {
        gameOver(gMessegeWin);
        gGame.isWIn = true;
        updateSmiley();
    }
    return
}

function gameOver(messege) {
    console.log('gameOver');
    var elCell = document.querySelector('.modal-container');
    console.log('elCell', elCell)
    toggleShowHideClasses(elCell, gClassesDisplay);
    elCell.innerHTML 
    var fourChildNode = elCell.querySelector('.messege');
    fourChildNode.innerHTML =  messege;
}

function playAgainYes() {
    var elCell = document.querySelector('.modal-container');
    //console.log('playAgain yes', gLevel.cells, gLevel.mines, gLevel.lives);
    toggleShowHideClasses(elCell, gClassesDisplay);
    initGame(gLevel.SIZE, gLevel.MINES, gLevel.LIVES);
   
}

function playAgainNo() {
    console.log('playAgain No');
    var elCell = document.querySelector('.modal-container');
    toggleShowHideClasses(elCell, gClassesDisplay);
}

function finNegs(pieceCoord) {
    var res = []; // [{i:7, j:0}]
    //console.log('finNegs , find neighbors', pieceCoord);
    var countNegs = 0;

    // old
    // console.log('pieceCoord', pieceCoord);
    //var rowIdx = pieceCoord.i - 1;
    //var colIdx = pieceCoord.j - 1;
    //var rowIdxLength = rowIdx + 3;
    //var colIdxLength = colIdx + 3;

    // console.log('pieceCoord', pieceCoord);
    var rowIdx = pieceCoord.i - 1;
    var colIdx = pieceCoord.j - 1;
    var rowIdxLength =  pieceCoord.i + 1;
    var colIdxLength = pieceCoord.i + 1;
    //var colIdxLength = colIdx + 3;

    for (var i = rowIdx; i <= rowIdxLength ; i++) {

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

function printTable(board) {
    var res=[]
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {        
            var cell = board[i][j];
            res.push(cell);
            
        }
    }
    return res
    //var f = console.table('cell ', cell)
    
}

function setTimer() {
    console.log('gFirstClick =', gFirstClick)
    if (!gFirstClick) {
        console.log('setTimer')
        gTimer.functionTimer('#timer'); //timer('#timer');
        gFirstClick = true
    }
}
function playSound() {
    if (gFirstClick) {
        console.log('play music');
        //document.body.addEventListener('mouseClick', function () {
            document.getElementById("gameSound").play();
        //}, false);
    }  
    //const audio = new Audio('media/Game-Menu_Looping.mp3');
    //const playPromise = audio.play();
}