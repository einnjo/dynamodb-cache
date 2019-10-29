import { now } from "./utils";

describe(now.name, () => {
  it("Returns the current date as a unix timestamp", () => {
    jest.spyOn(Date, "now").mockImplementation(() => 1000);
    expect(now()).toEqual(1);
  });

  it("Truncates when millis are inexact", () => {
    jest.spyOn(Date, "now").mockImplementation(() => 1001);
    expect(now()).toEqual(1);
  });
});
