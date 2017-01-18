// Empty spaces represented by -10, X's are represented by ones, and O's by zeroes
var EMPTY_VALUE = -10;
var O_VALUE = 0;
var X_VALUE = 1;

var board = require('./board');
var boardView = require('./board-view');
var cpuBrain = require('./cpu');
var infoView = require('./info-view');

var humanIsX = true;
var firstGameOfSession = true;
var numberOfTurns = 0;

document.addEventListener("DOMContentLoaded", function() {
  beginGame();
});

function beginGame(){
  board.resetSpots(EMPTY_VALUE);

  if(firstGameOfSession){
    firstGameOfSession = false;
  }else{
    infoView.flipPieceIds();
    boardView.reset();
    numberOfTurns = 0;
    humanIsX = !humanIsX;
  }

  // We have arbitrarily decided that X always goes first
  if (humanIsX){
    humansTurn(runGame);
  }else{
    runGame();
  }
}

function runGame(){
  var isCatsGame = checkForCatsGame();

  if(isCatsGame){
    handleCatsGame();
    return;
  }

  var turnInfo = cpusTurn();
  numberOfTurns++;

  if(turnInfo.winType){
    infoView.updateStatusText('CPU won... New game starting soon.');
    boardView.markWinner(turnInfo);
    startNewGame();
    return;
  }

  isCatsGame = checkForCatsGame();

  if(isCatsGame){
    handleCatsGame();
    return;
  }

  humansTurn(runGame);
}

function handleCatsGame(){
  boardView.markCatsGame();
  infoView.updateStatusText('Cat\'s game! New game starting soon.' );
  startNewGame();
}

function humansTurn(cb){
  infoView.updateStatusText('It\'s your turn!');

  var boardDOMElement = document.getElementById('board');
  boardDOMElement.addEventListener('click', handleUserSelection, false);

  function handleUserSelection(e){
    var clickedSquare = e.target;

    if(clickedSquare.classList.contains('open')){
      var selectedRow = parseInt(clickedSquare.dataset.row);
      var selectedCol = parseInt(clickedSquare.dataset.column);

      boardView.markSelection(selectedRow, selectedCol, humanIsX);

      var humanPieceValue = humanIsX ? X_VALUE : O_VALUE;
      board.selectionMade(humanPieceValue, selectedRow, selectedCol);

      numberOfTurns++;
      boardDOMElement.removeEventListener(e.type, arguments.callee, false);
      cb();
    }
  }
}

function cpusTurn(){
  infoView.updateStatusText('Waiting on Mr. CPU to play.');

  var pieceValuesOnBoard = {
    empty: EMPTY_VALUE, 
    human: humanIsX ? X_VALUE : O_VALUE,
    cpu: humanIsX ? O_VALUE : X_VALUE
  }

  var spotToTake = cpuBrain.determineSelection(board.spots, pieceValuesOnBoard, numberOfTurns);

  board.selectionMade(pieceValuesOnBoard.cpu, spotToTake.row, spotToTake.column);
  boardView.markSelection(spotToTake.row, spotToTake.column, !humanIsX);
  return spotToTake;
}

function startNewGame(){
  setTimeout(function(){
    beginGame();
  }, 4500)
}

function checkForCatsGame(){
  return numberOfTurns === 9;
}

