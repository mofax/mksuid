import baseX from "base-x";

const baseAlpha =
	"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const base62 = baseX(baseAlpha);

const TIME_LENGTH_IN_BYTES = 6;
const PAYLOAD_LENGTH_IN_BYTES = 14;
const RAW_ID_LENGTH = 1 + TIME_LENGTH_IN_BYTES + PAYLOAD_LENGTH_IN_BYTES; // +1 for time length byte
const MAX_TIMESTAMP_VALUE = Math.pow(2, 8 * TIME_LENGTH_IN_BYTES) - 1;

function getTime(date?: Date): Uint8Array {
	let timestamp = (date ?? new Date()).getTime();
	if (timestamp > MAX_TIMESTAMP_VALUE) {
		throw new Error(
			`Timestamp too large to fit in ${TIME_LENGTH_IN_BYTES} bytes`
		);
	}

	const buffer = new Uint8Array(TIME_LENGTH_IN_BYTES);
	for (let i = TIME_LENGTH_IN_BYTES - 1; i >= 0; i--) {
		buffer[i] = timestamp & 0xff;
		timestamp = Math.floor(timestamp / 256);
	}

	return buffer;
}

function getPayload(): Uint8Array {
	const bytes = new Uint8Array(PAYLOAD_LENGTH_IN_BYTES);
	crypto.getRandomValues(bytes);
	return bytes;
}

export default function mKsuid(date?: Date): string {
	const time = getTime(date);
	const payload = getPayload();
	const lengthByte = new Uint8Array([TIME_LENGTH_IN_BYTES]);
	const rawId = new Uint8Array(
		lengthByte.length + time.length + payload.length
	);
	rawId.set(lengthByte, 0);
	rawId.set(time, lengthByte.length);
	rawId.set(payload, lengthByte.length + time.length);

	return base62.encode(rawId); // base62.encode should accept Uint8Array
}

function parse(str: string): { time: Date; payload: Uint8Array } {
	const decoded = base62.decode(str);
	if (decoded.length !== RAW_ID_LENGTH) {
		throw new Error(
			`Invalid mKsuid: expected ${RAW_ID_LENGTH} bytes, got ${decoded.length}`
		);
	}

	const timeLength = decoded[0];
	if (timeLength !== TIME_LENGTH_IN_BYTES) {
		throw new Error(`Unsupported timestamp length: ${timeLength} bytes`);
	}

	const time = decoded.subarray(1, 1 + timeLength);
	const payload = decoded.subarray(1 + timeLength);

	const timestamp = Buffer.from(time).readUIntBE(0, timeLength);

	return {
		time: new Date(timestamp),
		payload,
	};
}

export { parse };
