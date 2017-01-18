var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/jasmine')));
 
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/game.html'));
});

app.get('/test', function(req, res){
  res.sendFile(path.join(__dirname, '/jasmine/SpecRunner.html'));
});
 
app.listen(port);