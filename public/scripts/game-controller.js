var EMPTY_VALUE = -10;
var O_VALUE = 0;
var X_VALUE = 1;
exports.BOARD_DOM_ID = 'board';

var board = require('./board');
exports.board = board;
var boardView = require('./board-view');
exports.boardView = boardView;

var cpuBrain = require('./cpu');
var infoView = require('./info-view');
exports.infoView = infoView;

exports.humanIsX = true;
exports.firstGameOfSession = true;
exports.numberOfTurns = 0;

exports.beginGame = function beginGame(){
  exports.board.resetSpots(EMPTY_VALUE);

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
    exports.prepareForReceiveAndHandleHumanSelection(exports.runATurnForEachPlayer);
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
    exports.boardView.markWinner(turnInfo);
    exports.kickOffCountdownToNewGame();
    return;
  }

  isCatsGame = exports.checkForCatsGame();

  if(isCatsGame){
    exports.handleCatsGame();
    return;
  }

  exports.prepareForReceiveAndHandleHumanSelection(exports.runATurnForEachPlayer);
}

exports.handleCatsGame = function handleCatsGame(){
  exports.boardView.markCatsGame();
  exports.infoView.updateStatusText('Cat\'s game! New game starting soon.' );
  exports.kickOffCountdownToNewGame();
}

exports.prepareForReceiveAndHandleHumanSelection = function prepareForReceiveAndHandleHumanSelection(cb){
  exports.infoView.updateStatusText('It\'s your turn!');

  exports.boardView.addClickHandlerToBoardElement(markUserSelectionIfValid, exports.BOARD_DOM_ID);

  function markUserSelectionIfValid(e){
    var clickedSquare = e.target;

    if(clickedSquare.classList.contains('open')){
      var selectedRow = parseInt(clickedSquare.dataset.row);
      var selectedCol = parseInt(clickedSquare.dataset.column);

      exports.boardView.markSelection(selectedRow, selectedCol, exports.humanIsX);

      var humanPieceValue = exports.humanIsX ? X_VALUE : O_VALUE;
      exports.board.selectionMade(humanPieceValue, selectedRow, selectedCol);

      exports.numberOfTurns++;
      exports.boardView.removeClickHandlerFromBoardElement(arguments.callee, exports.BOARD_DOM_ID);
      cb();
    }
  }
}

exports.getAndMarkCpuSelection = function getAndMarkCpuSelection(){
  exports.infoView.updateStatusText('Waiting on Mr. CPU to play.');

  var pieceValuesOnBoard = {
    empty: EMPTY_VALUE, 
    human: exports.humanIsX ? X_VALUE : O_VALUE,
    cpu: exports.humanIsX ? O_VALUE : X_VALUE
  }

  var spotToTake = cpuBrain.determineSelection(exports.board.spots, pieceValuesOnBoard, exports.numberOfTurns);

  exports.board.selectionMade(pieceValuesOnBoard.cpu, spotToTake.row, spotToTake.column);
  exports.boardView.markSelection(spotToTake.row, spotToTake.column, !exports.humanIsX);
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

