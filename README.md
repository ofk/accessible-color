# accessible-color

Generate color from contrast.

## Install

```sh
npm install accessible-color
```

## Usage

```js
import { gray, color } from 'accessible-color';

// Gray with WCAG Contrast 7 on white background
console.log(gray('white', 7).hex()); // => #595959

// Gray with WCAG Contrast 7 on black background
console.log(gray('black', 7).hex()); // => #959595

// Blue with WCAG Contrast 4.5 on white background
console.log(color('white', 4.5, 210).hex()); // => #0073e8

// Red with WCAG Contrast 4.5 on black background
console.log(color('black', 4.5, 0).hex()); // => #dc3332
```

The color returned by these functions are not stable.
But the contrast rate is guaranteed.
The algorithm will be updated.
