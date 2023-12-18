# accessible-color

Generate color from contrast.

## Install

```sh
npm install accessible-color
```

## Usage

```js
import { gray, color } from 'accessible-color';
import { formatHex } from 'culori';

// Gray with WCAG Contrast 7 on white background
console.log(formatHex(gray('white', 7))); // => #595959

// Gray with WCAG Contrast 7 on black background
console.log(formatHex(gray('black', 7))); // => #959595

// Blue with WCAG Contrast 4.5 on white background
console.log(formatHex(color('white', 4.5, 255))); // => #2477d5

// Red with WCAG Contrast 4.5 on black background
console.log(formatHex(color('black', 4.5, 25))); // => #de2c34
```

The color returned by these functions are not stable.
But the contrast rate is guaranteed.
The algorithm will be updated.
