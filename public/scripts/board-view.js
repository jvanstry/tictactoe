var X_CLASS_NAME = 'x';
var O_CLASS_NAME = 'o';


exports.boardDOM = document.getElementById('board');
exports.markWinner = function(turnInfo){
  var idToAdd, y1, x1, y2, x2;

  switch (turnInfo.winType){
    case 'horizontal':
      idToAdd = 'horizontal-or-vertical-drawtime';
      y1 = 77 + turnInfo.row * 150;
      x1 = 0;
      y2 = y1;
      x2 = 450;
      break;
    case 'vertical':
      idToAdd = 'horizontal-or-vertical-drawtime';
      y1 = 0;
      x1 = 77 + turnInfo.column * 150;
      y2 = 450
      x2 = x1;
      break;
    case 'top-left-bottom-right':
      idToAdd = 'diagonal-drawtime';
      y1 = 0;
      x1 = 0;
      y2 = 450;
      x2 = 450;
      break;
    case 'top-right-bottom-left':
      idToAdd = 'diagonal-drawtime';
      y1 = 0;
      x1 = 450;
      y2 = 450;
      x2 = 0;
      break;
  }
  
  var lineDOMElement = document.getElementsByTagName('line')[0];
  lineDOMElement.id = idToAdd;
  lineDOMElement.setAttribute('y1', y1);
  lineDOMElement.setAttribute('x1', x1);
  lineDOMElement.setAttribute('y2', y2);
  lineDOMElement.setAttribute('x2', x2);

  setTimeout(function(){
    lineDOMElement.id = '';
  }, 4400);
}
exports.markSelection = function(row, col, selectionIsX){
  var spotIndex = row * 3 + col;
  var selectionPieceClassName = selectionIsX ? X_CLASS_NAME : O_CLASS_NAME;
  var selectedSpot = document.querySelectorAll('td')[spotIndex];

  selectedSpot.classList.remove('open');
  selectedSpot.classList.add(selectionPieceClassName);
  selectedSpot.classList.add('taken');
}
exports.markCatsGame = function(){
  var pathDOMElement = document.getElementsByTagName('path')[0];
  pathDOMElement.id = 'cats-drawtime';
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
