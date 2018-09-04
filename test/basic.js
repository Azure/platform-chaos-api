const request = require('supertest');
const express = require('express');

const app = express(); 

app.get('/extensions', function(req, res) {
    res.status(200).json({ name: 'test', desc: 'test desc', uri: 'https://test.com' });
});

request(app)
    .get('/user')
    .expect('Content-Type', /json/)
    .expect('Content-Length', '15')
    .expect(200)
    .end(function(err, res) {
        if (err) throw err;
});

var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});