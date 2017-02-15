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