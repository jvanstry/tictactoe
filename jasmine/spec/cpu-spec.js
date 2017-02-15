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