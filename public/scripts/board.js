exports.spots =  [[], [], []];
exports.resetSpots = function(emptyValue){
  this.spots = [[emptyValue, emptyValue, emptyValue], 
                [emptyValue, emptyValue, emptyValue], 
                [emptyValue, emptyValue, emptyValue]]
}
exports.selectionMade = function(value, row, col){
  this.spots[row][col] = value;
}