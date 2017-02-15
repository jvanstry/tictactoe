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