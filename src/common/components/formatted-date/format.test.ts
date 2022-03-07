import format from "./format";

describe("format", () => {
  it("should format date correctly in Finnish", async () => {
    expect(format("2022-01-02T03:04:00.000Z", "fi")).toEqual("2.1.2022, 3.04");
  });

  it("should format date correctly in Swedish", async () => {
    expect(format("2022-01-02T03:04:00.000Z", "sv")).toEqual(
      "2.1.2022 kl. 3.04"
    );
  });

  it("should format date correctly in English", async () => {
    expect(format("2022-01-02T03:04:00.000Z", "en")).toEqual(
      "01/02/2022, 3.04"
    );
  });

  it("should use 24 hour clock in English", async () => {
    expect(format("2022-01-02T12:04:00.000Z", "en")).toEqual(
      "01/02/2022, 12.04"
    );
  });
});
