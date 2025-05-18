import ksuid, { parse } from "./index";
import { describe, it, expect } from "bun:test";

describe("ksuid tests", () => {
	it("generates valid ids", () => {
		let id = ksuid();
		console.log(id);
		expect(typeof id).toBe("string");
		expect(id.length).toBe(26);
	});

	it("generates ids with specific dates", () => {
		let date = new Date();
		let id = ksuid(date);
		console.log(id);
		let obj = parse(id);
		let objTime = new Date(obj.time);
		expect(date.getTime()).toBe(objTime.getTime());
	});
});
