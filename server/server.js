
var config = require('./config/config.js')
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash')
var {mongoose} = require('./db/mongoose');
var {ObjectID} = require('mongodb');
var {Todo} = require('./models/todo');
var {user} = require('./models/user');


var app = express();
const port = process.env.PORT || 3000;
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

app.delete('/todos/:id',(req,res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id))
    {
        res.sendStatus(404);
        console.log("invalid ID request made")
        return;
    }

    Todo.findByIdAndRemove(id).then((todo) => {

        if(!todo){
            res.sendStatus(404);
            console.log("That entry doesn't exist to delete, please create it to to delete it");
            return;
        }

        res.sendStatus(200);
        console.log("Sucess - Send back" + {todo})
    }).catch((err) => {
        res.sendStatus(400);
        console.log("Error deleting data "+ err);
    })

})

app.patch('/todos/:id',(req,res) => {
    var id  = req.params.id;
    var body = _.pick(req.body,['text','completed']);


    if(!ObjectID.isValid(id))
    {
        res.sendStatus(404);
        console.log("invalid ID request made")
        return;
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed=false;
        body.completedAt=null;
    }

    Todo.findByIdAndUpdate(id,{$set : body},{new:true}).then((todo) => {
        
        if(!todo){
            res.status(404).send();
            return;
        }
        res.send({todo});
   

    }).catch((e) => {
      res.status(400).send();  
      console.log(e);
    })


})

app.listen(port,()=>{
    console.log(`Server listening on ${port}`);
})

module.exports = {app};