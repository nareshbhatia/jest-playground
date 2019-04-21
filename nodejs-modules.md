# Node.js Modules

## TL;DR

-   `module.exports` is an object that gets returned from a module when it is
    required.
-   `exports` is a convenience variable which references `module.exports`.
    `exports` itself is never returned.

## Exporting multiple items using module.exports

a.k.a. multiple named exports

```ecmascript 6
// ----- circle.js -----
const { PI } = Math;

const area = (r) => PI * r ** 2;

const circumference = (r) => 2 * PI * r;

module.exports = {
    area: area,
    circumference: circumference
}
```

The exports can be used like this:

```ecmascript 6
// ----- main.js -----
const circle = require('./circle.js');

const area = circle.area(5);
```

exports can be destructured:

```ecmascript 6
// ----- main.js -----
const { area } = require('./circle.js');

const area = area(5);
```

## Exporting multiple items using the exports shortcut

```ecmascript 6
// ----- circle.js -----
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```

## Exporting a single item using module.exports

a.k.a. default export

```ecmascript 6
// ----- sum.js -----
module.exports = (a, b) => a + b;
```

The exports can be used like this:

```ecmascript 6
// ----- main.js -----
const sum = require('./sum.js');

const total = sum(5);
```
