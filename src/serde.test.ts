import { serializer, deserializer } from "./serde";

describe(serializer.name, () => {
  it("Serializes string to string", () => {
    expect(serializer("foo")).toEqual('"foo"');
  });
  it("Serializes number to string", () => {
    expect(serializer(42)).toEqual("42");
  });
  it("Serializes null to string", () => {
    expect(serializer(null)).toEqual("null");
  });
  it("Serializes undefined to string", () => {
    expect(serializer(undefined)).toEqual(undefined);
  });
  it("Serializes boolean to string", () => {
    expect(serializer(true)).toEqual("true");
    expect(serializer(false)).toEqual("false");
  });
  it("Serializes object to string", () => {
    expect(
      serializer({
        string: "string",
        number: 42,
        boolean: true,
        null: null,
        undefined: undefined
      })
    ).toEqual('{"string":"string","number":42,"boolean":true,"null":null}');
  });
});

describe(deserializer.name, () => {
  it("Deserializes string to string", () => {
    expect(deserializer('"foo"')).toEqual("foo");
  });
  it("Deserializes string to number", () => {
    expect(deserializer("42")).toEqual(42);
  });
  it("Deserializes string to null", () => {
    expect(deserializer("null")).toEqual(null);
  });
  it("Deserializes string to boolean", () => {
    expect(deserializer("true")).toEqual(true);
    expect(deserializer("false")).toEqual(false);
  });
  it("Deserializes string to object", () => {
    expect(
      deserializer('{"string":"string","number":42,"boolean":true,"null":null}')
    ).toEqual({
      string: "string",
      number: 42,
      boolean: true,
      null: null,
      undefined: undefined
    });
  });
});
