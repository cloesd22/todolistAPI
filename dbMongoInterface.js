// Interface for dealing with MongoDB
const MongoClient = require('mongodb').MongoClient;

module.exports = { mongoCustomDriver: mongoCustomDriver };


function mongoCustomDriver(remoteBaseURL) {

    var dbObject;
    var remoteURL = remoteBaseURL;
     this.connect = function connect() {

        return new Promise((resolve, reject)=> {
            MongoClient.connect(remoteURL, (err, db)=>{
                if (err) {
                    reject("Failed to contact database");
                }
                    this.dbObject = db;
                    resolve(db);
            })
        })
    }


    this.getAll = function getAll(collection) {
        return new Promise((resolve,reject)=>{
            this.dbObject.collection(collection).find().toArray().then((data) => {
                resolve(data);
            }).catch((err) => {
                reject("Fetch failure - "+ err);
            })
        })   
    }

    this.getSpec = function getSpec(collection, data) {
        return new Promise((resolve,reject)=>{
            this.dbObject.collection(collection).find(data).toArray().then((data) => {
                resolve(data);
            }).catch((err) => {
                reject("Fetch failure - "+ err);
            })
        })   

    }

    this.pushOne = function pushOne(collection, data) {

        return new Promise((resolve,reject)=>{
            this.dbObject.collection(collection).insertOne(data, (err, result) => {
                if (err) {
                    reject("Error pushing one to database" + err);
                }
                resolve ("Success pushing: "+ data);
            })
        })
    }

    this.updateOne = function updateOne(collection,filter,newValue){

        return new Promise((resolve,reject)=>{
            this.dbObject.collection(collection).findOneAndUpdate(filter,{$set:newValue},{returnOriginal:false},(err,result)=>{
                if(err){
                    reject("Failed to Update");
                }
                resolve("Success -"+ result);
            })
    
        })

    }

    this.removeOne = function removeOne(collection,data){
        return new Promise((resolve,reject)=>{
            this.dbObject.collection(collection).deleteOne(data).then((result) => {
                resolve(`removed ${result.result.n} value.`);
            }).catch((err)=>{
                reject("Data Deletion failed -" + err);
            })
        })
    }

    this.removeThese = function removeThese(collection,data){
        return new Promise((resolve,reject)=>{
            this.dbObject.collection(collection).deleteMany(data).then((result) => {
                resolve(`removed ${result.result.n} values.`);
            }).catch((err)=>{
                reject("Data Deletion failed -" + err);
            })
        })
    }

    this.removeAndCall = function removeAndCall(collection,data){
        return new Promise((resolve,reject)=>{
            this.dbObject.collection(collection).findOneAndDelete(data).then((result) => {
                resolve(result.value);
                
            }).catch((err)=>{
                reject("Data Deletion failed -" + err);
            })
        })
    }

    this.dropTable = function dropTable(collection){

        return new Promise((resolve,reject)=>{
            this.dbObject.collection(collection).drop((err,result) => {
                if(err){
                    reject("Fail to delete");
                }
                resolve("Dropped");
            })

        })

    }




}
