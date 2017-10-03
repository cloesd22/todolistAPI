const mongoose = require('../server/db/mongoose.js');
const {Todo} = require('../server/models/todo')
const {user} = require('../server/models/user')

user.findById('59d1df54cb30cf2b300db0d5').then((result) => {
    if(!result){
       return console.log("Result not found");
    }

    console.log(result);
}).catch((err) => {
    console.log("Error - Cannot perform query" +err);
})