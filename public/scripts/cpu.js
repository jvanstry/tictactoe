exports.determineSelection = function(board, pieceValues, numberOfTurns){
  var spot = {}

  if (numberOfTurns === 1 || numberOfTurns === 3){
    spot = selectSpotInSpecialSecondOrFourthMoveSituations(board, pieceValues, numberOfTurns);
  }

  if(spot.row !== undefined)
    return spot;

  if (numberOfTurns >= 3){
    spot = selectWinningSpotIfPossibleOrBlockingSpotIfNecessary(pieceValues, board);
  }

  if(spot.row !== undefined)
    return spot;

  return selectFirstAvailableSpot(pieceValues, board);
}

function selectSpotInSpecialSecondOrFourthMoveSituations(board, pieceValues, numberOfTurns){
  var spot = {};

  var isSecondMoveAndCenterIsOpen = numberOfTurns === 1 && board[1][1] === pieceValues.empty;
  var isFourthMoveAndHumanHasOpposingCorners = numberOfTurns === 3 
    && (
        (board[0][0] === pieceValues.human && board[2][2] === pieceValues.human)
        || (board[0][2] === pieceValues.human && board[2][0] === pieceValues.human)
       );

  if (isSecondMoveAndCenterIsOpen){
    spot.row = 1;
    spot.column = 1;
  }else if (isFourthMoveAndHumanHasOpposingCorners){
    spot.row = 0;
    spot.column = 1;
  }

  return spot;
}

function selectWinningSpotIfPossibleOrBlockingSpotIfNecessary(pieceValues, board){
  var spot = {}

  var lineSumIndicatingPotentialWin = pieceValues.cpu + pieceValues.cpu + pieceValues.empty;
  var lineSumIndicatingPotentialLoss = pieceValues.human + pieceValues.human + pieceValues.empty;
  var sumsOfInterest = [lineSumIndicatingPotentialWin, lineSumIndicatingPotentialLoss];

  var lookingForBlock = false; //first time through will be looking for a win, need to unset winType on spot obj when looking for block

  for(var i = 0; i < 2; i++){
    var matchedLine = checkLinesForDesiredSum(sumsOfInterest[i], board);

    if (matchedLine){
      spot = determineProperSpotToBlockOrWin(matchedLine, pieceValues, board);
      if (lookingForBlock){
        spot.winType = undefined;
      }

      return spot;
    }

    lookingForBlock = true;
  }
  return spot;
  /*
  OLD, pre-abstracted way of achieving the same thing as above.
  I hate committing commented code but I left it in here for ease of comparison if desired.


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
  */
}

function selectFirstAvailableSpot(pieceValues, board){
  var spot = {};

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
  switch(relevantLineInfo.winType){
    case 'horizontal':

      if (board[relevantLineInfo.row][0] === pieceValues.empty){
        relevantLineInfo.column = 0;
      }else if(board[relevantLineInfo.row][1] === pieceValues.empty){
        relevantLineInfo.column = 1;
      }else{
        relevantLineInfo.column = 2;
      }

      break;
    case 'vertical':

      if (board[0][relevantLineInfo.column] === pieceValues.empty){
        relevantLineInfo.row = 0;
      }else if(board[1][relevantLineInfo.column] === pieceValues.empty){
        relevantLineInfo.row = 1;
      }else{
        relevantLineInfo.row = 2;
      }

      break;
    case 'top-left-bottom-right':

      if (board[0][0] === pieceValues.empty){
        relevantLineInfo.row = 0;
        relevantLineInfo.column = 0;
      }else if(board[1][1] === pieceValues.empty){
        relevantLineInfo.row = 1;
        relevantLineInfo.column = 1;
      }else{
        relevantLineInfo.row = 2;
        relevantLineInfo.column = 2;
      }

      break;
    case 'top-right-bottom-left':

      if (board[0][2] === pieceValues.empty){
        relevantLineInfo.row = 0;
        relevantLineInfo.column = 2;
      }else if(board[1][1] === pieceValues.empty){
        relevantLineInfo.row = 1;
        relevantLineInfo.column = 1;
      }else{
        relevantLineInfo.row = 2;
        relevantLineInfo.column = 0;
      }

      break;
  }
  return relevantLineInfo;
}