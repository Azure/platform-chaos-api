/* eslint-env node, mocha */
const request = require('supertest')
const fs = require('fs')
const server = require('../lib/app')
const constants = require('../lib/constants')

const app = server({ isProd: false })

const extensionsPath = `${__dirname}/../webapp-extension-store.json`
const bearerToken = `bearer ${constants.MOCK_TOKEN}`

describe('GET /extensions', function () {
  before(function () {
    if (fs.existsSync(extensionsPath)) {
      fs.unlink(extensionsPath, function (error) {
        if (error) {
          throw error
        }
        console.log('Deleted extension store.')
      })
    }
  })

  it('should require authorization', function (done) {
    request(app)
      .get('/extensions')
      .expect(401, done)
  })

  it('responds with an empty array because there are no registered extensions', function (done) {
    request(app)
      .get('/extensions')
      .set('Authorization', bearerToken)
      .expect(200, [], done)
  })
})

describe('POST /extensions', function () {
  before(function () {
    if (fs.existsSync(extensionsPath)) {
      fs.unlink(extensionsPath, function (error) {
        if (error) {
          throw error
        }
        console.log('Deleted extension store.')
      })
    }
  })

  const body = {
    'name': 'test name',
    'uri': 'https://test.com',
    'desc': 'test desc'
  }

  const body2 = {
    'name': 'test name2',
    'uri': 'https://test.com2',
    'desc': 'test desc2'
  }

  it('should require authorization', function (done) {
    request(app)
      .post('/extensions')
      .send(body)
      .expect(401, done)
  })

  it('creates a new extension with payload posted', function (done) {
    request(app)
      .post('/extensions')
      .set('Authorization', bearerToken)
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200, done)
  })

  it('can get the extension that just registered', function (done) {
    request(app)
      .get('/extensions')
      .set('Authorization', bearerToken)
      .expect(200, [body], done)
  })

  it('creates a second extension with payload posted', function (done) {
    request(app)
      .post('/extensions')
      .set('Authorization', bearerToken)
      .set('Content-Type', 'application/json')
      .send(body2)
      .expect(200, done)
  })

  it('can get both of the registered extensions', function (done) {
    request(app)
      .get('/extensions')
      .set('Authorization', bearerToken)
      .expect(200, [body, body2], done)
  })

  it('will not create an extension if name is duplicate', function (done) {
    request(app)
      .post('/extensions')
      .set('Authorization', bearerToken)
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(500, done)
  })
})

after(function () {
  if (fs.existsSync(extensionsPath)) {
    fs.unlink(extensionsPath, function (error) {
      if (error) {
        throw error
      }
      console.log('Deleted extension store.')
    })
  }
})
