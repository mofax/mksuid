# mksuid

K sortable unique id's with millisecond precision inspired by [ksuid](https://segment.com/blog/a-brief-history-of-the-uuid/)

## usage

```javascript
import mksuid, { parse } from "mksuid";

let id = mksuid();
// id === BiGJuaJPoJlIhdcAMnZ

let obj = parse(id);
// obj === { time: 2017-11-13T04:17:57.678Z, payload: <Buffer 23 17 38 6f 06 d5 8d 5a> }
```
