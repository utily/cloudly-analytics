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
export { EventStorage, BucketStorage } from "cloudly-analytics/Storage"
```

In `./wrangler.toml` add:

```
[durable_objects]
bindings = [
	{ name = "eventStorage", class_name = "EventStorage" },
	{ name = "bucketStorage", class_name = "BucketStorage" },
]
```

## Typescript API

TODO

## Rest API

TODO
