# Use (older instructions, please scroll for completely automated script)

1. Add the script and styles in the pages you want. Refer index.html file in the doc folder for the code.
2. Add a new

- `<div class="sher"></div>` for one column and
- `<div class="sher2"></div>` for two columns.

3. Write poetry lines inside div tags.

# Features

Double column

- Distributed by space you can change
- Responsive, as width are defined using percentages
- Both column widths are same irrespective of the content length in them

Single column

- Gap after every she'r (2 lines)

# Demo

https://shakesvision.github.io/PoetryJustification/

Star the repo if you've used it.

Want to see more interesting stuff? Here's my Urdu blog: https://ur.shakeeb.in/

# ShakeebJustify — Poetry Justification for Urdu

A small JS library by **Shakeeb Ahmad** (https://shakeeb.in), which automatically formats Urdu `sher` and `sher2` content into beautifully justified tables with no extra CSS needed—just include the script.

## Features

- Auto-injects necessary CSS styling (fonts, alignment, RTL, spacing).
- Justifies `.sher` and `.sher2` elements in one or two columns.
- Zero-configuration: just `<script>` and go.
- Console branding and attribution!

---

## Installation

### CDN (via jsDelivr)

```html
<script src="https://cdn.jsdelivr.net/gh/shakesvision/PoetryJustification@1.0.0/dist/shakeeb-justify.min.js"></script>
```

### 📦 NPM Installation (Optional)

> You can skip this if you're just using the CDN, but if you want to use this in a bundler setup:

`npm install shakeeb-justify`

Then import and use it:

`import { ShakeebJustify } from 'shakeeb-justify';  ShakeebJustify.apply(); // Apply formatting to all sher/sher2 blocks`

### ✍️ Usage

Add your poetry as plain text inside a .sher (1-column) or .sher2 (2-column) block:

`پہلا مصرع  دوسرا مصرع  پہلا مصرع  دوسرا مصرع  تیسرا مصرع  چوتھا مصرع`

The script will:

- Replace line breaks with table rows
- Force justify each line (text-align-last: justify)
- Auto-format for 1 or 2 column display

#### ✅ Automatic Mode

Just drop this script on your page:

`<script src="https://cdn.jsdelivr.net/gh/shakesvision/PoetryJustification@1.0.0/dist/shakeeb-justify.min.js"></script>`

It runs automatically when the page loads.

#### 🧠 Manual Mode (Optional)

You can manually trigger formatting:

`ShakeebJustify.apply();`

### 🛠️ Development

Clone the repo and install dependencies:

```
git clone https://github.com/shakeeb/poetry-justify.git
cd poetry-justify
npm install
```

To build a minified version:

`npm run build`

That will create dist/shakeeb-justify.min.js using terser.

### License

MIT License © 2020 **Shakeeb Ahmad** — https://shakeeb.in

You’re free to use, modify, distribute — just retain attribution in your builds. 🙏
