const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb'); 

var {app} = require('../server/server');
var {Todo} = require('../server/models/todo');

const todos = [
    {_id:new ObjectID(),text:'First test todo'},
    {_id:new ObjectID(),text:'Second test todo'},
    {_id:new ObjectID(),text:'Third test todo'},
    {_id:new ObjectID(),text:'Fourth test todo',completed:true,completedAt:333}
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

describe('GET /todos/:id',() => {
    it('should return todo doc',(done) => {
        request(app)
        .get('/todos/'+todos[0]._id.toHexString())
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    })

    it('should return 404 if todo is invalid', (done) => {

        var id  = new ObjectID().toHexString();

        request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done);
    })

    it('should return 404 if id is not found', (done) => {
        request(app)
        .get('/todos/12345')
        .expect(404)
        .end(done);
    })

})


describe('DELETE /todos/:id',() => {
    it('should remove a todo',(done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)
        .delete('/todos/'+hexId)
        .expect(200)
        .expect((value) => {
            expect(value.body.todo._id).toBe(hexId);
        });

        Todo.findById(hexId).then((data) => {
            expect(data).toNotExist;
            done();
        }).catch((err) => {
            console.log(err);
            done(err);
        })

    })
})


describe('update /todos/:id',() => {
    it('should update status of a todo to be complete, and change the text',(done) => {
        
        var hexID = todos[0]._id.toHexString();
        
        request(app)
        .patch('/todos/'+hexID)
        .send({text:"Y the test done?",completed:true})
        .expect(200)
        .expect((value) => {
            var returnVariable = JSON.parse(value.res.text);
            expect(returnVariable.todo.completed).toBe(true);
            expect(returnVariable.todo.text).toBe("Y the test done?");
            done();
        }).catch((err) => {
            console.log(err)
            done(err);
        });

    })

    it('should turn a todo from complete to not complete',(done) => {
        
        var hexID = todos[3]._id.toHexString();
        request(app)
        .patch('/todos/'+hexID)
        .send({text:"RevertedStatus",completed:false})
        .expect(200)
        .expect((value) => {
            var returnVariable = JSON.parse(value.res.text).todo;
            expect(returnVariable.completed).toBe(false);
            expect(returnVariable.completedAt).toBe(null);
            expect(returnVariable.text).toBe("RevertedStatus");
            done();
        }).catch((e) => {
            console.log(e);
            done();
        })

    })

});