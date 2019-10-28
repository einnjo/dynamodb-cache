import { DynamoDB } from "aws-sdk";
import { PutItemInputAttributeMap } from "aws-sdk/clients/dynamodb";

import { now } from "./utils";
import { serializer, deserializer } from "./serde";

export class DynamoCache<T> {
  public tableName: string;
  private dynamo: DynamoDB;
  private ttlAttribute?: string;
  private ttlSeconds: number;
  private serializer: (value: T) => string;
  private deserializer: (value: string) => T;

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
