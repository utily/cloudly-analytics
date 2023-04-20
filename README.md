# Cloudly Analytics

Cloudflare Workers analytics Library.

```
npm i cloudly-analytics-sender
npm i cloudly-analytics-administration
npm i cloudly-analytics-storage
```


# Roles
## Workers that send analytics events:

Add cloudly-analytics-sender to your existing worker.
This writes storage events to a Buffer-durableobject.

Specify the Typescript-type of the events you want to use.
See examples in `worker-sender/Context/analytics.ts` and used in `worker-sender/Context/index.ts` 

## Worker with storage and administration

Responsible for storage and listeners.
ListenerConfiguration can be stored in:
  - Cloudflare KeyValue-store
	- Typescript-code

A Buffer is processed and events is added to a listener's Bucket, where the finally will be processed.


## Minimum (Using KeyValue-store):

`worker-storage` is a minimum for implementing storage. However normally you would combine it with administration,
like `worker-administration`.

## Configuration for listeners with Typescript-code.

You need to override `getListenerConfigurationClient` in storage (See `worker-administation/storage`)
and in the `analyticsAdministration`-property in your context. (See `worker-administation/Context/index.ts`)

## ListenerConfigurationClient and rest API for administration of listener

This works for all ListenerConfigurationClient's (KeyValueStorage/TypescriptApi, See `packages/administartion/storageClient/ListenerConfigurationClient`) but
Typescript is readonly.

It is possible to write a client combining both hardcoded typescript and KeyValue-stored.

## NPM-packages

This repo is using [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

If you need to depend on a branch, normal `"github:..."`-links will not work in your `package.json`, use [https://gitpkg.vercel.app/] to create a link to the `packages/[package]`-folder.

`lerna` is only used to bump the version across all packages in a Github-action. (Version is stored in `lerna.json`)
