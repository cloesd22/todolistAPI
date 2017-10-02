const expect = require('expect');
const request = require('supertest');

var {app} = require('../server/server');
var {Todo} = require('../server/models/todo');

beforeEach((done) => {
    Todo.remove({}).then(() => {
        done();
    })
})

describe('POST todos', () => {
    it('it should create a new todo',(done) => {
        var text = "Test todo insertion";

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            }).end((err,res)=>{
                if(err){
                   return done(err);
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err)=>{
                    done(err);
                })
                
            })
    })

    it('should not make an entry with invalid data',(done) => {
        request(app)
            .post('/todos')
            .send({text:''})
            .expect(400)
            .expect((res) => {
            })
            .end((err,res) => {
                if(err){
                    expect(err).toBe(3)
                    console.log("blahh");
                    console.log(JSON.stringify(err,undefined,2))
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(0);
                    done();
                }).catch(((err) => {
                    done(err);
                }))
                
            })
    })
})