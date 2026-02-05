/*!
 * ShakeebJustify (Poetry Justification for Urdu / Nastaliq)
 * Author: Shakeeb Ahmad
 * Website: https://shakeeb.in
 * Version: 1.0.4
 * License: MIT
 */

(function (global) {

    /* -------------------- STYLES -------------------- */

    function injectStyles() {
        if (document.getElementById('shakeeb-justify-style')) return;

        const style = document.createElement('style');
        style.id = 'shakeeb-justify-style';
        style.textContent = `
            table {
                border-collapse: collapse;
                margin: 0 auto;
            }

            .sher, .sher td,
            .sher2, .sher2 td {
                text-align: justify;
                text-align-last: justify;
                direction: rtl;
                line-height: 1.5em;
                unicode-bidi: plaintext;
            }

            .sher2 td { width: 46%; }
            .sher2 tr td:nth-child(2) { width: 10%; }

            tr.gap td { padding-bottom: 15px; }
        `;
        document.head.appendChild(style);
    }

    /* -------------------- TEXT NORMALIZATION -------------------- */

    function extractLines(el) {
        const clone = el.cloneNode(true);

        clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
        clone.querySelectorAll('p, div, li').forEach(b => b.append('\n'));

        return clone.textContent
            .replace(/\n\s*\n+/g, '\n')
            .trim();
    }

    /* -------------------- BASIC RENDERERS -------------------- */

    function tabulate(str, gapEvery = null) {
        if (!str) return '';

        const lines = str.split('\n').filter(Boolean);
        let rows = '';

        lines.forEach((line, i) => {
            const gap = gapEvery && (i + 1) % gapEvery === 0;
            rows += `<tr${gap ? ' class="gap"' : ''}><td>${line}</td></tr>`;
        });

        return `<table class="sher">${rows}</table>`;
    }

    function tabulate2(str) {
        if (!str) return '';

        const lines = str.split('\n').filter(Boolean);
        let rows = '';

        for (let i = 0; i < lines.length; i += 2) {
            rows += `
                <tr class="gap">
                    <td>${lines[i] || ''}</td>
                    <td></td>
                    <td>${lines[i + 1] || ''}</td>
                </tr>
            `;
        }

        return `<table class="sher2">${rows}</table>`;
    }

    /* -------------------- PATTERN HELPERS -------------------- */

    function parsePattern(str) {
        if (!str) return null;
        return str.split('+').map(n => parseInt(n, 10)).filter(Boolean);
    }

    function groupLines(lines, pattern) {
        const groups = [];
        let i = 0;

        while (i < lines.length) {
            for (let size of pattern) {
                if (i >= lines.length) break;
                groups.push(lines.slice(i, i + size));
                i += size;
            }
        }
        return groups;
    }

    function renderPattern(el, pattern) {
        const text = extractLines(el);
        const lines = text.split('\n').filter(Boolean);
        const groups = groupLines(lines, pattern);

        el.innerHTML = groups
            .map(g => tabulate(g.join('\n')))
            .join('');
    }

    /* -------------------- MIXED LAYOUT -------------------- */
    /*
       data-mixed syntax:
       "4:2col,2:1col"
       "3:1col,2:1col"
       "4:2col,1:1col"
    */

    function parseMixed(str) {
        return str.split(',').map(part => {
            const [count, mode] = part.split(':');
            return {
                count: parseInt(count, 10),
                mode: mode
            };
        });
    }

    function renderMixedAdvanced(el, mixedSpec) {
        const text = extractLines(el);
        const lines = text.split('\n').filter(Boolean);

        let i = 0;
        let html = '';

        mixedSpec.forEach(spec => {
            const chunk = lines.slice(i, i + spec.count).join('\n');
            i += spec.count;

            if (spec.mode === '2col') {
                html += tabulate2(chunk);
            } else {
                html += tabulate(chunk);
            }
        });

        el.innerHTML = html;
    }

    /* -------------------- APPLY -------------------- */

    function apply() {
        injectStyles();

        /* Base sher */
        document.querySelectorAll('.sher').forEach(e =>
            e.innerHTML = tabulate(extractLines(e), 2)
        );

        document.querySelectorAll('.sher2').forEach(e =>
            e.innerHTML = tabulate2(extractLines(e))
        );

        /* Mukhammas */
        document.querySelectorAll('.mukhammas').forEach(e =>
            renderPattern(e, [5])
        );

        document.querySelectorAll('.mukhammas-3-2').forEach(e =>
            renderPattern(e, [3, 2])
        );

        document.querySelectorAll('.mukhammas-mixed').forEach(e =>
            renderMixedAdvanced(e, [
                { count: 4, mode: '2col' },
                { count: 1, mode: '1col' }
            ])
        );

        /* Musaddas */
        document.querySelectorAll('.musaddas').forEach(e =>
            renderPattern(e, [4, 2])
        );

        document.querySelectorAll('.musaddas-6').forEach(e =>
            renderPattern(e, [6])
        );

        document.querySelectorAll('.musaddas-mixed').forEach(e =>
            renderMixedAdvanced(e, [
                { count: 4, mode: '2col' },
                { count: 2, mode: '1col' }
            ])
        );

        /* data-pattern override */
        document.querySelectorAll('[data-pattern]').forEach(e => {
            const pattern = parsePattern(e.dataset.pattern);
            if (pattern) renderPattern(e, pattern);
        });

        /* data-mixed override */
        document.querySelectorAll('[data-mixed]').forEach(e => {
            const spec = parseMixed(e.dataset.mixed);
            if (spec) renderMixedAdvanced(e, spec);
        });

        console.log(
            '%cShakeebJustify applied — data-pattern & data-mixed enabled',
            'color: green; font-weight: bold;'
        );
    }

    global.ShakeebJustify = { apply };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply);
    } else {
        apply();
    }

})(window);
