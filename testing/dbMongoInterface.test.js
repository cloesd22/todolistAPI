const interface = require('../dbMongoInterface');
var chai = require('chai');
var expect = chai.expect;


describe('basic connect/insert/find testing', () => {

    var db;
    before(() => {
        db = new interface.mongoCustomDriver("mongodb://localhost:27017/testing");
    })

    it('dbObject Succesfsuly assigned', (done) => {
        db.connect().then((data) => {
            expect(db.dbObject).to.not.be.a('null');
            done();
        })

    })
    
    it('Succesfully adds to database', (done) => {
        db.pushOne('testBase',{animal:"porcupine",location:"bush"}).then((data) => {
            expect(data).to.have.string('Success');
            done();
        })
    })

    it('Succesfully adds to database', (done) => {
        db.pushOne('testBase',{animal:"cammel",location:"desert"}).then((data) => {
            expect(data).to.have.string('Success');
            done();
        })
    })

    it('Succesfully adds to database', (done) => {
        db.pushOne('testBase',{animal:"Bear",location:"forest"}).then((data) => {
            expect(data).to.have.string('Success');
            done();
        })
    })

    it('successfully reads previously added data from the database',(done)=>{
        db.getAll('testBase').then((result) => {
            expect(result[0].animal).to.be.equal("porcupine");
            expect(result[0].location).to.be.equal("bush");

            expect(result[1].animal).to.be.equal("cammel");
            expect(result[1].location).to.be.equal("desert");

            expect(result[2].animal).to.be.equal("Bear");
            expect(result[2].location).to.be.equal("forest");
            done();
        })
    })

    it('should query specifically for desert in location field and return correct animal',(done) => {
        db.getSpec('testBase',{location:'desert'}).then((result)=>{
            expect(result[0].animal).to.be.equal('cammel');
            done();
        })
        
    })

    it('should query specifically for bear in animal field and return correct location',(done) => {
        db.getSpec('testBase',{animal:'Bear'}).then((result)=>{
            expect(result[0].location).to.be.equal('forest');
            done();
        })
        
    })

    it('Succesfully adds bear duplicate to database', (done) => {
        db.pushOne('testBase',{animal:"Bear",location:"forest"}).then((data) => {
            expect(data).to.have.string('Success');
            done();
        })
    })

    it('Succesfully adds bear duplicate to database', (done) => {
        db.pushOne('testBase',{animal:"Bear",location:"forest"}).then((data) => {
            expect(data).to.have.string('Success');
            done();
        })
    })

    it('Succesfully adds bear duplicate to database', (done) => {
        db.pushOne('testBase',{animal:"Bear",location:"forest"}).then((data) => {
            expect(data).to.have.string('Success');
            done();
        })
    })

    it('should update a bear into a polar bear',(done)=>{

        db.updateOne('testBase',{animal:"Bear",location:"forest"},{animal:"Polar Bear",location:"Arctic"}).then((data)=>{
            
            expect(data).to.have.string("Success");
            done();
        })
    })

    it('should query specifically for bear in animal field and return correct location',(done) => {
        db.getSpec('testBase',{animal:'Polar Bear'}).then((result)=>{
            expect(result[0].location).to.be.equal('Arctic');
            done();
        })
    })    


    it('should remove all bear animals from the data',(done) => {
        db.removeThese('testBase',{animal:'Bear'}).then((data)=>{
            expect(data).to.be.equal("removed 3 values.");
            done();
        })
    })




    it('should remove specific bush animal from the dataset',(done) => {
        db.removeOne('testBase',{animal:'porcupine'}).then((data) => {
            expect(data).to.be.equal('removed 1 value.')
            done();
        })

    })

    it('should remove specific arctic animal from the dataset',(done) => {
        db.removeOne('testBase',{animal:'Polar Bear'}).then((data) => {
            expect(data).to.be.equal('removed 1 value.')
            done();
        })

    })

    it('should remove specific  animal from the dataset and call it out',(done) => {
        db.removeAndCall('testBase',{animal:'cammel'}).then((data) => {
            expect(data.animal).to.be.equal("cammel")
            expect(data.location).to.be.equal("desert")
            done();
        })

    })  

    it('it should drop the current table',(done)=>{

        db.dropTable('testBase').then((data)=>{
            expect(data).to.be.equal('Dropped');
            done();
        })
        
    })
})