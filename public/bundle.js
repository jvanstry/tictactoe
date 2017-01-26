(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var X_CLASS_NAME = 'x';
var O_CLASS_NAME = 'o';
var BOARD_DOM_ID = 'board';

exports.boardDOM = document.getElementById(BOARD_DOM_ID);
exports.markWinner = function(turnInfo){
  var idToAdd, y1, x1, y2, x2;

  switch (turnInfo.winType){
    case 'horizontal':
      idToAdd = 'horizontal-or-vertical-drawtime';
      y1 = 77 + turnInfo.row * 150;
      x1 = 0;
      y2 = y1;
      x2 = 450;
      break;
    case 'vertical':
      idToAdd = 'horizontal-or-vertical-drawtime';
      y1 = 0;
      x1 = 77 + turnInfo.column * 150;
      y2 = 450
      x2 = x1;
      break;
    case 'top-left-bottom-right':
      idToAdd = 'diagonal-drawtime';
      y1 = 0;
      x1 = 0;
      y2 = 450;
      x2 = 450;
      break;
    case 'top-right-bottom-left':
      idToAdd = 'diagonal-drawtime';
      y1 = 0;
      x1 = 450;
      y2 = 450;
      x2 = 0;
      break;
  }
  
  var lineDOMElement = document.getElementsByTagName('line')[0];
  lineDOMElement.id = idToAdd;
  lineDOMElement.setAttribute('y1', y1);
  lineDOMElement.setAttribute('x1', x1);
  lineDOMElement.setAttribute('y2', y2);
  lineDOMElement.setAttribute('x2', x2);

  setTimeout(function(){
    lineDOMElement.id = '';
  }, 4400);
}

exports.addClickHandlerToBoardElement = function(handler){
  var boardDOMElement = document.getElementById(BOARD_DOM_ID);
  boardDOMElement.addEventListener('click', handler, false);
}

exports.removeClickHandlerFromBoardElement = function(handler){
  var boardDOMElement = document.getElementById(BOARD_DOM_ID);
  boardDOMElement.removeEventListener('click', handler, false);
}

exports.markSelection = function(row, col, selectionIsX){
  var spotIndex = row * 3 + col;
  var selectionPieceClassName = selectionIsX ? X_CLASS_NAME : O_CLASS_NAME;
  var selectedSpot = document.querySelectorAll('td')[spotIndex];

  selectedSpot.classList.remove('open');
  selectedSpot.classList.add(selectionPieceClassName);
  selectedSpot.classList.add('taken');
}
exports.markCatsGame = function(){
  var pathDOMElement = document.getElementsByTagName('path')[0];
  pathDOMElement.id = 'cats-drawtime';
  setTimeout(function(){
    pathDOMElement.id = '';
  }, 4400);
}
exports.reset = function(){
  var spotDOMElements = document.querySelectorAll('td');

  for(var i = 0; i < spotDOMElements.length; i++){
    var currentSpot = spotDOMElements[i];

    currentSpot.classList.remove(O_CLASS_NAME);
    currentSpot.classList.remove(X_CLASS_NAME);
    currentSpot.classList.add('open');
    currentSpot.classList.remove('taken');
  }
}

},{}],2:[function(require,module,exports){
exports.spots =  [[], [], []];
exports.resetSpots = function(emptyValue){
  this.spots = [[emptyValue, emptyValue, emptyValue], 
                [emptyValue, emptyValue, emptyValue], 
                [emptyValue, emptyValue, emptyValue]]
}
exports.selectionMade = function(value, row, col){
  this.spots[row][col] = value;
}
},{}],3:[function(require,module,exports){
exports.determineSelection = function(board, pieceValues, numberOfTurns){
  var spot = {};

  // first cover basic 1st or 2nd move strategy
  var isFirstMoveOrHumanHasTakenCenter = numberOfTurns === 0 || numberOfTurns === 1 && board[1][1] !== pieceValues.empty;
  var isSecondMoveAndCenterIsOpen = numberOfTurns === 1 && board[1][1] === pieceValues.empty;
  var isFourthMoveAndHumanHasOpposingCorners = numberOfTurns === 3 
    && (
        (board[0][0] === pieceValues.human && board[2][2] === pieceValues.human)
        || (board[0][2] === pieceValues.human && board[2][0] === pieceValues.human)
       );

  if (isFirstMoveOrHumanHasTakenCenter){
    spot.row = 0;
    spot.column = 0;
  }else if (isSecondMoveAndCenterIsOpen){
    spot.row = 1;
    spot.column = 1;
  }else if (isFourthMoveAndHumanHasOpposingCorners){
    spot.row = 0;
    spot.column = 1;
  }

  if(spot.row !== undefined)
    return spot;

  // now check if we can win
  var winningInfo = checkLinesForDesiredSum(pieceValues.cpu + pieceValues.cpu + pieceValues.empty, board);

  if(winningInfo){
    var spot = determineProperSpotToBlockOrWin(winningInfo, pieceValues, board);
    spot.winType = winningInfo.winType;
    return spot;
  }

  // now block if they can win
  var blockingInfo = checkLinesForDesiredSum(pieceValues.human + pieceValues.human + pieceValues.empty, board);

  if(blockingInfo){
    return determineProperSpotToBlockOrWin(blockingInfo, pieceValues, board);
  }

  // otherwise just find first empty spot and take it
  for(var i = 0; i < 3; i++){
    if (board[i][0] === pieceValues.empty){
      spot.row = i;
      spot.column = 0;
    }else if(board[i][1] === pieceValues.empty){
      spot.row = i;
      spot.column = 1;
    }else if(board[i][2] === pieceValues.empty){
      spot.row = i;
      spot.column = 2;
    }

    if(spot.row !== undefined)
      return spot;
  }
}


function checkLinesForDesiredSum(sum, board){
  for(var i = 0; i < 3; i++){
    var horizontalSum = board[i].reduce(function(sum, element){ return sum + element }, 0);

    if(horizontalSum === sum)
      return {winType: 'horizontal', row: i}

    var verticalSum = board[0][i] + board[1][i] + board[2][i];

    if(verticalSum === sum)
      return {winType: 'vertical', column: i}
  }

  var topLeftToBottomRightSum = board[0][0] + board[1][1] + board[2][2];

  if(topLeftToBottomRightSum === sum)
    return {winType: 'top-left-bottom-right'}

  var topRightToBottomLeftSum = board[0][2] + board[1][1] + board[2][0];

  if(topRightToBottomLeftSum === sum)
    return {winType: 'top-right-bottom-left'}
}

function determineProperSpotToBlockOrWin(relevantLineInfo, pieceValues, board){
  var spot = {};

  switch(relevantLineInfo.winType){
    case 'horizontal':
      spot.row = relevantLineInfo.row;

      if (board[relevantLineInfo.row][0] === pieceValues.empty){
        spot.column = 0;
      }else if(board[relevantLineInfo.row][1] === pieceValues.empty){
        spot.column = 1;
      }else{
        spot.column = 2;
      }

      break;
    case 'vertical':
      spot.column = relevantLineInfo.column;

      if (board[0][relevantLineInfo.column] === pieceValues.empty){
        spot.row = 0;
      }else if(board[1][relevantLineInfo.column] === pieceValues.empty){
        spot.row = 1;
      }else{
        spot.row = 2;
      }

      break;
    case 'top-left-bottom-right':

      if (board[0][0] === pieceValues.empty){
        spot.row = 0;
        spot.column = 0;
      }else if(board[1][1] === pieceValues.empty){
        spot.row = 1;
        spot.column = 1;
      }else{
        spot.row = 2;
        spot.column = 2;
      }

      break;
    case 'top-right-bottom-left':

      if (board[0][2] === pieceValues.empty){
        spot.row = 0;
        spot.column = 2;
      }else if(board[1][1] === pieceValues.empty){
        spot.row = 1;
        spot.column = 1;
      }else{
        spot.row = 2;
        spot.column = 0;
      }

      break;
  }
  return spot;
}
},{}],4:[function(require,module,exports){
// Empty spaces represented by -10, X's are represented by ones, and O's by zeroes
var EMPTY_VALUE = -10;
var O_VALUE = 0;
var X_VALUE = 1;

var board = require('./board');
var boardView = require('./board-view');
exports.boardView = boardView;

var cpuBrain = require('./cpu');
var infoView = require('./info-view');
exports.infoView = infoView;

var humanIsX = true;
var firstGameOfSession = true;
var numberOfTurns = 0;

exports.beginGame = function beginGame(){
  board.resetSpots(EMPTY_VALUE);

  if(firstGameOfSession){
    firstGameOfSession = false;
  }else{
    exports.infoView.flipPieceIds();
    exports.boardView.reset();
    numberOfTurns = 0;
    humanIsX = !humanIsX;
  }

  // We have arbitrarily decided that X always goes first
  if (humanIsX){
    exports.humansTurn(exports.runGame);
  }else{
    exports.runGame();
  }
}

exports.runGame = function runGame(){
  var isCatsGame = checkForCatsGame();

  if(isCatsGame){
    exports.handleCatsGame();
    return;
  }

  var turnInfo = exports.cpusTurn();
  numberOfTurns++;

  if(turnInfo.winType){
    exports.infoView.updateStatusText('CPU won... New game starting soon.');
    exports.boardView.markWinner(turnInfo);
    exports.startNewGame();
    return;
  }

  isCatsGame = checkForCatsGame();

  if(isCatsGame){
    exports.handleCatsGame();
    return;
  }

  exports.humansTurn(exports.runGame);
}

exports.handleCatsGame = function handleCatsGame(){
  exports.boardView.markCatsGame();
  exports.infoView.updateStatusText('Cat\'s game! New game starting soon.' );
  exports.startNewGame();
}

exports.humansTurn = function humansTurn(cb){
  exports.infoView.updateStatusText('It\'s your turn!');

  exports.boardView.addClickHandlerToBoardElement(handleUserSelection);

  function handleUserSelection(e){
    var clickedSquare = e.target;

    if(clickedSquare.classList.contains('open')){
      var selectedRow = parseInt(clickedSquare.dataset.row);
      var selectedCol = parseInt(clickedSquare.dataset.column);

      exports.boardView.markSelection(selectedRow, selectedCol, humanIsX);

      var humanPieceValue = humanIsX ? X_VALUE : O_VALUE;
      board.selectionMade(humanPieceValue, selectedRow, selectedCol);

      numberOfTurns++;
      exports.boardView.removeClickHandlerFromBoardElement(arguments.callee);
      cb();
    }
  }
}

exports.cpusTurn = function cpusTurn(){
  exports.infoView.updateStatusText('Waiting on Mr. CPU to play.');

  var pieceValuesOnBoard = {
    empty: EMPTY_VALUE, 
    human: humanIsX ? X_VALUE : O_VALUE,
    cpu: humanIsX ? O_VALUE : X_VALUE
  }

  var spotToTake = cpuBrain.determineSelection(board.spots, pieceValuesOnBoard, numberOfTurns);

  board.selectionMade(pieceValuesOnBoard.cpu, spotToTake.row, spotToTake.column);
  exports.boardView.markSelection(spotToTake.row, spotToTake.column, !humanIsX);
  return spotToTake;
}

exports.startNewGame = function startNewGame(){
  setTimeout(function(){
    exports.beginGame();
  }, 4500)
}

function checkForCatsGame(){
  return numberOfTurns === 9;
}


},{"./board":2,"./board-view":1,"./cpu":3,"./info-view":5}],5:[function(require,module,exports){
exports.flipPieceIds = function(){
  var xIdentifierDisplayDOM = document.getElementById('x-id');
  var oIdentifierDisplayDOM = document.getElementById('o-id');

  var oldOText = oIdentifierDisplayDOM.innerText;
  oIdentifierDisplayDOM.innerText = 'O' + xIdentifierDisplayDOM.innerText.substring(1);
  xIdentifierDisplayDOM.innerText = 'X' + oldOText.substring(1);
}

exports.updateStatusText = function(statusText){
  var statusDisplayDOM = document.getElementById('status');

  statusDisplayDOM.textContent = statusText;
}
},{}],6:[function(require,module,exports){
var gameController = require('./game-controller');

document.addEventListener("DOMContentLoaded", function() {
  gameController.beginGame();
});
},{"./game-controller":4}]},{},[6]);
