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

