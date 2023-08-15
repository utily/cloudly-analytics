# worker-analytics-administration-template

Cloudflare Worker for storage and administration.


## Setup (Current code with Typescript-API for listenerConfiguration)

Configuration for listener is created in `./Context/listenerConfigurationClientFactory`.

```
nvm i
```

## Alternative Setup with listenerConfiguration in kv-value-space

Delete:

* `./storage`
* `./Context/listenerConfigurationClientFactory`

Remove `listenerConfigurationClientFactory` in `./Context/index.ts`.

Let `BufferStorage` and `BucketStorage` be imported form `cloudly-analytics-storage` instead of `.storage`

Create kv:namespace for listenerConfiguration:
```
wrangler login
wrangler kv:namespace create listenerConfiguration
wrangler kv:namespace create --preview listenerConfiguration
```
