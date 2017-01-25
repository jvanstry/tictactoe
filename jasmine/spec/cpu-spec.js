var specHelper = require('./spec-helper');
var cpu = require('./../../public/scripts/cpu');
var board = require('./../../public/scripts/board');

exports.runSpecs = function(){
  beforeEach(function(){
    board.spots = [[],[],[]];
  })

  describe('The Cpu Brain', function(){
    it('should wire up', function(){
      expect(2 + 2).toEqual(4); 
    });
  });
}