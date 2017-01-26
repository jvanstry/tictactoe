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

    it('should play in non corner if 4th move and human has opposing corners', function(){
      var numberOfPreviousTurns = 3;

      board.spots = [[pieceValues.human, pieceValues.empty, pieceValues.empty], 
                     [pieceValues.empty, pieceValues.cpu, pieceValues.empty], 
                     [pieceValues.empty, pieceValues.empty, pieceValues.human]]


      var spotSelected = cpu.determineSelection(board.spots, pieceValues, numberOfPreviousTurns);

      expect(spotSelected.row).toEqual(0);
      expect(spotSelected.column).toEqual(1);  
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