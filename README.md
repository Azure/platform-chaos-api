# platform-chaos-api

web frontend for [Platform Chaos](https://github.com/azure/platform-chaos). :cloud:

This simply surfaces the `chaos` functionality via authenticated API.
By default, this runs on port `3000` - but that can be configured with the `PORT` environment variable.

To configure this authentication layer, use the following environment variables:

+ `AUTH_CLIENT_ID` - an AzureAD application client id
+ `AUTH_ISSUER` - the AzureAD issuer
+ `AUTH_AUDIENCE` - the AzureAD audience

See [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad#5212-options) for more details.

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

## License

MIT

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
