import * as azureChaos from 'azure-chaos'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as passport from 'passport'
import { BearerStrategy } from 'passport-azure-ad'
import { Strategy as MockStrategy } from 'passport-http-bearer'

import constants from '../lib/constants'

export default (opts) => {
  // configure the factory for runtime
  // this injects our production dependencies
  azureChaos.factory.RequestProcessor.configure({
    requestImpl: require('request')
  })
  azureChaos.factory.ExtensionRegistry.configure({
    fsImpl: require('fs'),
    fsLocation: './webapp-extension-store.json'
  })
  azureChaos.factory.Logger.configure({
    // tslint:disable-next-line
    logImpl: console.log
  })
  azureChaos.factory.AzureAuthenticator.configure({
    msRestImpl: require('ms-rest-azure')
  })

  const proc = azureChaos.factory.RequestProcessor.create()
  const registry = azureChaos.factory.ExtensionRegistry.create()
  const app = express()

  if (opts && opts.isProd) {
    // in production, use Bearer Strategy for auth
    passport.use(new BearerStrategy({
      audience: opts.authAudience,
      clientID: opts.authClientId,
      identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
      issuer: opts.authIssuer,
      loggingLevel: 'error'
    }, (token, done) => {
      done(null, token)
    }))
  } else {
    // if !isProd the test suite is being run so mock authentication
    const mockStrategy = new MockStrategy(
      (token, done) => {
        if (token === constants.MOCK_TOKEN) {
          done(null, {})
        } else {
          done(null, false, { message: 'bad token' })
        }
      })
    mockStrategy.name = 'oauth-bearer' // to match Bearer Strategy oauth
    passport.use(mockStrategy)
  }

  app.use(passport.initialize())
  app.use(passport.authorize('oauth-bearer', { session: false }))

  app.get('/extensions', (req, res) => {
    registry.getAll().then((exts) => {
      res.status(200).send(exts)
    }, (err) => {
      res.status(500).send({ error: err })
    })
  })

  app.get('/extensions/:extId', (req, res) => {
    registry.get({ extensionName: req.params.extId })
      .then((e) => {
        res.status(200).send(e)
      }, (err) => {
        res.status(500).send({ error: err })
      })
  })

  // takes ?code = <keyArg>
  // body: json payload to pass to extension...
  // ie: {accessToken, resources}
  app.post('/extensions/:extId/start', bodyParser.json(), (req, res) => {
    registry
      .get({ extensionName: req.params.extId })
      .then((ext) => {
        return proc.start({
          accessToken: req.body.accessToken,
          authKey: req.query.code,
          extensionUri: ext.uri,
          resources: req.body.resources
        })
      })
      .then((result) => {
        res.status(result.statusCode).send(result.body)
      }, (err) => {
        res.status(500).send({ error: err })
      })
  })

  // takes ?code = <keyArg>
  // body: json payload to pass to extension...
  // ie: {accessToken, resources}
  app.post('/extensions/:extId/stop', bodyParser.json(), (req, res) => {
    registry
      .get({ extensionName: req.params.extId })
      .then((ext) => {
        return proc.stop({
          accessToken: req.body.accessToken,
          authKey: req.query.code,
          extensionUri: ext.uri,
          resources: req.body.resources
        })
      }).then((result) => {
        res.status(result.statusCode).send(result.body)
      }, (err) => {
        res.status(500).send({ error: err })
      })
  })

  app.delete('/extensions/:extId', (req, res) => {
    registry.unregister({
      extensionName: req.params.extId
    }).then(() => {
      res.status(200).end()
    }, (err) => {
      res.status(500).send({ error: err })
    })
  })

  // takes
  // body:
  // {name, uri, desc}
  app.post('/extensions', bodyParser.json(), (req, res) => {
    registry.register({
      extensionDesc: req.body.desc,
      extensionName: req.body.name,
      extensionUri: req.body.uri
    }).then(() => {
      res.status(200).end()
    }, (err) => {
      res.status(500).send({ error: err.message || err })
    })
  })

  return app
}
