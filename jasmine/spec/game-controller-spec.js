var specHelper = require('./spec-helper');
var gameController = require('./../../public/scripts/game-controller');


exports.runSpecs = function(){
  describe('The Game Controller', function(){
    beforeEach(function(){
      spyOn(gameController.infoView, 'flipPieceIds');
      spyOn(gameController.infoView, 'updateStatusText');    
    })

    it('expect begin game to trigger click handler on board', function(){
      spyOn(gameController, 'beginGame').and.callThrough();
      spyOn(gameController.boardView, 'addClickHandlerToBoardElement')

      gameController.beginGame();

      expect(gameController.boardView.addClickHandlerToBoardElement).toHaveBeenCalled();
    });

  });
}