import { randomBytes } from "crypto";
import * as baseX from "base-x";

const baseAlpha =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const base62 = baseX(baseAlpha);

const ID_LENGTH = 20;
const TIME_LENGTH = 7;
const PAYLOAD_LENGTH = 13;

function getTime(date?: Date) {
  let _date = date === undefined ? new Date() : date;
  let timeStr = `0${_date.getTime()}`;
  if (timeStr.length !== TIME_LENGTH * 2)
    throw new Error(
      `time length should be ${TIME_LENGTH * 2} generated ${timeStr.length}`
    );
  return Buffer.from(timeStr, "hex");
}

function getPayload() {
  let bytes = randomBytes(PAYLOAD_LENGTH);
  return bytes;
}

export default function mKsuid(date?: Date) {
  let time = getTime(date);
  let payload = getPayload();
  let id = Buffer.concat([time, payload]);
  return base62.encode(id);
}

function parse(str: string) {
  let id = base62.decode(str);
  if (id.length !== ID_LENGTH) throw new Error(`invalid mksuid`);
  let timeLength = TIME_LENGTH;
  let payloadLength = PAYLOAD_LENGTH;
  let time = Buffer.allocUnsafe(timeLength);
  let payload = Buffer.allocUnsafe(payloadLength);
  for (let i = 0; i < id.length; i++) {
    if (i < timeLength) {
      time[i] = id[i];
    } else {
      payload[i - timeLength] = id[i];
    }
  }

  let timeStr = time.toString("hex");

  return {
    time: new Date(parseInt(timeStr)),
    payload,
  };
}

export { parse };
