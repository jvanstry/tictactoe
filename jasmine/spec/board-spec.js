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
