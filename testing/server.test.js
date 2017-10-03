const expect = require('expect');
const request = require('supertest');

var {app} = require('../server/server');
var {Todo} = require('../server/models/todo');

const todos = [
    {text:'First test todo'},
    {text:'Second test todo'},
    {text:'Third test todo'},
    {text:'Fourth test todo'}
]

beforeEach((done) => {
    Todo.remove({}).then(() => {
       return Todo.insertMany(todos);
    }).then(() => {
        done();
    })
});

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
                Todo.find({text:"Test todo insertion"}).then((todos)=>{
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
                    console.log("blahh");
                    console.log(JSON.stringify(err,undefined,2))
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(4);
                    done();
                }).catch(((err) => {
                    done(err);
                }))
                
            })
    })
})


describe('GET /todos',() => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(4);
        })
        .end(done);
    })
})

