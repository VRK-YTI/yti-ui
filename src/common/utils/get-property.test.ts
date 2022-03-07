import { Organization } from "../interfaces/organization.interface";
import { Term } from "../interfaces/term.interface";
import { getProperty } from "./get-property";

describe("getProperty", () => {
  test("should work with Term", () => {
    const items: Term[] = [{ properties: {} }] as Term[];

    expect(getProperty("prefLabel", items)).toEqual([]);
  });

  test("should work with Organization", () => {
    const items: Organization[] = [{ properties: {} }] as Organization[];

    expect(getProperty("prefLabel", items)).toEqual([]);
  });

  test("should return correct property", () => {
    const items: Term[] = [
      {
        properties: {
          prefLabel: [{ value: "A" }],
          changeNote: [{ value: "B" }],
        },
      },
    ] as Term[];

    expect(getProperty("prefLabel", items)).toEqual([{ value: "A" }]);
  });

  test("should merge properties of multiple items", () => {
    const items: Term[] = [
      {
        properties: {
          prefLabel: [{ value: "A" }],
        },
      },
      {
        properties: {
          prefLabel: [{ value: "B" }],
        },
      },
    ] as Term[];

    expect(getProperty("prefLabel", items)).toEqual([
      { value: "A" },
      { value: "B" },
    ]);
  });
});
