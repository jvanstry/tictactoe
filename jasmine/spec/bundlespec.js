(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var specHelper = require('./spec-helper');
var board = require('./../../public/scripts/board');


exports.runSpecs = function(){
  describe('The Board', function(){
    afterEach(function(){
      board.spots = [[],[],[]];
    })

    it('should represent tic tac toe board with 2d array', function(){
      var randomNumber = specHelper.getRandomIntBetween(0, 2);

      expect(Array.isArray(board.spots[randomNumber])).toBeTruthy(); 
    });

    it('should reset 2d array to passed value with resetSpots', function(){
      var emptyValue = 10;

      board.resetSpots(emptyValue);

      var randomNumber1 = specHelper.getRandomIntBetween(0, 2);
      var randomNumber2 = specHelper.getRandomIntBetween(0, 2);

      expect(board.spots[randomNumber1][randomNumber2]).toEqual(emptyValue);
    });

    it('should set value in spots array with selectionMade', function(){
      var setValue = 25;
      var randomNumber1 = specHelper.getRandomIntBetween(0, 2);
      var randomNumber2 = specHelper.getRandomIntBetween(0, 2);

      board.selectionMade(setValue, randomNumber1, randomNumber2);

      expect(board.spots[randomNumber1][randomNumber2]).toEqual(setValue);
    })
  });
}

},{"./../../public/scripts/board":9,"./spec-helper":4}],2:[function(require,module,exports){
var specHelper = require('./spec-helper');
var cpu = require('./../../public/scripts/cpu');
var board = require('./../../public/scripts/board');
var pieceValues = {
  empty: -10,
  human: 0,
  cpu: 1
}

exports.runSpecs = function(){
  beforeEach(function(){
    board.spots = [[pieceValues.empty, pieceValues.empty, pieceValues.empty],
                   [pieceValues.empty, pieceValues.empty, pieceValues.empty],
                   [pieceValues.empty, pieceValues.empty, pieceValues.empty]];
  })

  describe('The Cpu Brain', function(){
    it('should take corner spot on first move', function(){
      var numberOfPreviousTurns = 0;
      var spotSelected = cpu.determineSelection(board, pieceValues, numberOfPreviousTurns);

      expect(spotSelected.row).toEqual(0);
      expect(spotSelected.column).toEqual(0); 
    });

    it('should take middle if available on 2nd move', function(){
      var numberOfPreviousTurns = 1;
      var rowOfPreviousSelection = 0
      var columnOfPreviousSelection = 0;

      board.selectionMade(pieceValues.human, rowOfPreviousSelection, columnOfPreviousSelection);
      var spotSelected = cpu.determineSelection(board.spots, pieceValues, numberOfPreviousTurns);

      expect(spotSelected.row).toEqual(1);
      expect(spotSelected.column).toEqual(1);
    });

    it('should take top left corner on 2nd move if middle is taken', function(){
      var numberOfPreviousTurns = 1;
      var rowOfPreviousSelection = 1
      var columnOfPreviousSelection = 1;

      board.selectionMade(pieceValues.human, rowOfPreviousSelection, columnOfPreviousSelection);
      var spotSelected = cpu.determineSelection(board.spots, pieceValues, numberOfPreviousTurns);

      expect(spotSelected.row).toEqual(0);
      expect(spotSelected.column).toEqual(0);      
    });

    it('should play winning move if available', function(){
      var numberOfPreviousTurns = 4;

      board.spots = [[pieceValues.cpu, pieceValues.human, pieceValues.human], 
                     [pieceValues.empty, pieceValues.cpu, pieceValues.empty], 
                     [pieceValues.empty, pieceValues.empty, pieceValues.empty]]


      var spotSelected = cpu.determineSelection(board.spots, pieceValues, numberOfPreviousTurns);

      expect(spotSelected.row).toEqual(2);
      expect(spotSelected.column).toEqual(2);  
    });

    it('should play winning move if both block and win are available', function(){
      var numberOfPreviousTurns = 4;

      board.spots = [[pieceValues.human, pieceValues.cpu, pieceValues.empty], 
                     [pieceValues.human, pieceValues.cpu, pieceValues.empty], 
                     [pieceValues.empty, pieceValues.empty, pieceValues.empty]]


      var spotSelected = cpu.determineSelection(board.spots, pieceValues, numberOfPreviousTurns);

      expect(spotSelected.row).toEqual(2);
      expect(spotSelected.column).toEqual(1);  
    });

    it('should play blocking move if needed and no win available', function(){
      var numberOfPreviousTurns = 4;

      board.spots = [[pieceValues.human, pieceValues.cpu, pieceValues.cpu], 
                     [pieceValues.empty, pieceValues.human, pieceValues.empty], 
                     [pieceValues.empty, pieceValues.empty, pieceValues.empty]]


      var spotSelected = cpu.determineSelection(board.spots, pieceValues, numberOfPreviousTurns);

      expect(spotSelected.row).toEqual(2);
      expect(spotSelected.column).toEqual(2);  
    });
  });
}
},{"./../../public/scripts/board":9,"./../../public/scripts/cpu":10,"./spec-helper":4}],3:[function(require,module,exports){
var specHelper = require('./spec-helper');
var gameController = require('./../../public/scripts/game-controller');

exports.runSpecs = function(){
  describe('The Game Controller', function(){
    it('should wire up', function(){
      expect(2 + 2).toEqual(4); 
    });


  });
}
},{"./../../public/scripts/game-controller":11,"./spec-helper":4}],4:[function(require,module,exports){
(function (__dirname){
var path = require('path');

exports.pathToSource = (path.join(__dirname, '../../public/scripts/'));

exports.getRandomIntBetween = function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
}).call(this,"/jasmine/spec")
},{"path":6}],5:[function(require,module,exports){
var boardSpec = require('./board-spec');
boardSpec.runSpecs();

var cpuSpec = require('./cpu-spec');
cpuSpec.runSpecs();

var gameControllerSpec = require('./game-controller-spec');
gameControllerSpec.runSpecs();

},{"./board-spec":1,"./cpu-spec":2,"./game-controller-spec":3}],6:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":7}],7:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
exports.spots =  [[], [], []];
exports.resetSpots = function(emptyValue){
  this.spots = [[emptyValue, emptyValue, emptyValue], 
                [emptyValue, emptyValue, emptyValue], 
                [emptyValue, emptyValue, emptyValue]]
}
exports.selectionMade = function(value, row, col){
  this.spots[row][col] = value;
}
},{}],10:[function(require,module,exports){
exports.determineSelection = function(board, pieceValues, numberOfTurns){
  var spot = {};

  // first cover basic 1st or 2nd move strategy
  var isFirstMoveOrHumanHasTakenCenter = numberOfTurns === 0 || numberOfTurns === 1 && board[1][1] !== pieceValues.empty;
  var isSecondMoveAndCenterIsOpen = numberOfTurns === 1 && board[1][1] === pieceValues.empty;

  if (isFirstMoveOrHumanHasTakenCenter){
    spot.row = 0;
    spot.column = 0;
  }else if (isSecondMoveAndCenterIsOpen){
    spot.row = 1;
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
},{}],11:[function(require,module,exports){
// Empty spaces represented by -10, X's are represented by ones, and O's by zeroes
var EMPTY_VALUE = -10;
var O_VALUE = 0;
var X_VALUE = 1;

var board = require('./board');
var boardView = require('./board-view');
var cpuBrain = require('./cpu');
var infoView = require('./info-view');

var humanIsX = true;
var firstGameOfSession = true;
var numberOfTurns = 0;

document.addEventListener("DOMContentLoaded", function() {
  beginGame();
});

function beginGame(){
  board.resetSpots(EMPTY_VALUE);

  if(firstGameOfSession){
    firstGameOfSession = false;
  }else{
    infoView.flipPieceIds();
    boardView.reset();
    numberOfTurns = 0;
    humanIsX = !humanIsX;
  }

  // We have arbitrarily decided that X always goes first
  if (humanIsX){
    humansTurn(runGame);
  }else{
    runGame();
  }
}

function runGame(){
  var isCatsGame = checkForCatsGame();

  if(isCatsGame){
    handleCatsGame();
    return;
  }

  var turnInfo = cpusTurn();
  numberOfTurns++;

  if(turnInfo.winType){
    infoView.updateStatusText('CPU won... New game starting soon.');
    boardView.markWinner(turnInfo);
    startNewGame();
    return;
  }

  isCatsGame = checkForCatsGame();

  if(isCatsGame){
    handleCatsGame();
    return;
  }

  humansTurn(runGame);
}

function handleCatsGame(){
  boardView.markCatsGame();
  infoView.updateStatusText('Cat\'s game! New game starting soon.' );
  startNewGame();
}

function humansTurn(cb){
  infoView.updateStatusText('It\'s your turn!');

  var boardDOMElement = document.getElementById('board');
  boardDOMElement.addEventListener('click', handleUserSelection, false);

  function handleUserSelection(e){
    var clickedSquare = e.target;

    if(clickedSquare.classList.contains('open')){
      var selectedRow = parseInt(clickedSquare.dataset.row);
      var selectedCol = parseInt(clickedSquare.dataset.column);

      boardView.markSelection(selectedRow, selectedCol, humanIsX);

      var humanPieceValue = humanIsX ? X_VALUE : O_VALUE;
      board.selectionMade(humanPieceValue, selectedRow, selectedCol);

      numberOfTurns++;
      boardDOMElement.removeEventListener(e.type, arguments.callee, false);
      cb();
    }
  }
}

function cpusTurn(){
  infoView.updateStatusText('Waiting on Mr. CPU to play.');

  var pieceValuesOnBoard = {
    empty: EMPTY_VALUE, 
    human: humanIsX ? X_VALUE : O_VALUE,
    cpu: humanIsX ? O_VALUE : X_VALUE
  }

  var spotToTake = cpuBrain.determineSelection(board.spots, pieceValuesOnBoard, numberOfTurns);

  board.selectionMade(pieceValuesOnBoard.cpu, spotToTake.row, spotToTake.column);
  boardView.markSelection(spotToTake.row, spotToTake.column, !humanIsX);
  return spotToTake;
}

function startNewGame(){
  setTimeout(function(){
    beginGame();
  }, 4500)
}

function checkForCatsGame(){
  return numberOfTurns === 9;
}


},{"./board":9,"./board-view":8,"./cpu":10,"./info-view":12}],12:[function(require,module,exports){
exports.flipPieceIds = function(){
  var xIdentifierDisplayDOM = document.getElementById('x-id');
  var oIdentifierDisplayDOM = document.getElementById('o-id');

  var oldOText = oIdentifierDisplayDOM.innerText;
  oIdentifierDisplayDOM.innerText = 'O' + xIdentifierDisplayDOM.innerText.substring(1);
  xIdentifierDisplayDOM.innerText = 'X' + oldOText.substring(1);
}

exports.updateStatusText = function(statusText){
  var statusDisplayDOM = document.getElementById('status');

  statusDisplayDOM.textContent = statusText;
}
},{}]},{},[5]);
