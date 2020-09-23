function printMat(mat, selector, color) {
    //console.log('color', color);
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            //var cell = mat[i][j].isMine;
            //var cell = mat[i][j].isShown;
            var cell = ' &nbsp';
            // console.log(mat[i][j].isMine);
            var className = 'cell outerBevel cell' + i + '-' + j; //+ '"style=color:rgb(' + color+')> ' 
            elemId = String(`cell-${i}${j}`)
            strHTML += `<td onclick="cellClicked(event,this,this.dataset.i,this.dataset.j)" data-i=${i} data-j=${j} id="${elemId}" class="${className}"> ${cell} </td>`;
            //
            //var elem = document.getElementById(elemId);


        }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';

    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
    // add event listener for right click
    rightClick('.cell');
}

function rightClick(selector) {
    // add event listener for right click
    var matches = document.querySelectorAll(selector);
    console.log(' matches', matches);
    for (var i = 0; i < matches.length; i++) {
        matches[i].addEventListener('contextmenu', e => { // add event listener window.oncontextmenu
            e.preventDefault();
            console.log(e.target.id);
            cellMarked(e); // call cellMarked
        });
    }
}

//right click prevent default and call cellMarked(elCell)
//oncontextmenu = function () { 
//    return false;     // cancel default menu
//}

function renderCell(location, value, color) {   // location such as: {i: 2, j: 7}
    // Select the elCell and set the value
    //console.log('location', location)
    var elCell = document.querySelector(`#cell-${location.i}${location.j}`);
    //var elCell = document.querySelector('#cell-10');
   
    show(elCell, location);
 }

function show(elCell, location) {
    //console.log('elCell', elCell)
    //console.log('location', location)
    var i = location.i;
    var j = location.j;
    //console.log('gBoard[i][j].isShown =', gBoard[i][j].isShown)
    
   if (!gBoard[i][j].isShown) {
       //console.table('isShown = false toggle true');
       gBoard[i][j].isShown = true;
       //console.log('gBoard[i][j.minesAroundCount', gBoard[i][j].minesAroundCount);
       checkCell(elCell, location);
       elCell.classList.toggle("outerBevel");
       elCell.classList.toggle("innerBevel");
      
   } else {
       //console.table('isShown = true toggle false');
       gBoard[i][j].isShown = false;
       elCell.classList.toggle("outerBevel");
       elCell.classList.toggle("innerBevel");
       //elCell.innerHTML = '';
   }
    //
    //console.table(gBoard);
}

function checkCell(elCell, location) {
    console.log('check cell');
    console.log('elCell', elCell, 'location', location);

    var i = location.i;
    var j = location.j;

    if (gBoard[i][j].isMine) {
        //console.log('mine')
        elCell.innerHTML = '&#x1f4a3;';
    } else if (gBoard[i][j].minesAroundCount === 0) {
        console.log('empty')
        //elCell.innerHTML = '';
        //console.log('countNeighbors(i, j, gBoard)', countNeighbors(i, j, gBoard))
        //countNeighbors(i, j, gBoard)
    } else {
        elCell.innerHTML = gBoard[i][j].minesAroundCount;
    }
}


function randomColor() {
    var color = "";
    for (var i = 0; i < 3; i++) {
        color += getRandomIntInclusive(0, 255) + ','; 
    }
    color =  color.slice(1, -1);
    //console.log('color', color)
    return color;
}

function findEmpty(length) {
    console.log('find empty');
    for (var i = 1; i < length; i++) {
        for (var j = 1; j < length; j++) {
            var cell = gBoard[i][j].innerHTML;
            if (gBoard[i][j] === ' ') {
                return true
                //console.log('found empty', cell)
            }
        } 
    }
}
function timer(selector) {
    console.log('start timer',)
    var t0;
    var t1;
    var millis;
    var secondElapsed;
    var elem = document.querySelector(selector);
    //console.log('elem', elem)

    t0 = performance.now();
    setInterval(function () { t1 = performance.now() , update() }, 1000);

    function update() {
        millis = t1 - t0;
        secondElapsed = Math.floor(millis / 1000); 
        //console.log('seconds elapsed =' , secondElapsed);
        elem.innerHTML = 'time = ' + secondElapsed;
    }
}


function countNeighbors(cellI, cellJ, mat) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            //console.log(mat[i][j])
            //console.log(mat[i][j].isEmpty)
            if (mat[i][j].isEmpty === true) neighborsSum++;
        }
    }
    return neighborsSum;
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}