const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const MockStrategy = require('passport-http-bearer').Strategy
const BearerStrategy = require('passport-azure-ad').BearerStrategy
const azureChaos = require('azure-chaos')

module.exports = (opts) => {

    // configure the factory for runtime
    // this injects our production dependencies
    azureChaos.factory.RequestProcessor.configure({
        requestImpl: require('request')
    })
    azureChaos.factory.ExtensionRegistry.configure({
        fsImpl: require('fs'),
        fsLocation: './webapp-extension-store.json',
    })
    azureChaos.factory.Logger.configure({
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
            identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
            clientID: process.env.AUTH_CLIENT_ID,
            audience: process.env.AUTH_AUDIENCE,
            issuer: process.env.AUTH_ISSUER,
            loggingLevel: 'error'
        }, function(token, done) {
            done(null, token)
        }))
    } else {            
        // if !isProd the test suite is being run so mock authentication
        const mockStrategy = new MockStrategy(
            function(token, done) {
                if (token === 'mock-token') {
                    done(null, {lol: 'hi'})
                } else {
                    done(new Error('Invalid Token'))
                }
            })
        mockStrategy.name = 'oauth-bearer'; // to match Bearer Strategy oauth
        passport.use(mockStrategy)
    }

    app.use(passport.initialize())
    app.use(passport.authorize('oauth-bearer', { session: false }))

    app.get('/extensions', (req, res) => {
        registry.getAll().then(exts => {
            res.status(200).send(exts)
        }, (err) => {
            res.status(500).send({error: err})
        })
    })

    app.get('/extensions/:extId', (req, res) => {
        registry.get({extensionName: req.params.extId})
            .then(e => {
                res.status(200).send(e)
            }, (err) => {
                res.status(500).send({error: err})
            })
    })

    // takes ?code = <keyArg>
    // body: json payload to pass to extension...
    // ie: {accessToken, resources}
    app.post('/extensions/:extId/start', bodyParser.json(), (req, res) => {
        registry
            .get({extensionName: argv.extension})
            .then((ext) => {
                return proc.start({
                    extensionUri: ext.uri,
                    authKey: req.query.code,
                    resources: req.body.resources,
                    accessToken: req.body.accessToken
                })
            }).then((res) => {
                res.status(res.statusCode).send(res.body)
            }, (err) => {
                res.status(500).send({error: err})
            })
    })

    // takes ?code = <keyArg>
    // body: json payload to pass to extension...
    // ie: {accessToken, resources}
    app.post('/extensions/:extId/stop', bodyParser.json(), (req, res) => {
        registry
            .get({extensionName: argv.extension})
            .then((ext) => {
                return proc.stop({
                    extensionUri: ext.uri,
                    authKey: req.query.code,
                    resources: req.body.resources,
                    accessToken: req.body.accessToken
                })
            }).then((res) => {
                res.status(res.statusCode).send(res.body)
            }, (err) => {
                res.status(500).send({error: err})
            })
    })

    app.delete('/extensions/:extId', (req, res) => {
        registry.unregister({
            extensionName: req.params.extId
        }).then(() => {
            res.status(200).end()
        }, (err) => {
            res.status(500).send({error: err})
        })
    })

    // takes
    // body:
    // {name, uri, desc}
    app.post('/extensions', bodyParser.json(), (req, res) => {
        registry.register({
            extensionName: req.body.name,
            extensionUri: req.body.uri,
            extensionDesc: req.body.desc
        }).then(() => {
            res.status(200).end()
        }, (err) => {
            res.status(500).send({error: err})
        })
    })

    return app
}