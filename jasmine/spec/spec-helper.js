var path = require('path');

exports.pathToSource = (path.join(__dirname, '../../public/scripts/'));

exports.getRandomIntBetween = function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}