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

    afterEach(function(){
      document.getElementById('game-size-selector').style.display = 'inline-block';

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


















