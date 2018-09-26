# platform-chaos-api
[![Build Status](https://travis-ci.org/Azure/platform-chaos-api.svg?branch=master)](https://travis-ci.org/Azure/platform-chaos-api)
[![Deploy to Azure](https://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)

An API that surfaces the functionality of the [CLI](https://github.com/Azure/platform-chaos-cli) for [Platform Chaos](https://github.com/Azure/platform-chaos). :cloud:

![hero image](.github/hero.png)

This simply surfaces the `chaos` functionality via authenticated API.
By default, this runs on port `3000` - but that can be configured with the `PORT` environment variable.

To configure this authentication layer, use the following environment variables:

+ `AUTH_CLIENT_ID` - an AzureAD application client id
+ `AUTH_ISSUER` - the AzureAD issuer
+ `AUTH_AUDIENCE` - the AzureAD audience

See [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad#5212-options) for more details.

To configure a deployment of this repo, refer to the [wiki page](https://github.com/Azure/platform-chaos-api/wiki/Walkthrough:-Deploy-and-Authenticate) which contains detailed instructions.

## API

> All endpoints require `Authentication: Bearer <token>` header authentication values for the configured AzureAD application.

### GET /extensions

Returns all registered extensions, as an array:

```
[
    {
        "name": "test",
        "desc": "test desc",
        "uri": "https://test.com"
    }
]
```

### POST /extensions

Creates a new extension. Takes `name, uri, desc` as parts of a json payload.

### GET /extensions/:extId

Gets a particular extension. Takes `extId` (the name of the extension) as part of the path.

```
{
    "name": "test",
    "desc": "test desc",
    "uri": "https://test.com"
}
```

### POST /extensions/:extId/start

Starts an extension. Takes `extId` (the name of the extension) as part of the path.
Optionally takes `?code=<value>` as a query parameter, where `code` is passed along
to the extension. Takes `accessToken` and `resources` as parts of a json payload.

### POST /extensions/:extId/stop

Stops an extension. Takes `extId` (the name of the extension) as part of the path.
Optionally takes `?code=<value>` as a query parameter, where `code` is passed along
to the extension. Takes `accessToken` and `resources` as parts of a json payload.

### DELETE /extensions/:extId

Deletes an extension. Takes `extId` (the name of the extension) as part of the path.

## Related Projects

* [platform-chaos](https://github.com/Azure/platform-chaos) - A Node.js SDK for building services capable of injecting chaos into PaaS offerings.
* [platform-chaos-cli](https://github.com/Azure/platform-chaos-cli) - A tool for introducing chaos into Azure PaaS offerings using configurable extensions.

# Contributing

This project welcomes contributions and suggestions! Here's what you need to know to get started.

### Feedback and Feature Requests

> When you're ready, you can open issues [here](https://github.com/Azure/platform-chaos-api/issues)!

To submit feedback or request features please do a quick search for similar issues,
then open a new issue. If you're requesting a new feature, please briefly explain in the issue what scenario you're planning to use the feature for.

### Development Requirements

To get started developing, you'll need to first ensure you have these tools installed:

* [Git](https://git-scm.com)
* [NodeJS](https://nodejs.org)

Once you've installed those, clone this repository and install dependencies:

```
git clone https://github.com/Azure/platform-chaos.git
cd platform-chaos
npm install
```

Now you're ready to begin contributing!


### Compiling

This project uses Typescript. In order to run the code it must first be compiled using `npm run compile`. This command will first remove any existing compiled files by running `rimraf dist/`. It then compiles all javascript files contained within the `src` directory following the configurtion in `tsconfig.json`. 

### Testing

To run the tests for this project, first ensure you've installed the [requirements](#development-requirements). Next, compile the project using `npm run compile`. Following a successful compile, you can run `npm test`. The test script will also run `tslint` on the project. 

Note that this command is meant to be run from the project directory. That is,
the folder that you cloned the project into (likey `platform-chaos`). 

### Legal

Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

### Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
