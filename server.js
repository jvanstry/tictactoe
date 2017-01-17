var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '/jasmine')));
 
app.get('/game', function (req, res) {
  res.sendFile(path.join(__dirname, 'game.html'));
});

app.get('/test', function(req, res){
  res.sendFile(path.join(__dirname, '/jasmine/SpecRunner.html'));
});
 
app.listen(3000);