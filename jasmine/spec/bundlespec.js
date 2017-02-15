(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var specHelper = require('./spec-helper');
var Board = require('./../../public/scripts/board');

var emptyValue = 0;
var boardDimensions = 3;
var board = new Board(boardDimensions, emptyValue);


exports.runSpecs = function(){
  describe('The Board', function(){
    afterEach(function(){
      board.spots = [[],[],[]];
    })

    it('should represent tic tac toe board with 2d array', function(){
      var randomNumber = specHelper.getRandomTicTacToeBoardSpotIndex();

      expect(Array.isArray(board.spots[randomNumber])).toBeTruthy(); 
    });

    it('should reset spots array with setSpotsToEmpty', function(){
      board.spots = [[20, 20, 20], [20, 20, 20], [20, 20, 20]];

      board.setSpotsToEmpty();

      var randomNumber1 = specHelper.getRandomTicTacToeBoardSpotIndex();
      var randomNumber2 = specHelper.getRandomTicTacToeBoardSpotIndex();

      expect(board.spots[randomNumber1][randomNumber2]).toEqual(emptyValue);
    });

    it('should set value in spots array with selectionMade', function(){
      var setValue = 25;
      var randomNumber1 = specHelper.getRandomTicTacToeBoardSpotIndex();
      var randomNumber2 = specHelper.getRandomTicTacToeBoardSpotIndex();

      board.selectionMade(setValue, randomNumber1, randomNumber2);

      expect(board.spots[randomNumber1][randomNumber2]).toEqual(setValue);
    })
  });
}

},{"./../../public/scripts/board":9,"./spec-helper":4}],2:[function(require,module,exports){
var specHelper = require('./spec-helper');
var cpu = require('./../../public/scripts/cpu');
var Board = require('./../../public/scripts/board');

var pieceValues = {
  empty: '',
  human: 'x',
  cpu: 'o'
}

var board = new Board(3, pieceValues.empty);

exports.runSpecs = function(){
  beforeEach(function(){
    board.setSpotsToEmpty();
  });

  describe('The Cpu Brain', function(){
    it('should take corner spot on first move', function(){
      var numberOfPreviousTurns = 0;
      var spotSelected = cpu.determineSelection(board, numberOfPreviousTurns, pieceValues);

      expect(spotSelected.row).toEqual(0);
      expect(spotSelected.column).toEqual(0); 
    });

    it('should take middle if available on 2nd move', function(){
      var numberOfPreviousTurns = 1;
      var rowOfPreviousSelection = 0
      var columnOfPreviousSelection = 0;

      board.selectionMade(pieceValues.human, rowOfPreviousSelection, columnOfPreviousSelection);
      var spotSelected = cpu.determineSelection(board, numberOfPreviousTurns, pieceValues);

      expect(spotSelected.row).toEqual(1);
      expect(spotSelected.column).toEqual(1);
    });

    it('should take top left corner on 2nd move if middle is taken', function(){
      var numberOfPreviousTurns = 1;
      var rowOfPreviousSelection = 1
      var columnOfPreviousSelection = 1;

      board.selectionMade(pieceValues.human, rowOfPreviousSelection, columnOfPreviousSelection);
      var spotSelected = cpu.determineSelection(board, numberOfPreviousTurns, pieceValues);

      expect(spotSelected.row).toEqual(0);
      expect(spotSelected.column).toEqual(0);      
    });

    it('should play in non corner if 4th move and human has opposing corners', function(){
      var numberOfPreviousTurns = 3;

      board.spots = [[pieceValues.human, pieceValues.empty, pieceValues.empty], 
                     [pieceValues.empty, pieceValues.cpu, pieceValues.empty], 
                     [pieceValues.empty, pieceValues.empty, pieceValues.human]]


      var spotSelected = cpu.determineSelection(board, numberOfPreviousTurns, pieceValues);

      expect(spotSelected.row).toEqual(0);
      expect(spotSelected.column).toEqual(1);  
    });

    it('should win or make assured winning move if available', function(){
      var numberOfPreviousTurns = 4;

      board.spots = [[pieceValues.cpu, pieceValues.human, pieceValues.human], 
                     [pieceValues.empty, pieceValues.cpu, pieceValues.empty], 
                     [pieceValues.empty, pieceValues.empty, pieceValues.empty]]


      var spotSelected = cpu.determineSelection(board, numberOfPreviousTurns, pieceValues);

      var selectedSpotIsGuaranteedWin = spotSelected.row === 1 && spotSelected.column === 0 
        || spotSelected.row === 2 && spotSelected.column === 2;

      expect(selectedSpotIsGuaranteedWin).toBeTruthy(); 
    });

    it('should win or block with assured win if both pieces have 2 in a row', function(){
      var numberOfPreviousTurns = 4;

      board.spots = [[pieceValues.human, pieceValues.cpu, pieceValues.empty], 
                     [pieceValues.human, pieceValues.cpu, pieceValues.empty], 
                     [pieceValues.empty, pieceValues.empty, pieceValues.empty]]


      var spotSelected = cpu.determineSelection(board, numberOfPreviousTurns, pieceValues);

      var selectedSpotIsGuaranteedWin = spotSelected.row === 2 && spotSelected.column === 0 
        || spotSelected.row === 2 && spotSelected.column === 1;

      expect(selectedSpotIsGuaranteedWin).toBeTruthy(); 
    });

    it('should play blocking move if needed and no win available', function(){
      var numberOfPreviousTurns = 4;

      board.spots = [[pieceValues.human, pieceValues.cpu, pieceValues.cpu], 
                     [pieceValues.empty, pieceValues.human, pieceValues.empty], 
                     [pieceValues.empty, pieceValues.empty, pieceValues.empty]]


      var spotSelected = cpu.determineSelection(board, numberOfPreviousTurns, pieceValues);

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
    beforeEach(function(){
      spyOn(gameController.infoView, 'flipPieceIds');
      spyOn(gameController.infoView, 'updateStatusText');
      spyOn(gameController.boardView, 'reset');
      spyOn(gameController.boardView, 'markWinner');

      gameController.waitForBoardSizePreference();
      specHelper.simulateClickOnId("3by3-button");
    });

    describe('beginGame', function(){
      beforeEach(function(){
        spyOn(gameController, 'runATurnForEachPlayer');
        spyOn(gameController.boardView, 'addClickHandlerToBoardElement');
      });

      it('should setup click handler on board for human input on first run through', function(){
        spyOn(gameController, 'prepareForAndHandleHumanSelection').and.callThrough();
        gameController.firstGameOfSession = true;

        gameController.beginGame();

        expect(gameController.prepareForAndHandleHumanSelection).toHaveBeenCalled();
        expect(gameController.boardView.addClickHandlerToBoardElement).toHaveBeenCalled();
      });

      it('should not setup click handler directly on second calling', function(){
        spyOn(gameController, 'prepareForAndHandleHumanSelection').and.callThrough();
        gameController.firstGameOfSession = false;
        gameController.humanIsX = true;

        gameController.beginGame();

        expect(gameController.prepareForAndHandleHumanSelection).not.toHaveBeenCalled();
        expect(gameController.boardView.addClickHandlerToBoardElement).not.toHaveBeenCalled();
      });

      it('should flip the piece ids on any calling beyond first', function(){
        gameController.firstGameOfSession = false;
        gameController.humanIsX = true;

        gameController.beginGame();

        expect(gameController.humanIsX).toBe(false);
        expect(gameController.infoView.flipPieceIds).toHaveBeenCalled();
      });

      it('should reset the board object everytime', function(){
        spyOn(gameController.board.__proto__, 'setSpotsToEmpty');

        gameController.beginGame();

        expect(gameController.board.__proto__.setSpotsToEmpty).toHaveBeenCalled();
      });

      it('should reset the board on all times after first', function(){
        gameController.firstGameOfSession = false;

        gameController.beginGame();

        expect(gameController.boardView.reset).toHaveBeenCalled();
      });

      it('should reset the number of turns counter to 0 on all games after the first', function(){
        gameController.firstGameOfSession = false;
        gameController.numberOfTurns = 10;

        gameController.beginGame();

        expect(gameController.numberOfTurns).toBe(0);
      });
    });

    describe('runATurnForEachPlayer', function(){
      beforeEach(function(){
        gameController.numberOfTurns = 0;
        spyOn(gameController.boardView, 'addClickHandlerToBoardElement');
      });

      it('should start by checking for a cats game', function(){
        spyOn(gameController, 'handleCatsGame');

        gameController.numberOfTurns = 9;

        gameController.runATurnForEachPlayer();

        expect(gameController.handleCatsGame).toHaveBeenCalled();
      });

      it('should not continue with the turns if it is cats game', function(){
        spyOn(gameController, 'getAndMarkCpuSelection');
        spyOn(gameController, 'handleCatsGame');
        gameController.numberOfTurns = 9;

        gameController.runATurnForEachPlayer();

        expect(gameController.getAndMarkCpuSelection).not.toHaveBeenCalled();
      });

      it('should call computer before human turn, and not call human if computer wins', function(){
        spyOn(gameController, 'getAndMarkCpuSelection').and.returnValue({winType: true});
        spyOn(gameController, 'kickOffCountdownToNewGame');
        spyOn(gameController, 'prepareForAndHandleHumanSelection');

        gameController.runATurnForEachPlayer();

        expect(gameController.getAndMarkCpuSelection).toHaveBeenCalled();
        expect(gameController.prepareForAndHandleHumanSelection).not.toHaveBeenCalled();        
      });

      it('should call appropriate functions upon computer winning', function(){
        spyOn(gameController, 'getAndMarkCpuSelection').and.returnValue({winType: true});
        spyOn(gameController, 'kickOffCountdownToNewGame');
        spyOn(gameController, 'prepareForAndHandleHumanSelection');

        gameController.runATurnForEachPlayer();

        expect(gameController.boardView.markWinner).toHaveBeenCalled();
        expect(gameController.infoView.updateStatusText).toHaveBeenCalledWith('CPU won... New game starting soon.');
        expect(gameController.kickOffCountdownToNewGame).toHaveBeenCalled();
      });

      it('should iterate the numberOfTurns after computer\'s move', function(){
        spyOn(gameController, 'getAndMarkCpuSelection').and.returnValue({winType: false});
        spyOn(gameController, 'prepareForAndHandleHumanSelection');

        gameController.numberOfTurns = 2;

        gameController.runATurnForEachPlayer();

        expect(gameController.numberOfTurns).toBe(3);
      });

      it('should call checkForCatsGame twice if computer has not won', function(){
        spyOn(gameController, 'getAndMarkCpuSelection').and.returnValue({winType: false});
        spyOn(gameController, 'prepareForAndHandleHumanSelection');
        spyOn(gameController, 'checkForCatsGame');

        gameController.runATurnForEachPlayer();

        expect(gameController.checkForCatsGame.calls.count()).toBe(2);
      })
    });
    
    describe('prepareForAndHandleHumanSelection', function(){
      beforeEach(function(){
        spyOn(gameController.boardView, 'markSelection');
        spyOn(gameController.board, 'selectionMade');
      });

      it("should not do anything if a taken square is chosen", function(){
        gameController.BOARD_DOM_ID = 'taken-click-test';

        gameController.prepareForAndHandleHumanSelection(function(){});

        specHelper.simulateClickOnId('taken-click-test');
        
        expect(gameController.boardView.markSelection).not.toHaveBeenCalled();
      });

      it("should mark the selection if square is open", function(){
        gameController.BOARD_DOM_ID = 'open-click-test';

        gameController.prepareForAndHandleHumanSelection(function(){});

        specHelper.simulateClickOnId('open-click-test');
        
        expect(gameController.boardView.markSelection).not.toHaveBeenCalledWith(undefined, undefined, true);
      });
    });
  });
}



















},{"./../../public/scripts/game-controller":12,"./spec-helper":4}],4:[function(require,module,exports){
(function (__dirname){
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

},{}],9:[function(require,module,exports){
function Board(dimensions, emptyValue){
  this.spots = [];
  this.emptyValue = emptyValue;
  this.dimensions = dimensions;

  for(var i=0; i < dimensions; i++){
    this.spots.push([]);
  }

  this.setSpotsToEmpty();
}

Board.prototype.setSpotsToEmpty = function(){
  for(var i=0; i < this.dimensions; i++){
    for(var j=0; j < this.dimensions; j++){
      this.spots[i][j] = this.emptyValue;
    }
  }
}

Board.prototype.selectionMade = function(value, row, col){
  this.spots[row][col] = value;
}

Board.prototype.unmarkSelection = function(row, col){
  this.spots[row][col] = this.emptyValue;
}

module.exports = Board;
},{}],10:[function(require,module,exports){
var scoreTheBoard = require('./evaluator').determineBoardScore;
var helpers = require('./helpers');
var isRowTicTacToe = helpers.isRowTicTacToe;
var isColumnTicTacToe = helpers.isColumnTicTacToe;
var pieceWinValues;
var pieceIdentifier;

exports.determineSelection = function(board, numberOfMoves, pieceMap){
  pieceIdentifier = pieceMap;
  pieceWinValues = createPieceWinValuesObj(pieceIdentifier);
  var aWinningPlayIsPossible = numberOfMoves >= 4;
  var chosenMoveDetails;

  chosenMoveDetails = tryEachMoveToDetermineBest(board, numberOfMoves);

  board.selectionMade(pieceIdentifier.cpu, chosenMoveDetails.row, chosenMoveDetails.column);
  
  if(aWinningPlayIsPossible)
    chosenMoveDetails.winType = getWinTypeIfCpuHasWon(board);

  return chosenMoveDetails;
}

function tryEachMoveToDetermineBest(board, numberOfMoves){
  var gameBoard = board.spots;

  var bestMoveExpectedValue = -200;
  var bestMoveDetails = {};

  for (var row = 0; row < board.dimensions; row++){
    for (var column = 0; column < board.dimensions; column++){
      var spotIsEmpty = gameBoard[row][column] === pieceIdentifier.empty;

      if (spotIsEmpty){
        board.selectionMade(pieceIdentifier.cpu, row, column);

        var currentMoveExpectedValue = minimax(board, numberOfMoves + 1);
 
        board.unmarkSelection(row, column);

        if (currentMoveExpectedValue > bestMoveExpectedValue){
          bestMoveDetails.row = row;
          bestMoveDetails.column = column;
          bestMoveExpectedValue = currentMoveExpectedValue;
        }
      }
    }
  }

  return bestMoveDetails;
}

function createPieceWinValuesObj(pieceIdentifier){
  var pieceWinValues = {}
  pieceWinValues[pieceIdentifier.human] = -1;
  pieceWinValues[pieceIdentifier.cpu] = 1;

  return pieceWinValues;
}

function minimax(board, numberOfMoves, isCpusTurn){
  var gameBoard = board.spots;
  var score = scoreTheBoard(board, pieceWinValues);

  var playerWon = score === pieceWinValues[pieceIdentifier.human];
  var cpuWon = score === pieceWinValues[pieceIdentifier.cpu];
  var catsGame = numberOfMoves === Math.pow(board.dimensions, 2);

  if(playerWon || cpuWon || catsGame)
    return score;
  
  if(isCpusTurn){
    var bestScoreFound = -200;
    
    for (var row = 0; row < board.dimensions; row++){
      for (var column = 0; column < board.dimensions; column++){
        var spotIsEmpty = gameBoard[row][column] === pieceIdentifier.empty;

        if (spotIsEmpty){
          board.selectionMade(pieceIdentifier.cpu, row, column);
          
          bestScoreFound = Math.max(bestScoreFound, minimax(board, numberOfMoves + 1));

          board.unmarkSelection(row, column);
        }
      }
    }
    return bestScoreFound;

  }else{
    var bestScoreFound = 200;

    for (var row = 0; row < board.dimensions; row++){
      for (var column = 0; column < board.dimensions; column++){
        var spotIsEmpty = gameBoard[row][column] === pieceIdentifier.empty;

        if (spotIsEmpty){
          board.selectionMade(pieceIdentifier.human, row, column);
 
          bestScoreFound = Math.min(bestScoreFound, minimax(board, numberOfMoves + 1, true));

          board.unmarkSelection(row, column);
        }
      }
    }
    return bestScoreFound;
  }
}

function getWinTypeIfCpuHasWon(board){
  var gameBoard = board.spots;

  var leftToRightDiagonalSet = new Set();
  var rightToLeftDiagonalSet = new Set();


  for(var i=0; i < board.dimensions; i++){
    var rowIsTicTacToe = isRowTicTacToe(gameBoard[i]);
    var columnIsTicTacToe = isColumnTicTacToe(gameBoard, i);

    if(rowIsTicTacToe){
      return 'horizontal';
    }else if(columnIsTicTacToe){
      return 'vertical';
    }

    leftToRightDiagonalSet.add(gameBoard[i][i]);
    rightToLeftDiagonalSet.add(gameBoard[i][board.dimensions - i - 1])
  }

  var winnerExistsOnLeftToRightDiagonal = leftToRightDiagonalSet.size === 1 && !leftToRightDiagonalSet.has('');
  var winnerExistsOnRightToLeftDiagonal = rightToLeftDiagonalSet.size === 1 && !rightToLeftDiagonalSet.has('');

  if(winnerExistsOnLeftToRightDiagonal){
    return 'top-left-bottom-right';
  }else if(winnerExistsOnRightToLeftDiagonal){
    return 'top-right-bottom-left'; 
  }
}
},{"./evaluator":11,"./helpers":13}],11:[function(require,module,exports){
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
},{"./helpers":13}],12:[function(require,module,exports){
var EMPTY_VALUE = '';
var O_VALUE = 'o';
var X_VALUE = 'x';

var Board = require('./board');
exports.board;
var boardView = require('./board-view');
exports.boardView = boardView;

var cpuBrain = require('./cpu');
var infoView = require('./info-view');
exports.infoView = infoView;

exports.humanIsX = true;
exports.firstGameOfSession = true;
exports.numberOfTurns = 0;
exports.boardDimensions;

exports.waitForBoardSizePreference = function waitForBoardSizePreference(){
  var gameSelectorContainerDOM = document.getElementById('game-size-selector');
  gameSelectorContainerDOM.addEventListener('click', showAppropriateBoard, false);

  function showAppropriateBoard(e){
    var selectedButtonText = e.target.value;

    if (selectedButtonText){
      exports.boardDimensions = parseInt(selectedButtonText[0]);

      gameSelectorContainerDOM.style.display = 'none';
      gameSelectorContainerDOM.removeEventListener('click', arguments.callee, false);

      document.getElementById('information').style.display = 'inline-block';
      exports.boardView.showBoardWithDimensions(exports.boardDimensions);

      exports.beginGame();
    }
  }
}

exports.beginGame = function beginGame(){
  exports.board = new Board(exports.boardDimensions, EMPTY_VALUE);

  if(exports.firstGameOfSession){
    exports.firstGameOfSession = false;
  }else{
    exports.infoView.flipPieceIds();
    exports.boardView.reset();
    exports.numberOfTurns = 0;
    exports.humanIsX = !exports.humanIsX;
  }

  // We have arbitrarily decided that X always goes first
  if (exports.humanIsX){
    exports.prepareForAndHandleHumanSelection(exports.runATurnForEachPlayer);
  }else{
    exports.runATurnForEachPlayer();
  }
}

exports.runATurnForEachPlayer = function runATurnForEachPlayer(){
  var isCatsGame = exports.checkForCatsGame();

  if(isCatsGame){
    exports.handleCatsGame();
    return;
  }

  var turnInfo = exports.getAndMarkCpuSelection();

  exports.numberOfTurns++;

  if(turnInfo.winType){
    exports.infoView.updateStatusText('CPU won... New game starting soon.');
    exports.boardView.markWinner(turnInfo, exports.boardDimensions);
    exports.kickOffCountdownToNewGame();
    return;
  }

  isCatsGame = exports.checkForCatsGame();

  if(isCatsGame){
    exports.handleCatsGame();
    return;
  }

  exports.prepareForAndHandleHumanSelection(exports.runATurnForEachPlayer);
}

exports.handleCatsGame = function handleCatsGame(){
  exports.boardView.markCatsGame(exports.board.dimensions);
  exports.infoView.updateStatusText('Cat\'s game! New game starting soon.' );
  exports.kickOffCountdownToNewGame();
}

exports.prepareForAndHandleHumanSelection = function prepareForAndHandleHumanSelection(cb){
  exports.infoView.updateStatusText('It\'s your turn!');

  exports.boardView.addClickHandlerToBoardElement(markUserSelectionIfValid, exports.boardDimensions);

  function markUserSelectionIfValid(e){
    var clickedSquare = e.target;

    if(clickedSquare.classList.contains('open')){
      var selectedRow = parseInt(clickedSquare.dataset.row);
      var selectedCol = parseInt(clickedSquare.dataset.column);

      exports.boardView.markSelection(selectedRow, selectedCol, exports.humanIsX, exports.board.dimensions);

      var humanPieceValue = exports.humanIsX ? X_VALUE : O_VALUE;
      exports.board.selectionMade(humanPieceValue, selectedRow, selectedCol);

      exports.numberOfTurns++;
      exports.boardView.removeClickHandlerFromBoardElement(arguments.callee, exports.boardDimensions);
      cb();
    }
  }
}

exports.getAndMarkCpuSelection = function getAndMarkCpuSelection(){
  exports.infoView.updateStatusText('Waiting on Mr. CPU to play.');

  var pieceIdentifier = {
    empty: EMPTY_VALUE, 
    human: exports.humanIsX ? X_VALUE : O_VALUE,
    cpu: exports.humanIsX ? O_VALUE : X_VALUE
  }

  var spotToTake = cpuBrain.determineSelection(exports.board, exports.numberOfTurns, pieceIdentifier);
  exports.board.selectionMade(pieceIdentifier.cpu, spotToTake.row, spotToTake.column);
  exports.boardView.markSelection(spotToTake.row, spotToTake.column, !exports.humanIsX, exports.board.dimensions);

  return spotToTake;
}

exports.kickOffCountdownToNewGame = function kickOffCountdownToNewGame(){
  setTimeout(function(){
    exports.beginGame();
  }, 4500)
}

exports.checkForCatsGame = function checkForCatsGame(){
  return exports.numberOfTurns === 9;
}


},{"./board":9,"./board-view":8,"./cpu":10,"./info-view":14}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
