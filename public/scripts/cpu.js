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