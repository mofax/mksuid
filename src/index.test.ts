import ksuid, { parse } from "./index";

describe("ksuid tests", () => {
  it("generates valid ids", () => {
    let id = ksuid();
    expect(typeof id).toBe("string");
    expect(id.length).toBe(19);
  });

  it("generates ids with specific dates", () => {
    let date = new Date();
    let id = ksuid(date);
    let obj = parse(id);
    let objTime = new Date(obj.time);
    expect(date.getTime()).toBe(objTime.getTime());
  });

});
