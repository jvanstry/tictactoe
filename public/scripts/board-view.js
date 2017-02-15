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
