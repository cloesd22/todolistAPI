const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
    if(err){
        return console.log("Failed when connecting to Database" + err)
    }
    console.log("Connected succesfully to databse");



   db.collection('users').find({password:"b0ssyb0ss"}).toArray().then((data) => {
        console.log(JSON.stringify(data,undefined,2));
    }).catch((err) => {
        console.log("Error fetching data -"+ err)
    });




})

function generateUser(username,password,secretquestion){
    return {'username':username,'password':password,'secretquestion':secretquestion};
}