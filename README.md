# closure-modules
Google’s [Closure Library](https://github.com/google/closure-library) compiled to easy to use ES6 formats.

## Usage

```sh
# Compile
yarn compile
```

```js
import { goog } from "closure-modules";
import "closure-modules/lib/goog/math/rect";

export default new goog.math.Rect(NaN, NaN, NaN, NaN);
```
