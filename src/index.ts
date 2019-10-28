import { DynamoDB } from "aws-sdk";
import { PutItemInputAttributeMap } from "aws-sdk/clients/dynamodb";

import { now } from "./utils";
import { serializer, deserializer } from "./serde";

/**
 * A simple cache build around DynamoDB.
 */
export class DynamoCache<T> {
  public tableName: string;
  private dynamo: DynamoDB;
  private ttlAttribute?: string;
  private ttlSeconds: number;
  private serializer: (value: T) => string;
  private deserializer: (value: string) => T;

  /**
   * Returns a new DynamoCache instance.
   * @param options
   * @param options.tableName The name of your existing DynamoDB table.
   * @param options.ttlAttribute The attribute where ttl is stored, should be of type Number and store the unix timestamp in seconds.
   * @param options.ttlSeconds When a new item is inserted, it'll expired after this number of seconds defaults to 300 seconds (5 minutes).
   * @param options.serializer A serializer function that converts your input type to string for storage.
   * @param options.deserializer A deserializer function that converts your input type from string to your input type for retrieval.
   */
  constructor(options: {
    tableName: string;
    ttlAttribute?: string;
    ttlSeconds?: number;
    dynamo?: DynamoDB;
    serializer?: (value: T) => string;
    deserializer?: (value: string) => T;
  }) {
    this.tableName = options.tableName;
    this.dynamo = options.dynamo || new DynamoDB();
    this.ttlAttribute = options.ttlAttribute;
    this.ttlSeconds = options.ttlSeconds || 60 * 5;
    this.serializer = options.serializer || serializer;
    this.deserializer = options.deserializer || deserializer;
  }

  /**
   * Retrieves a the value of a cached key.
   * You can provide a default value to return in case the key is missing,
   * it defaults to undefined.
   * **Note:** Even if the key exists, it might still not be returned if the ttlAttribute constructor
   * option was set and the item is expired.
   * @param key
   * @param defaultValue - A value to use as the return value in case the key is missing, defaults to undefined.
   */
  async get(key: string, defaultValue: any = undefined) {
    const response = await this.dynamo
      .getItem({
        TableName: this.tableName,
        Key: { key: { S: key } }
      })
      .promise();

    const value = response.Item && response.Item.value && response.Item.value.S;
    if (!value || this.isTTLExpired(response.Item || {})) {
      return defaultValue;
    }

    return this.deserializer(value);
  }

  /**
   * Stores a value under key in the cache.
   * If the ttlAttribute option was set in the constructor,
   * A delta of now + ttlSeconds will be stored in the ttl column.
   * @param key
   * @param value
   */
  async set(key: string, value: T) {
    const item: PutItemInputAttributeMap = {
      key: { S: key },
      value: { S: this.serializer(value) }
    };
    if (this.ttlAttribute) {
      const ttl = now() + this.ttlSeconds;
      item[this.ttlAttribute] = { N: ttl.toString() };
    }
    await this.dynamo
      .putItem({
        TableName: this.tableName,
        Item: item
      })
      .promise();
  }

  /**
   * Deletes a key from the cache.
   * @param key
   */
  async del(key: string) {
    await this.dynamo
      .deleteItem({
        TableName: this.tableName,
        Key: { key: { S: key } }
      })
      .promise();
  }

  private isTTLExpired(item: DynamoDB.AttributeMap) {
    if (this.ttlAttribute == null) {
      return false;
    }

    const ttl = item[this.ttlAttribute] && item[this.ttlAttribute].N;
    const expiredTTL = ttl && parseInt(ttl, 10) < now();
    if (expiredTTL) {
      return true;
    } else {
      return false;
    }
  }
}
