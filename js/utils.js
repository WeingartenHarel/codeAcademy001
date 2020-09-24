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

        }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
   
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
    
    // add event listener for right click
    rightClickSetEvent('.cell');
}



function renderCell(location, value, color) {   // location such as: {i: 2, j: 7}
    // Select the elCell and set the value
    //console.log('location', location)
    var elCell = document.querySelector(`#cell-${location.i}${location.j}`);
    //var elCell = document.querySelector('#cell-10');
   
    showCell(elCell, location);
 }

function showCell(elCell, location) {
    //console.log('elCell', elCell)
    //console.log('location', location)
    var i = location.i;
    var j = location.j;
    //console.log('gBoard[i][j].isShown =', gBoard[i][j].isShown)
    
   if (!gBoard[i][j].isShown) {
       //console.table('isShown = false toggle true');
       gBoard[i][j].isShown = true;
       //console.log('gBoard[i][j.minesAroundCount', gBoard[i][j].minesAroundCount);
       checkCell(elCell, location); // check cell state
       toggleShowHideClasses(elCell, gClassesBevel);
       gGame.markedCount++
   } else {
       //console.table('isShown = true toggle false');
       gBoard[i][j].isShown = false;
       toggleShowHideClasses(elCell, gClassesBevel);
       //elCell.innerHTML = '';
   }

}

function checkCell(elCell, location) { // check game on click
    console.log('check cell');
    console.log('click on elCell', elCell, 'location', location);
    
    var i = location.i;
    var j = location.j;

    if (gBoard[i][j].isMine) { // check if mine
        console.log('mine')
        elCell.innerHTML = '&#x1f4a3;';
        gBoard[i][j].isEmpty = false;
        gLevel.LIVES--
        createLives(true);
        console.log('gLevel.LIVES', gLevel.LIVES)

    } else if (gBoard[i][j].minesAroundCount > 0) {  // check if count > 0
        console.log('minesAroundCount > 0')
        elCell.innerHTML = gBoard[i][j].minesAroundCount;
        gBoard[i][j].isEmpty = false;

    } else if (gBoard[i][j].isMarked) {
        console.log('marked')

    } else {  // check if empty
        console.log('empty')
        //console.log('countNeighbors(i, j, gBoard)', countNeighbors(i, j, gBoard))
        //toggleShowHideClasses(elCell)
        elCell.innerHTML = '';
        var nbrs = checkNbrs();
        
        var resRecorsive;
        function checkNbrs() { // recorsive check neighbores
            var cellI = location.i;
            var cellJ = location.j;
            console.log('start recorsive');
            var res;
            res = (countNeighbors(cellI, cellJ, gBoard));
            console.log('continue recorsive', res);
            if (res.length > 0) {
               
                for (var i = 0; i < res.length; i++) {
                     console.log('continue recorsive', res);
                    cellI = res[i].dataset.i;
                    cellJ = res[i].dataset.j;
                    resRecorsive = countNeighbors(cellI, cellJ, gBoard)
                    console.log('resRecorsive', resRecorsive);
                    for (var j = 0; j < resRecorsive.length; j++) {
                        //res.push(resRecorsive[j]);
                    }
                }
            } 
            return res;
        }
        console.log('nbrs after recorsive', nbrs)
        resRecorsive.forEach(showNbrs)
        //console.log('nbrs', nbrs)
        

    }
}



function showNbrs(item, index, arr) {
    //console.log('showNbrs gNbrsChecked=', gNbrsChecked)
    //console.log('gBoard.length- 1', gTotalCells )
    //arr[index] = item * 10;
    var i = item.dataset.i;
    var j = item.dataset.j;
    console.log('show Nbrs item', item, i, j)
    gBoard[i][j].isShown = true;

    console.log('item.classList', item.classList)
    if (!item.classList.contains('innerBevel')) {
        toggleShowHideClasses(item, gClassesBevel);
        gGame.shownCount++
    }

    console.log('gBoard[i][j].minesAroundCount ', gBoard[i][j].minesAroundCount ,)
    if (gBoard[i][j].minesAroundCount > 0) {
        console.log('bigger then 0 ', gBoard[i][j].minesAroundCount)
        item.innerHTML = gBoard[i][j].minesAroundCount;

    }
    console.log('gNbrsChecked ', gNbrsChecked)
    
    //item.innerHTML = "test";
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

function countNeighbors(cellI, cellJ, mat) {
    console.log('countNBRStimes', cellI, cellJ)

    var neighborsSum = 0;
    var neighbors = [];

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue; // check for board borders rows
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue; // check for board borders cols
            if (i === cellI && j === cellJ) continue; // skip current cell
            //console.log(mat[i][j])
            //  && mat[i][j].minesAroundCount === 0
            if (mat[i][j].isMine === false && mat[i][j].isMarked === false && mat[i][j].isShown === false ) {
                //console.log(mat[i][j])
                var elCell = document.querySelector(`#cell-${i}${j}`);
                console.log(elCell)
                neighborsSum++;
                neighbors.push(elCell);
                gNbrsChecked++
            }
        }
        
        //if (neighbors.length > 0) {
        //    //countNeighbors(neighbors[1].i, neighbors[].j, neighbors)
        //}
    }
    console.log('neighbors.length', neighbors.length, 'neighbors', neighbors)
    return neighbors
}


function toggleShowHideClasses(elCell, classes) {
    //console.log('toggleShowHideClasses before toggle', elCell, 'classes',classes )
    var selector;
    for (var i = 0; i < classes.length; i++) {
        selector = classes[i];
        //console.log(' selector', selector)
        elCell.classList.toggle(selector);
    }

}

function randomColor() {
    var color = "";
    for (var i = 0; i < 3; i++) {
        color += getRandomIntInclusive(0, 255) + ',';
    }
    color = color.slice(1, -1);
    return color;
}

var gTimer = {
    functionTimer: function(selector)  {
        clearInterval(gGameTimer);
        console.log('start timer')
        var t0;
        var t1;
        var millis;
        var secondElapsed = 0;
        var elem = document.querySelector(selector);
        t0 = performance.now();
        gGameTimer = setInterval(function () { t1 = performance.now(), update() }, 1000);
       
        function update() {
            millis = t1 - t0;
            secondElapsed = Math.floor(millis / 1000);
            elem.innerHTML = secondElapsed;
        }
    }

}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}