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

