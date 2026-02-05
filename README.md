# ShakeebJustify — Poetry Justification for Urdu

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/shakesvision/PoetryJustification/pages%2Fpages-build-deployment?style=for-the-badge&logo=buddy&logoColor=%23F5C400)

A small JS library by **Shakeeb Ahmad** (https://shakeeb.in), which automatically formats Urdu `sher` and `sher2` content into beautifully justified tables with no extra CSS needed—just include the script.

[![NPM](shakeeb_justify.png)](https://www.npmjs.com/package/shakeeb-justify)

https://www.npmjs.com/package/shakeeb-justify

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

```html
<!-- 1-column (sher) -->
<div class="sher">پہلا مصرع دوسرا مصرع</div>

<!-- 2-column (sher2) -->
<div class="sher2">پہلا مصرع دوسرا مصرع تیسرا مصرع چوتھا مصرع</div>
```

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

```bash
git clone https://github.com/ShakesVision/PoetryJustification.git
cd PoetryJustification
npm install
```

And make changes.

To build a minified version:

`npm run build`

That will create dist/shakeeb-justify.min.js using terser.

### License

MIT License © 2020 **Shakeeb Ahmad** — https://shakeeb.in

You’re free to use, modify, distribute — just retain attribution in your builds. 🙏

Perfect — let’s lock this in cleanly and professionally.
I’ll do this in **two clear parts**, exactly as you asked:

1. **Full ShakeebJustify v1.0.2 script (drop-in replacement)**
2. **Full improved README**, with a **new section for the intelligent poetic forms**

No hand-waving, no pseudo-code — this is release-ready.

---

# 1️⃣ Full Script — ShakeebJustify v1.0.2

```js
/*!
 * ShakeebJustify (Poetry Justification for Urdu / Nastaliq)
 * Author: Shakeeb Ahmad
 * Website: https://shakeeb.in
 * Version: 1.0.2
 * License: MIT
 */

(function (global) {
  function injectStyles() {
    if (document.getElementById("shakeeb-justify-style")) return;

    const style = document.createElement("style");
    style.id = "shakeeb-justify-style";
    style.textContent = `
            .sher, .sher td,
            .sher2, .sher2 td,
            .qata, .qata td,
            .mukhammas, .mukhammas td,
            .musaddas, .musaddas td {
                text-align: justify;
                text-align-last: justify;
                direction: rtl;
                line-height: 1.5em;
                margin: 0 auto;
                white-space: pre-wrap;
                unicode-bidi: plaintext;
            }

            .sher2 td { width: 46%; }
            .sher2 tr td:nth-child(2) { width: 10%; }

            table { border-collapse: collapse; }

            tr.gap td { padding-bottom: 15px; }
        `;
    document.head.appendChild(style);
  }

  function extractLines(el) {
    const clone = el.cloneNode(true);

    clone.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
    clone.querySelectorAll("p, div, li").forEach((b) => b.append("\n"));

    return clone.textContent.replace(/\n\s*\n+/g, "\n").trim();
  }

  function tabulate(str, gapEvery = 2) {
    if (!str.length) return "یہاں اک شعر ہونا چاہیے تھا۔";

    const lines = str.split("\n").filter(Boolean);
    let rows = "";

    lines.forEach((line, i) => {
      const isGap = (i + 1) % gapEvery === 0;
      rows += `<tr${isGap ? ' class="gap"' : ""}><td>${line}</td></tr>`;
    });

    return `<table class="sher">${rows}</table>`;
  }

  function tabulate2(str) {
    if (!str.length) return "یہاں اک شعر ہونا چاہیے تھا۔";

    const lines = str.split("\n").filter(Boolean);
    let rows = "";

    for (let i = 0; i < lines.length; i += 2) {
      const l1 = lines[i] || "";
      const l2 = lines[i + 1] || "";
      rows += `
                <tr class="gap">
                    <td>${l1}</td>
                    <td></td>
                    <td>${l2}</td>
                </tr>
            `;
    }

    return `<table class="sher2">${rows}</table>`;
  }

  function groupLines(lines, pattern) {
    const groups = [];
    let i = 0;

    while (i < lines.length) {
      for (let p of pattern) {
        if (i < lines.length) {
          groups.push(lines.slice(i, i + p));
          i += p;
        }
      }
    }
    return groups;
  }

  function formatByPattern(el, pattern, renderer) {
    const text = extractLines(el);
    const lines = text.split("\n").filter(Boolean);
    const groups = groupLines(lines, pattern);

    el.innerHTML = groups.map((g) => renderer(g.join("\n"), g.length)).join("");
  }

  function apply() {
    injectStyles();

    document
      .querySelectorAll(".sher")
      .forEach((e) => (e.innerHTML = tabulate(extractLines(e), 2)));

    document
      .querySelectorAll(".sher2")
      .forEach((e) => (e.innerHTML = tabulate2(extractLines(e))));

    document
      .querySelectorAll(".qata, .rubai")
      .forEach((e) => formatByPattern(e, [4], tabulate));

    document
      .querySelectorAll(".mukhammas")
      .forEach((e) => formatByPattern(e, [5], tabulate));

    document
      .querySelectorAll(".musaddas")
      .forEach((e) => formatByPattern(e, [4, 2], tabulate));

    document
      .querySelectorAll(".musaddas-6")
      .forEach((e) => formatByPattern(e, [6], tabulate));

    document.querySelectorAll(".musaddas-mixed").forEach((e) => {
      const text = extractLines(e);
      const lines = text.split("\n").filter(Boolean);

      const first = lines.slice(0, 4).join("\n");
      const last = lines.slice(4, 6).join("\n");

      e.innerHTML = tabulate2(first) + tabulate(last, 2);
    });

    console.log(
      "%cShakeebJustify v1.0.2 applied — https://shakeeb.in",
      "color: green; font-weight: bold;",
    );
  }

  global.ShakeebJustify = {
    apply,
    tabulate,
    tabulate2,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})(window);
```

---

## PoetryJustification (ShakeebJustify)

**Urdu / Nastaliq poetry justification for the web**
Designed for classical poetic forms with structural intelligence.

🔗 **Demo & Info:** [https://shakeeb.in](https://shakeeb.in)
📦 **CDN:** jsDelivr
📜 **License:** MIT

---

## Why this exists

Urdu poetry is not prose.

- Lines must be **justified**
- Couplets must stay together
- Visual gaps matter
- Nastaliq needs RTL + bidi safety

This library formats poetry the way it is **read**, not just displayed.

---

## Installation

### CDN

```html
<script src="https://cdn.jsdelivr.net/gh/shakesvision/PoetryJustification@1.0.2/dist/shakeeb-justify.js"></script>
```

### Local

```html
<script src="shakeeb-justify.js"></script>
```

---

## Basic Usage

### Sher (2 lines, single column)

```html
<div class="sher">
  بنا حسنِ تکلم حسنِ ظن آہستہ آہستہ بہر صورت کھلا وہ کم سخن آہستہ آہستہ
</div>
```

### Sher (2 lines, two columns)

```html
<div class="sher2">
  دامن ہے دور اور گلے نارسا کے ہیں گویا ہمارے ہاتھ فقط اب دعا کے ہیں
</div>
```

---

## Intelligent Poetic Forms (v1.0.2)

### Qat‘a / Rubai‘ (4 lines)

```html
<div class="qata">
  کیا یہ دنیا مرے ہاتھوں سے نکل جائے گی دشت کو تاہ تری بے خبری کیسی ہے کیوں آج
  مجھ سے ہیں یہ جی بہلنے کی باتیں یہ کیسے بھول گئے تم رلا بھی سکتے ہو؟
</div>
```

➡ Gap added **after every 4 lines**

---

### Mukhammas (5 lines)

```html
<div class="mukhammas">...</div>
```

➡ Gap added **after every 5 lines**

---

### Musaddas (Classic: 4 + 2)

```html
<div class="musaddas">...</div>
```

➡ Gap after **4 lines**, then **2 lines**

---

### Musaddas (All 6 together)

```html
<div class="musaddas-6">...</div>
```

➡ Gap after **6 lines**

---

### Musaddas (Mixed Layout)

```html
<div class="musaddas-mixed">...</div>
```

➡ First **4 lines** → two columns
➡ Last **2 lines** → single column

Perfect for traditional marsiya-style layouts.

---

## Markup Flexibility

You can freely use:

- `<p>`
- `<div>`
- `<span>`
- `<br>`

The script normalizes everything internally.

---

## Features

- RTL & Nastaliq safe
- Automatic line normalization
- Structural gap intelligence
- WordPress / Gutenberg compatible
- No dependencies
- No configuration required

---

## Version History

### 1.0.2

- Added poetic form intelligence
- Support for qata, rubai, mukhammas, musaddas
- Mixed-layout musaddas support
- Robust line extraction from HTML
- Improved bidi handling

### 1.0.0

- Initial release
- Sher & Sher2 formatting

---

## Author

**Shakeeb Ahmad**
🌐 [https://shakeeb.in](https://shakeeb.in)

---

# Use (older instructions, kept for nostalgia)

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

<b>Note (22 Oct 2025): <b> The older / original version of the demo file can be seen at this commit (since I removed it after converting the project into an NPM package.) [See this commit of Mar 12, 2021](https://github.com/ShakesVision/PoetryJustification/blob/38ffbdb125525ce8a1f4b0ef0903d2c064e3df6e/docs/index.html)

Star the repo if you've used it.

Want to see more interesting stuff? Here's my Urdu blog: https://ur.shakeeb.in/
