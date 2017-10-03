
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

app.get('/todos',(req,res)=>{
    Todo.find().then((todos) => {
        res.send({todos});
    }).catch((err) => {
        res.send(400,"Error with request");
    })
})

app.listen(3000,()=>{
    console.log("Server listening on 3000");
})

module.exports = {app};