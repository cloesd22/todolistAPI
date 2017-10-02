
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {user} = require('./models/user');


var app = express();
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var todo= new Todo({
        text: req.body.text
    });
    todo.save().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(400).send(err);
    })
})

app.listen(3000,()=>{
    console.log("Server listening on 3000");
})