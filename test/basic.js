const request = require('supertest');
const fs = require('fs');
const expect = require('chai').expect
const server = require('../lib/app');

const app = server({ isProd: false}); 

const extensionsPath = `${__dirname}/../webapp-extension-store.json`;

describe('GET /extensions when there are no extensions', function() {

    before(function() {
        if (fs.existsSync(extensionsPath)) {
            fs.unlink(extensionsPath, function(error) {
                if (error) {
                    throw error;
                }
                console.log('Deleted extension store.');
            })
        }
    })

    it('should require authorization', function(done) {
        request(app)
            .get('/extensions')
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            })
    })

    it('responds with all registered extensions as an array', function(done) {
        request(app)
            .get('/extensions')
            .set('Authorization', 'bearer ' + 'mock-token')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body)
                    .to.be.an.instanceof(Array)
                    .and.to.have.length(0)
                done()
            })
    })
});

describe('POST /extensions', function() {

    before(function() {
        if (fs.existsSync(extensionsPath)) {
            fs.unlink(extensionsPath, function(error) {
                if (error) {
                    throw error;
                }
                console.log('Deleted extension store.');
            })
        }
    })

    var body = {
        "name": "test name",
        "uri": "https://test.com",
        "desc": "test desc"
    };

    var body2 = {
        "name": "test name2",
        "uri": "https://test.com2",
        "desc": "test desc2"
    };

    it('should require authorization', function(done) {
        request(app)
            .post('/extensions')
            .send(body)
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            })
    })

    it('creates a new extension with payload posted', function(done) {
        request(app)
            .post('/extensions')
            .set('Authorization', 'bearer ' + 'mock-token')
            .set('Content-Type', 'application/json')
            .send(body)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done()
            })
    })

    it('can get the extension that just registered', function(done) {
        request(app)
            .get('/extensions')
            .set('Authorization', 'bearer ' + 'mock-token')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body)
                    .to.be.an.instanceof(Array)
                    .and.to.have.length(1)
                expect(res.body[0])
                    .to.contain.keys('name', 'uri', 'desc')
                done()
            })
    })

    it('creates a new extension with payload posted', function(done) {
        request(app)
            .post('/extensions')
            .set('Authorization', 'bearer ' + 'mock-token')
            .set('Content-Type', 'application/json')
            .send(body2)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done()
            })
    })

    it('can get the extension that just registered', function(done) {
        request(app)
            .get('/extensions')
            .set('Authorization', 'bearer ' + 'mock-token')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body)
                    .to.be.an.instanceof(Array)
                    .and.to.have.length(2)
                expect(res.body[0])
                    .to.contain.keys('name', 'uri', 'desc')
                done()
            })
    })
})