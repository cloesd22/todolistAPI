
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {ObjectID} = require('mongodb');
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

app.get('/todos/:id',(req,res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        res.sendStatus(404);
        console.log("invalid ID request made")
        return;
    }

    Todo.findById(id).then((todo) => {
        if(!todo){
            res.sendStatus(404);
            console.log("Request made for non existent document")
            return;
        }
        res.send({todo});
        console.log("Sucess - Send back" + {todo})

    }).catch((err) => {
        res.sendStatus(400);
        console.log("Failed");
    })
})

app.listen(3000,()=>{
    console.log("Server listening on 3000");
})

module.exports = {app};