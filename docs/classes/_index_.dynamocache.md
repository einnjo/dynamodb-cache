[dynamodb-cache](../README.md) › [Globals](../globals.md) › ["index"](../modules/_index_.md) › [DynamoCache](_index_.dynamocache.md)

# Class: DynamoCache <**T**>

A simple cache build around DynamoDB.

## Type parameters

▪ **T**

## Hierarchy

* **DynamoCache**

## Index

### Constructors

* [constructor](_index_.dynamocache.md#constructor)

### Properties

* [deserializer](_index_.dynamocache.md#private-deserializer)
* [dynamo](_index_.dynamocache.md#private-dynamo)
* [serializer](_index_.dynamocache.md#private-serializer)
* [tableName](_index_.dynamocache.md#tablename)
* [ttlAttribute](_index_.dynamocache.md#private-optional-ttlattribute)
* [ttlSeconds](_index_.dynamocache.md#private-ttlseconds)

### Methods

* [del](_index_.dynamocache.md#del)
* [get](_index_.dynamocache.md#get)
* [isTTLExpired](_index_.dynamocache.md#private-isttlexpired)
* [set](_index_.dynamocache.md#set)

## Constructors

###  constructor

\+ **new DynamoCache**(`options`: object): *[DynamoCache](_index_.dynamocache.md)*

*Defined in [index.ts:16](https://github.com/einnjo/dynamodb-cache/blob/690cf59/src/index.ts#L16)*

Returns a new DynamoCache instance.

**Parameters:**

▪ **options**: *object*

Name | Type | Description |
------ | ------ | ------ |
`deserializer?` | undefined &#124; function | A deserializer function that converts your input type from string to your input type for retrieval.  |
`dynamo?` | DynamoDB | - |
`serializer?` | undefined &#124; function | A serializer function that converts your input type to string for storage. |
`tableName` | string | The name of your existing DynamoDB table. |
`ttlAttribute?` | undefined &#124; string | The attribute where ttl is stored, should be of type Number and store the unix timestamp in seconds. |
`ttlSeconds?` | undefined &#124; number | When a new item is inserted, it'll expired after this number of seconds defaults to 300 seconds (5 minutes). |

**Returns:** *[DynamoCache](_index_.dynamocache.md)*

## Properties

### `Private` deserializer

• **deserializer**: *function*

*Defined in [index.ts:16](https://github.com/einnjo/dynamodb-cache/blob/690cf59/src/index.ts#L16)*

#### Type declaration:

▸ (`value`: string): *T*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

___

### `Private` dynamo

• **dynamo**: *DynamoDB*

*Defined in [index.ts:12](https://github.com/einnjo/dynamodb-cache/blob/690cf59/src/index.ts#L12)*

___

### `Private` serializer

• **serializer**: *function*

*Defined in [index.ts:15](https://github.com/einnjo/dynamodb-cache/blob/690cf59/src/index.ts#L15)*

#### Type declaration:

▸ (`value`: T): *string*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

___

###  tableName

• **tableName**: *string*

*Defined in [index.ts:11](https://github.com/einnjo/dynamodb-cache/blob/690cf59/src/index.ts#L11)*

___

### `Private` `Optional` ttlAttribute

• **ttlAttribute**? : *undefined | string*

*Defined in [index.ts:13](https://github.com/einnjo/dynamodb-cache/blob/690cf59/src/index.ts#L13)*

___

### `Private` ttlSeconds

• **ttlSeconds**: *number*

*Defined in [index.ts:14](https://github.com/einnjo/dynamodb-cache/blob/690cf59/src/index.ts#L14)*

## Methods

###  del

▸ **del**(`key`: string): *Promise‹void›*

*Defined in [index.ts:96](https://github.com/einnjo/dynamodb-cache/blob/690cf59/src/index.ts#L96)*

Deletes a key from the cache.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string |   |

**Returns:** *Promise‹void›*

___

###  get

▸ **get**(`key`: string, `defaultValue`: any): *Promise‹any›*

*Defined in [index.ts:52](https://github.com/einnjo/dynamodb-cache/blob/690cf59/src/index.ts#L52)*

Retrieves a the value of a cached key.
You can provide a default value to return in case the key is missing,
it defaults to undefined.
**Note:** Even if the key exists, it might still not be returned if the ttlAttribute constructor
option was set and the item is expired.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`key` | string | - | - |
`defaultValue` | any |  undefined | A value to use as the return value in case the key is missing, defaults to undefined.  |

**Returns:** *Promise‹any›*

___

### `Private` isTTLExpired

▸ **isTTLExpired**(`item`: DynamoDB.AttributeMap): *boolean*

*Defined in [index.ts:105](https://github.com/einnjo/dynamodb-cache/blob/690cf59/src/index.ts#L105)*

**Parameters:**

Name | Type |
------ | ------ |
`item` | DynamoDB.AttributeMap |

**Returns:** *boolean*

___

###  set

▸ **set**(`key`: string, `value`: T): *Promise‹void›*

*Defined in [index.ts:75](https://github.com/einnjo/dynamodb-cache/blob/690cf59/src/index.ts#L75)*

Stores a value under key in the cache.
If the ttlAttribute option was set in the constructor,
A delta of now + ttlSeconds will be stored in the ttl column.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | - |
`value` | T |   |

**Returns:** *Promise‹void›*
