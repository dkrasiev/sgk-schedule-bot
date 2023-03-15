import { getArgument } from "../src/utils/get-argument";

describe("getArgument function", () => {
  it("should return a string after a command", () => {
    expect(getArgument("/schedule ис1904")).toBe("ис1904");
  });

  it("should return an empty string if no command in text", () => {
    expect(getArgument("schedule ис1904")).toBe("schedule ис1904");
  });

  it("should return a trimmed string", () => {
    expect(getArgument("   ")).toBe("");
  });

  it("should return an empty string for a command without arguments", () => {
    expect(getArgument("/setdefault")).toBe("");
  });

  it("should return an empty string if input string is empty", () => {
    expect(getArgument("")).toBe("");
  });

  it("should return a string in lower case", () => {
    expect(getArgument("/schedule ИС1904 ТЕСТ  ")).toBe("ис1904 тест");
  });
});
