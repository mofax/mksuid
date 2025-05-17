import { randomBytes } from "crypto";
import * as baseX from "base-x";

const baseAlpha = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const base62 = baseX(baseAlpha);

const TIME_LENGTH = 7;
const PAYLOAD_LENGTH = 13;
const RAW_ID_LENGTH = TIME_LENGTH + PAYLOAD_LENGTH;

function getTime(date?: Date): Buffer {
	const timestamp = (date ?? new Date()).getTime();
	const buffer = Buffer.alloc(TIME_LENGTH);
	buffer.writeUIntBE(timestamp, 0, TIME_LENGTH);
	return buffer;
}

function getPayload(): Buffer {
	return randomBytes(PAYLOAD_LENGTH);
}

export default function mKsuid(date?: Date): string {
	const time = getTime(date);
	const payload = getPayload();
	const rawId = Buffer.concat([time, payload]);
	return base62.encode(rawId);
}

function parse(str: string): { time: Date; payload: Buffer } {
	const decoded = base62.decode(str);
	if (decoded.length !== RAW_ID_LENGTH) {
		throw new Error(`Invalid mKsuid: expected ${RAW_ID_LENGTH} bytes, got ${decoded.length}`);
	}

	const time = decoded.subarray(0, TIME_LENGTH);
	const payload = decoded.subarray(TIME_LENGTH);

	const timestamp = time.readUIntBE(0, TIME_LENGTH);

	return {
		time: new Date(timestamp),
		payload,
	};
}

export { parse };
