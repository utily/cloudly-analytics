# Cloudly Analytics

Cloudflare Workers analytics Library.

```
npm i cloudly-analytics
```

# Roles

- worker with storage
- worker listenerConfiguration (Rest API)
- worker listenerConfiguration (Javascript API)

- sender (http)
- sender (Durable object)

# Worker with storage

## Minimum:

In `./index.ts` add:

```typescript
export { BufferStorage, BucketStorage } from "cloudly-analytics/Storage"
```

In `./wrangler.toml` add:

```
[durable_objects]
bindings = [
	{ name = "bufferStorage", class_name = "BufferStorage" },
	{ name = "bucketStorage", class_name = "BucketStorage" },
]
```

## Typescript API

TODO

## Rest API

TODO

## NPM-packages

This repo is using [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

If you need to depend on a branch, normal "github:..."-links will not work in your `package.json`, use [https://gitpkg.vercel.app/] to create a link to the `packages/[package]`-folder.

`lerna` is only used to bump the version in a Github-action.
