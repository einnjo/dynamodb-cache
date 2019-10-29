import { DynamoCache } from "./index";
import { DynamoDB } from "aws-sdk";

function mockDynamo(method: string, returnValue: any) {
  return {
    [method](_params: any) {
      return {
        promise() {
          return Promise.resolve(returnValue);
        }
      };
    }
  };
}

describe(DynamoCache.name, () => {
  describe("constructor", () => {
    it("Constructs a DynamoCache instance", () => {
      const instance = new DynamoCache({ tableName: "foo" });
      expect(instance).toBeInstanceOf(DynamoCache);
    });
  });

  describe("get", () => {
    it("Gets the value of a key in the cache", () => {
      const dynamo = mockDynamo("getItem", {
        Item: { key: { S: "foo" }, value: { S: '"bar"' } }
      });
      const instance = new DynamoCache({
        tableName: "foo",
        dynamo: (dynamo as unknown) as DynamoDB
      });
      expect(instance.get("foo")).resolves.toBe("bar");
    });
    it("Returns undefined if key is not in cache", () => {
      const dynamo = mockDynamo("getItem", {});
      const instance = new DynamoCache({
        tableName: "foo",
        dynamo: (dynamo as unknown) as DynamoDB
      });
      expect(instance.get("foo")).resolves.toBe(undefined);
    });
    it("Can specify return value for not found keys", () => {
      const dynamo = mockDynamo("getItem", {});
      const instance = new DynamoCache({
        tableName: "foo",
        dynamo: (dynamo as unknown) as DynamoDB
      });
      expect(instance.get("foo", false)).resolves.toBe(false);
    });
    it("Does not return value if item is expired", () => {
      const dynamo = mockDynamo("getItem", {
        Item: { key: { S: "foo" }, value: { S: '"bar"' }, ttl: { N: "1" } }
      });
      const instance = new DynamoCache({
        tableName: "foo",
        ttlAttribute: "ttl",
        dynamo: (dynamo as unknown) as DynamoDB
      });
      jest.spyOn(Date, "now").mockImplementation(() => 2000);
      expect(instance.get("foo")).resolves.toBeUndefined();
    });
    it("Returns value if item exists and is not expired", () => {
      const dynamo = mockDynamo("getItem", {
        Item: { key: { S: "foo" }, value: { S: '"bar"' }, ttl: { N: "2" } }
      });
      const instance = new DynamoCache({
        tableName: "foo",
        ttlAttribute: "ttl",
        dynamo: (dynamo as unknown) as DynamoDB
      });
      jest.spyOn(Date, "now").mockImplementation(() => 1000);
      expect(instance.get("foo")).resolves.toEqual("bar");
    });
  });

  describe("set", () => {
    it("Sets key in cache to specified value", () => {
      const dynamo = mockDynamo("putItem", {});
      jest.spyOn(dynamo, "putItem");
      const instance = new DynamoCache({
        tableName: "foo",
        dynamo: (dynamo as unknown) as DynamoDB
      });
      expect(instance.set("foo", true)).resolves.toBeUndefined();
      expect(dynamo.putItem).toHaveBeenCalledWith({
        TableName: "foo",
        Item: { key: { S: "foo" }, value: { S: "true" } }
      });
    });
    it("Sets key in cache to specified value (with ttlAttribute)", () => {
      const dynamo = mockDynamo("putItem", {});
      jest.spyOn(dynamo, "putItem");
      const instance = new DynamoCache({
        tableName: "foo",
        ttlAttribute: "ttl",
        ttlSeconds: 1,
        dynamo: (dynamo as unknown) as DynamoDB
      });
      jest.spyOn(Date, "now").mockImplementation(() => 1000);
      expect(instance.set("foo", true)).resolves.toBeUndefined();
      expect(dynamo.putItem).toHaveBeenCalledWith({
        TableName: "foo",
        Item: { key: { S: "foo" }, value: { S: "true" }, ttl: { N: "2" } }
      });
    });
  });

  describe("del", () => {
    it("Deletes a key in the cache", () => {
      const dynamo = mockDynamo("deleteItem", {});
      jest.spyOn(dynamo, "deleteItem");
      const instance = new DynamoCache({
        tableName: "foo",
        dynamo: (dynamo as unknown) as DynamoDB
      });
      expect(instance.del("foo")).resolves.toBeUndefined();
      expect(dynamo.deleteItem).toHaveBeenCalledWith({
        TableName: "foo",
        Key: { key: { S: "foo" } }
      });
    });
  });
});
