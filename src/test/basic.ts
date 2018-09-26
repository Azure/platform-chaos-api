/* eslint-env node, mocha */
import * as fs from 'fs'
import * as request from 'supertest'

import server from '../lib/app'
import constants from '../lib/constants'

const app = server({ isProd: false })

const extensionsPath = `${__dirname}/../../webapp-extension-store.json`
const bearerToken = `bearer ${constants.MOCK_TOKEN}`

describe('GET /extensions', () => {
  before(() => {
    if (fs.existsSync(extensionsPath)) {
      fs.unlink(extensionsPath, (error) => {
        if (error) {
          throw error
        }
      })
    }
  })

  it('should require authorization', (done) => {
    request(app)
      .get('/extensions')
      .expect(401, done)
  })

  it('responds with an empty array because there are no registered extensions', (done) => {
    request(app)
      .get('/extensions')
      .set('Authorization', bearerToken)
      .expect(200, [], done)
  })
})

describe('POST /extensions', () => {
  before(() => {
    if (fs.existsSync(extensionsPath)) {
      fs.unlink(extensionsPath, (error) => {
        if (error) {
          throw error
        }

      })
    }
  })

  const body = {
    desc: 'test desc',
    name: 'test name',
    uri: 'https://test.com'
  }

  const body2 = {
    desc: 'test desc2',
    name: 'test name2',
    uri: 'https://test.com2'
  }

  it('should require authorization', (done) => {
    request(app)
      .post('/extensions')
      .send(body)
      .expect(401, done)
  })

  it('creates a new extension with payload posted', (done) => {
    request(app)
      .post('/extensions')
      .set('Authorization', bearerToken)
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200, done)
  })

  it('can get the extension that just registered', (done) => {
    request(app)
      .get('/extensions')
      .set('Authorization', bearerToken)
      .expect(200, [body], done)
  })

  it('creates a second extension with payload posted', (done) => {
    request(app)
      .post('/extensions')
      .set('Authorization', bearerToken)
      .set('Content-Type', 'application/json')
      .send(body2)
      .expect(200, done)
  })

  it('can get both of the registered extensions', (done) => {
    request(app)
      .get('/extensions')
      .set('Authorization', bearerToken)
      .expect(200, [body, body2], done)
  })

  it('will not create an extension if name is duplicate', (done) => {
    request(app)
      .post('/extensions')
      .set('Authorization', bearerToken)
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(500, done)
  })
})

after(() => {
  if (fs.existsSync(extensionsPath)) {
    fs.unlink(extensionsPath, (error) => {
      if (error) {
        throw error
      }
    })
  }
})
