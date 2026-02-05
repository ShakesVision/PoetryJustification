/*!
 * ShakeebJustify (Poetry Justification for Urdu / Nastaliq)
 * Author: Shakeeb Ahmad
 * Website: https://shakeeb.in
 * Version: 1.0.2
 * License: MIT
 */

(function (global) {

    function injectStyles() {
        if (document.getElementById('shakeeb-justify-style')) return;

        const style = document.createElement('style');
        style.id = 'shakeeb-justify-style';
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

        clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
        clone.querySelectorAll('p, div, li').forEach(b => b.append('\n'));

        return clone.textContent
            .replace(/\n\s*\n+/g, '\n')
            .trim();
    }

    function tabulate(str, gapEvery = 2) {
        if (!str.length) return 'یہاں اک شعر ہونا چاہیے تھا۔';

        const lines = str.split('\n').filter(Boolean);
        let rows = '';

        lines.forEach((line, i) => {
            const isGap = (i + 1) % gapEvery === 0;
            rows += `<tr${isGap ? ' class="gap"' : ''}><td>${line}</td></tr>`;
        });

        return `<table class="sher">${rows}</table>`;
    }

    function tabulate2(str) {
        if (!str.length) return 'یہاں اک شعر ہونا چاہیے تھا۔';

        const lines = str.split('\n').filter(Boolean);
        let rows = '';

        for (let i = 0; i < lines.length; i += 2) {
            const l1 = lines[i] || '';
            const l2 = lines[i + 1] || '';
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
        const lines = text.split('\n').filter(Boolean);
        const groups = groupLines(lines, pattern);

        el.innerHTML = groups.map(g => renderer(g.join('\n'), g.length)).join('');
    }

    function apply() {
        injectStyles();

        document.querySelectorAll('.sher').forEach(e =>
            e.innerHTML = tabulate(extractLines(e), 2)
        );

        document.querySelectorAll('.sher2').forEach(e =>
            e.innerHTML = tabulate2(extractLines(e))
        );

        document.querySelectorAll('.qata, .rubai').forEach(e =>
            formatByPattern(e, [4], tabulate)
        );

        document.querySelectorAll('.mukhammas').forEach(e =>
            formatByPattern(e, [5], tabulate)
        );

        document.querySelectorAll('.musaddas').forEach(e =>
            formatByPattern(e, [4, 2], tabulate)
        );

        document.querySelectorAll('.musaddas-6').forEach(e =>
            formatByPattern(e, [6], tabulate)
        );

        document.querySelectorAll('.musaddas-mixed').forEach(e => {
            const text = extractLines(e);
            const lines = text.split('\n').filter(Boolean);

            const first = lines.slice(0, 4).join('\n');
            const last = lines.slice(4, 6).join('\n');

            e.innerHTML = tabulate2(first) + tabulate(last, 2);
        });

        console.log(
            '%cShakeebJustify v1.0.2 applied — https://shakeeb.in',
            'color: green; font-weight: bold;'
        );
    }

    global.ShakeebJustify = {
        apply,
        tabulate,
        tabulate2
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply);
    } else {
        apply();
    }

})(window);
