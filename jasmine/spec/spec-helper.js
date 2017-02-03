var path = require('path');

exports.pathToSource = (path.join(__dirname, '../../public/scripts/'));

exports.getRandomTicTacToeBoardSpotIndex= function getRandomTicTacToeBoardSpotIndex(){
  min = Math.ceil(0);
  max = Math.floor(2);
  return Math.floor(Math.random() * 2);
}

exports.simulateClickOnId = function simulateClickOnId(id) {
  var event = new MouseEvent('click', {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
  var cb = document.getElementById(id); 
  var cancelled = !cb.dispatchEvent(event);
}