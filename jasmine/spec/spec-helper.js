var path = require('path');

exports.pathToSource = (path.join(__dirname, '../../public/scripts/'));

exports.getRandomTicTacToeBoardSpotIndex= function getRandomTicTacToeBoardSpotIndex(){
  min = Math.ceil(0);
  max = Math.floor(2);
  return Math.floor(Math.random() * 2);
}