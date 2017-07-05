var express = require ('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('deck', ['deck']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/deck', function (req, res){
  db.deck.find(function (err, docs){
    console.log(docs);
    res.json(docs);
  })
})

app.post('/deck', function (req, res) {
  console.log(req.body);
  db.deck.insert(req.body, function(err, doc){
    res.json(doc);
  })
});

app.delete('/deck/:id', function (req, res){
  let id = req.params.id;
  console.log(id);
  db.deck.remove({_id: mongojs.ObjectId(id)}), function (err, doc){
    res.json(doc);
  };
});

app.get('/deck/:id', function (req, res){
  let id = req.params.id;
  db.deck.findOne({_id: mongojs.ObjectId(id)}, function (err, doc){
    res.json(doc);
  });
});

// app.put('/deck/:id', function(req, res){
//   let id = req.params.id;
//   console.log(req.body.decks);
//   db.deck.update({_id: mongojs.ObjectId(id)}, req.body, {}, function (err, doc) {
//        res.json.doc;
//      })
// });

app.put('/deck/:id', function(req, res){
  let id = req.params.id;
  console.log(req.body);
  db.deck.findAndModify({id: {_id: mongojs.ObjectId(id)},
    update: {$set: {quantity: req.body.quantity, mechanics: req.body.mechanics}},
     new: true}, function (err, doc) {
       res.json.doc;
     })
});

app.listen(3000);
console.log("Server running on port 3000");
