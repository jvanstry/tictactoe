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