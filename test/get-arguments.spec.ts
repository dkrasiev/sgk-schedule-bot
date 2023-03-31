import { getArguments } from "../src/utils/get-arguments";

describe("getArguments function", () => {
  it("should return a string after a command", () => {
    expect(getArguments("/schedule ис1904")).toEqual(["/schedule", "ис1904"]);
  });

  it("should return an empty string if no command in text", () => {
    expect(getArguments("schedule ис1904")).toEqual(["schedule", "ис1904"]);
  });

  it("should return a trimmed string", () => {
    expect(getArguments("   ")).toEqual([]);
  });

  it("should return an empty string for a command without arguments", () => {
    expect(getArguments("/setdefault")).toEqual(["/setdefault"]);
  });

  it("should return an empty string if input string is empty", () => {
    expect(getArguments("")).toEqual([]);
  });

  it("should return a string in lower case", () => {
    expect(getArguments("/schedule ИС1904 ТЕСТ  ")).toEqual([
      "/schedule",
      "ис1904",
      "тест",
    ]);
  });
});
