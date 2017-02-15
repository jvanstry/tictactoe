(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var X_CLASS_NAME = 'x';
var O_CLASS_NAME = 'o';

var BOARD_SIZE_ID_MAP = {
  3: '3by3board',
  4: '4by4board'
}

exports.showBoardWithDimensions = function(dimensions){
  var id = BOARD_SIZE_ID_MAP[dimensions];

  document.getElementById(id).style.display = 'inline-block';
}

exports.markWinner = function(turnInfo, boardDimensions){
  var idToAdd, y1, x1, y2, x2;

  switch (turnInfo.winType){
    case 'horizontal':
      idToAdd = 'horizontal-or-vertical-drawtime';
      y1 = 87 + turnInfo.row * 150;
      x1 = 20;
      y2 = y1;
      x2 = 150 * boardDimensions + 20;
      break;
    case 'vertical':
      idToAdd = 'horizontal-or-vertical-drawtime';
      y1 = 10;
      x1 = 97 + turnInfo.column * 150;
      y2 = 150 * boardDimensions + 10;
      x2 = x1;
      break;
    case 'top-left-bottom-right':
      idToAdd = 'diagonal-drawtime';
      y1 = 10;
      x1 = 20;
      y2 = 150 * boardDimensions + 10;
      x2 = 150 * boardDimensions + 20;
      break;
    case 'top-right-bottom-left':
      idToAdd = 'diagonal-drawtime';
      y1 = 10;
      x1 = 150 * boardDimensions + 20;
      y2 = 150 * boardDimensions + 30;
      x2 = 20;
      break;
  }
  var lineDOMElement;

  if(boardDimensions === 3){
    lineDOMElement = document.getElementsByTagName('line')[0];
  }else if(boardDimensions === 4){
    lineDOMElement = document.getElementsByTagName('line')[1];
  }
    
  lineDOMElement.id = idToAdd + boardDimensions;
  lineDOMElement.setAttribute('y1', y1);
  lineDOMElement.setAttribute('x1', x1);
  lineDOMElement.setAttribute('y2', y2);
  lineDOMElement.setAttribute('x2', x2);

  setTimeout(function(){
    lineDOMElement.id = '';
  }, 4400);
}

exports.addClickHandlerToBoardElement = function(handler, boardDimensions){
  var id = BOARD_SIZE_ID_MAP[boardDimensions];

  var boardDOMElement = document.getElementById(id);
  boardDOMElement.addEventListener('click', handler, false);
}

exports.removeClickHandlerFromBoardElement = function(handler, boardDimensions){
  var id = BOARD_SIZE_ID_MAP[boardDimensions];

  var boardDOMElement = document.getElementById(id);
  boardDOMElement.removeEventListener('click', handler, false);
}

exports.markSelection = function(row, col, selectionIsX, boardDimensions){
  var spotIndex = row * boardDimensions + col;

  if(boardDimensions === 4){
    spotIndex += 9;
  }

  var selectionPieceClassName = selectionIsX ? X_CLASS_NAME : O_CLASS_NAME;
  var selectedSpot = document.querySelectorAll('td')[spotIndex];

  selectedSpot.classList.remove('open');
  selectedSpot.classList.add(selectionPieceClassName);
  selectedSpot.classList.add('taken');
}

exports.markCatsGame = function(boardDimensions){
  var pathDOMElement;

  if(boardDimensions === 3){
    pathDOMElement = document.getElementsByTagName('path')[0];
  }else if(boardDimensions === 4){
    pathDOMElement = document.getElementsByTagName('path')[1];
  }

  pathDOMElement.id = 'cats-drawtime' + boardDimensions;

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
function Board(dimensions, emptyValue){
  this.spots = [];
  this.emptyValue = emptyValue;
  this.dimensions = dimensions;

  for(var i=0; i < dimensions; i++){
    this.spots.push([]);
  }

  this.setSpotsToEmpty();
}

Board.prototype.setSpotsToEmpty = function(){
  for(var i=0; i < this.dimensions; i++){
    for(var j=0; j < this.dimensions; j++){
      this.spots[i][j] = this.emptyValue;
    }
  }
}

Board.prototype.selectionMade = function(value, row, col){
  this.spots[row][col] = value;
}

Board.prototype.unmarkSelection = function(row, col){
  this.spots[row][col] = this.emptyValue;
}

module.exports = Board;
},{}],3:[function(require,module,exports){
var scoreTheBoard = require('./evaluator').determineBoardScore;
var helpers = require('./helpers');
var isRowTicTacToe = helpers.isRowTicTacToe;
var isColumnTicTacToe = helpers.isColumnTicTacToe;
var pieceWinValues;
var pieceIdentifier;

exports.determineSelection = function(board, numberOfMoves, pieceMap){
  pieceIdentifier = pieceMap;
  pieceWinValues = createPieceWinValuesObj(pieceIdentifier);
  var aWinningPlayIsPossible = numberOfMoves >= 4;
  var chosenMoveDetails;

  chosenMoveDetails = tryEachMoveToDetermineBest(board, numberOfMoves);

  board.selectionMade(pieceIdentifier.cpu, chosenMoveDetails.row, chosenMoveDetails.column);
  
  if(aWinningPlayIsPossible)
    chosenMoveDetails.winType = getWinTypeIfCpuHasWon(board);

  return chosenMoveDetails;
}

function tryEachMoveToDetermineBest(board, numberOfMoves){
  var gameBoard = board.spots;

  var bestMoveExpectedValue = -200;
  var bestMoveDetails = {};

  for (var row = 0; row < board.dimensions; row++){
    for (var column = 0; column < board.dimensions; column++){
      var spotIsEmpty = gameBoard[row][column] === pieceIdentifier.empty;

      if (spotIsEmpty){
        board.selectionMade(pieceIdentifier.cpu, row, column);

        var currentMoveExpectedValue = minimax(board, numberOfMoves + 1);
 
        board.unmarkSelection(row, column);

        if (currentMoveExpectedValue > bestMoveExpectedValue){
          bestMoveDetails.row = row;
          bestMoveDetails.column = column;
          bestMoveExpectedValue = currentMoveExpectedValue;
        }
      }
    }
  }

  return bestMoveDetails;
}

function createPieceWinValuesObj(pieceIdentifier){
  var pieceWinValues = {}
  pieceWinValues[pieceIdentifier.human] = -1;
  pieceWinValues[pieceIdentifier.cpu] = 1;

  return pieceWinValues;
}

function minimax(board, numberOfMoves, isCpusTurn){
  var gameBoard = board.spots;
  var score = scoreTheBoard(board, pieceWinValues);

  var playerWon = score === pieceWinValues[pieceIdentifier.human];
  var cpuWon = score === pieceWinValues[pieceIdentifier.cpu];
  var catsGame = numberOfMoves === Math.pow(board.dimensions, 2);

  if(playerWon || cpuWon || catsGame)
    return score;
  
  if(isCpusTurn){
    var bestScoreFound = -200;
    
    for (var row = 0; row < board.dimensions; row++){
      for (var column = 0; column < board.dimensions; column++){
        var spotIsEmpty = gameBoard[row][column] === pieceIdentifier.empty;

        if (spotIsEmpty){
          board.selectionMade(pieceIdentifier.cpu, row, column);
          
          bestScoreFound = Math.max(bestScoreFound, minimax(board, numberOfMoves + 1));

          board.unmarkSelection(row, column);
        }
      }
    }
    return bestScoreFound;

  }else{
    var bestScoreFound = 200;

    for (var row = 0; row < board.dimensions; row++){
      for (var column = 0; column < board.dimensions; column++){
        var spotIsEmpty = gameBoard[row][column] === pieceIdentifier.empty;

        if (spotIsEmpty){
          board.selectionMade(pieceIdentifier.human, row, column);
 
          bestScoreFound = Math.min(bestScoreFound, minimax(board, numberOfMoves + 1, true));

          board.unmarkSelection(row, column);
        }
      }
    }
    return bestScoreFound;
  }
}

function getWinTypeIfCpuHasWon(board){
  var gameBoard = board.spots;

  var leftToRightDiagonalSet = new Set();
  var rightToLeftDiagonalSet = new Set();


  for(var i=0; i < board.dimensions; i++){
    var rowIsTicTacToe = isRowTicTacToe(gameBoard[i]);
    var columnIsTicTacToe = isColumnTicTacToe(gameBoard, i);

    if(rowIsTicTacToe){
      return 'horizontal';
    }else if(columnIsTicTacToe){
      return 'vertical';
    }

    leftToRightDiagonalSet.add(gameBoard[i][i]);
    rightToLeftDiagonalSet.add(gameBoard[i][board.dimensions - i - 1])
  }

  var winnerExistsOnLeftToRightDiagonal = leftToRightDiagonalSet.size === 1 && !leftToRightDiagonalSet.has('');
  var winnerExistsOnRightToLeftDiagonal = rightToLeftDiagonalSet.size === 1 && !rightToLeftDiagonalSet.has('');

  if(winnerExistsOnLeftToRightDiagonal){
    return 'top-left-bottom-right';
  }else if(winnerExistsOnRightToLeftDiagonal){
    return 'top-right-bottom-left'; 
  }
}
},{"./evaluator":4,"./helpers":6}],4:[function(require,module,exports){
var helpers = require('./helpers');
var isRowTicTacToe = helpers.isRowTicTacToe;
var isColumnTicTacToe = helpers.isColumnTicTacToe;

exports.determineBoardScore = function(board, pieceWinValues){
  var gameBoard = board.spots;

  var leftToRightDiagonalSet = new Set();
  var rightToLeftDiagonalSet = new Set();

  for(var i=0; i < board.dimensions; i++){
    var rowIsTicTacToe = isRowTicTacToe(gameBoard[i]);
    var columnIsTicTacToe = isColumnTicTacToe(gameBoard, i);

    if(rowIsTicTacToe){
      if(gameBoard[i][0] === 'x'){
        return pieceWinValues['x'];
      }else if(gameBoard[i][0] === 'o'){
        return pieceWinValues['o'];
      }
    }else if(columnIsTicTacToe){
      if(gameBoard[0][i] === 'x'){
        return pieceWinValues['x'];
      }else if(gameBoard[0][i] === 'o'){
        return pieceWinValues['o'];
      }
    }

    leftToRightDiagonalSet.add(gameBoard[i][i]);
    rightToLeftDiagonalSet.add(gameBoard[i][board.dimensions - i - 1])
  }

  var winnerExistsOnLeftToRightDiagonal = leftToRightDiagonalSet.size === 1 && !leftToRightDiagonalSet.has('');
  var winnerExistsOnRightToLeftDiagonal = rightToLeftDiagonalSet.size === 1 && !rightToLeftDiagonalSet.has('');

  if(winnerExistsOnLeftToRightDiagonal){
    if(gameBoard[0][0] === 'x'){
      return pieceWinValues['x'];
    }else if(gameBoard[0][0] === 'o'){
      return pieceWinValues['o'];
    }
  }else if(winnerExistsOnRightToLeftDiagonal){
    if(gameBoard[0][board.dimensions - 1] === 'x'){
      return pieceWinValues['x'];
    }else if(gameBoard[0][board.dimensions - 1] === 'o'){
      return pieceWinValues['o'];
    }    
  }

  return 0;
}
},{"./helpers":6}],5:[function(require,module,exports){
var EMPTY_VALUE = '';
var O_VALUE = 'o';
var X_VALUE = 'x';

var Board = require('./board');
exports.board;
var boardView = require('./board-view');
exports.boardView = boardView;

var cpuBrain = require('./cpu');
var infoView = require('./info-view');
exports.infoView = infoView;

exports.humanIsX = true;
exports.firstGameOfSession = true;
exports.numberOfTurns = 0;
exports.boardDimensions;

exports.waitForBoardSizePreference = function waitForBoardSizePreference(){
  var gameSelectorContainerDOM = document.getElementById('game-size-selector');
  gameSelectorContainerDOM.addEventListener('click', showAppropriateBoard, false);

  function showAppropriateBoard(e){
    var selectedButtonText = e.target.value;

    if (selectedButtonText){
      exports.boardDimensions = parseInt(selectedButtonText[0]);

      gameSelectorContainerDOM.style.display = 'none';
      gameSelectorContainerDOM.removeEventListener('click', arguments.callee, false);

      document.getElementById('information').style.display = 'inline-block';
      exports.boardView.showBoardWithDimensions(exports.boardDimensions);

      exports.beginGame();
    }
  }
}

exports.beginGame = function beginGame(){
  exports.board = new Board(exports.boardDimensions, EMPTY_VALUE);

  if(exports.firstGameOfSession){
    exports.firstGameOfSession = false;
  }else{
    exports.infoView.flipPieceIds();
    exports.boardView.reset();
    exports.numberOfTurns = 0;
    exports.humanIsX = !exports.humanIsX;
  }

  // We have arbitrarily decided that X always goes first
  if (exports.humanIsX){
    exports.prepareForAndHandleHumanSelection(exports.runATurnForEachPlayer);
  }else{
    exports.runATurnForEachPlayer();
  }
}

exports.runATurnForEachPlayer = function runATurnForEachPlayer(){
  var isCatsGame = exports.checkForCatsGame();

  if(isCatsGame){
    exports.handleCatsGame();
    return;
  }

  var turnInfo = exports.getAndMarkCpuSelection();

  exports.numberOfTurns++;

  if(turnInfo.winType){
    exports.infoView.updateStatusText('CPU won... New game starting soon.');
    exports.boardView.markWinner(turnInfo, exports.boardDimensions);
    exports.kickOffCountdownToNewGame();
    return;
  }

  isCatsGame = exports.checkForCatsGame();

  if(isCatsGame){
    exports.handleCatsGame();
    return;
  }

  exports.prepareForAndHandleHumanSelection(exports.runATurnForEachPlayer);
}

exports.handleCatsGame = function handleCatsGame(){
  exports.boardView.markCatsGame(exports.board.dimensions);
  exports.infoView.updateStatusText('Cat\'s game! New game starting soon.' );
  exports.kickOffCountdownToNewGame();
}

exports.prepareForAndHandleHumanSelection = function prepareForAndHandleHumanSelection(cb){
  exports.infoView.updateStatusText('It\'s your turn!');

  exports.boardView.addClickHandlerToBoardElement(markUserSelectionIfValid, exports.boardDimensions);

  function markUserSelectionIfValid(e){
    var clickedSquare = e.target;

    if(clickedSquare.classList.contains('open')){
      var selectedRow = parseInt(clickedSquare.dataset.row);
      var selectedCol = parseInt(clickedSquare.dataset.column);

      exports.boardView.markSelection(selectedRow, selectedCol, exports.humanIsX, exports.board.dimensions);

      var humanPieceValue = exports.humanIsX ? X_VALUE : O_VALUE;
      exports.board.selectionMade(humanPieceValue, selectedRow, selectedCol);

      exports.numberOfTurns++;
      exports.boardView.removeClickHandlerFromBoardElement(arguments.callee, exports.boardDimensions);
      cb();
    }
  }
}

exports.getAndMarkCpuSelection = function getAndMarkCpuSelection(){
  exports.infoView.updateStatusText('Waiting on Mr. CPU to play.');

  var pieceIdentifier = {
    empty: EMPTY_VALUE, 
    human: exports.humanIsX ? X_VALUE : O_VALUE,
    cpu: exports.humanIsX ? O_VALUE : X_VALUE
  }

  var spotToTake = cpuBrain.determineSelection(exports.board, exports.numberOfTurns, pieceIdentifier);
  exports.board.selectionMade(pieceIdentifier.cpu, spotToTake.row, spotToTake.column);
  exports.boardView.markSelection(spotToTake.row, spotToTake.column, !exports.humanIsX, exports.board.dimensions);

  return spotToTake;
}

exports.kickOffCountdownToNewGame = function kickOffCountdownToNewGame(){
  setTimeout(function(){
    exports.beginGame();
  }, 4500)
}

exports.checkForCatsGame = function checkForCatsGame(){
  return exports.numberOfTurns === 9;
}


},{"./board":2,"./board-view":1,"./cpu":3,"./info-view":7}],6:[function(require,module,exports){
exports.isColumnTicTacToe = function(gameBoard, index){
  var boardIsFourDimensional = gameBoard[3] !== undefined;

  if(boardIsFourDimensional){
    return gameBoard[0][index] === gameBoard[1][index] && gameBoard[1][index] === gameBoard[2][index] 
      && gameBoard[2][index] === gameBoard[3][index] && gameBoard[0][index] != '';
  }else{
    return gameBoard[0][index] === gameBoard[1][index] && gameBoard[1][index] === gameBoard[2][index] && gameBoard[0][index] != '';
  }
}

exports.isRowTicTacToe = function(row){
  var boardIsFourDimensional = row[3] !== undefined;

  if(boardIsFourDimensional){
    return row[0] === row[1] && row[1] === row[2] && row[2] === row[3] && row[0] != '';
  }else{
    return row[0] === row[1] && row[1] === row[2] && row[0] != '';
  }
}
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
var gameController = require('./game-controller');

document.addEventListener("DOMContentLoaded", function() {
  gameController.waitForBoardSizePreference();
});
},{"./game-controller":5}]},{},[8]);
