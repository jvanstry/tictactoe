var specHelper = require('./spec-helper');
var board = require('./../../public/scripts/board');


exports.runSpecs = function(){
  describe('The Board', function(){
    afterEach(function(){
      board.spots = [[],[],[]];
    })

    it('should represent tic tac toe board with 2d array', function(){
      var randomNumber = specHelper.getRandomTicTacToeBoardSpotIndex();

      expect(Array.isArray(board.spots[randomNumber])).toBeTruthy(); 
    });

    it('should reset 2d array to passed value with resetSpots', function(){
      var emptyValue = 10;

      board.resetSpots(emptyValue);

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
