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