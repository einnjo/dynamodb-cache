# dynamodb-cache

A simple cache with ttl support built around [DynamoDB](https://aws.amazon.com/dynamodb/).

## Usage

```typescript
import { DynamoCache } from 'dynamodb-cache';

const cache = new DynamoCache<string>({
  tableName: 'my-cache-table',
  ttlAttribute: 'ttl',
  ttlSeconds: 180
});
```

Creating a cache with custom serialization and deserialization functions.

```typescript
const cache = new DynamoCache<string>({
  tableName: 'my-cache-table',
  ttlAttribute: 'ttl',
  ttlSeconds: 180,
  // NOTE: These are the default implementations.
  serializer: (value: string) => JSON.stringify(value),
  deserializer: (value: string) => JSON.parse(value)
});
```

## API docs

See the generated docs [here](docs/classes/_index_.dynamocache.md).

## Creating the DynamoDB table

The cache is backed by a DynamoDB table that you need to create before using the module.

The requirements are:

- A single partition key on a column named **key** and type string.
- An optional ttl specification on a column name of your choice, we suggest **ttl** (Remember to specify it when constructing a **DynamoCache** instance)
