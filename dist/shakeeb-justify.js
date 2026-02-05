/*!
 * ShakeebJustify (Poetry Justification for Urdu / Nastaliq)
 * Author: Shakeeb Ahmad
 * Website: https://shakeeb.in
 * Version: 1.0.6
 * License: MIT
 */

(function (global) {

    /* -------------------- STYLES -------------------- */

    function injectStyles() {
        if (document.getElementById('shakeeb-justify-style')) return;

        const style = document.createElement('style');
        style.id = 'shakeeb-justify-style';
        style.textContent = `
            /* Base table styles - namespaced to avoid conflicts */
            .shakeeb-justify {
                border-collapse: collapse;
                margin: 0 auto;
                position: relative;
            }

            /* Common text styles for all poetry elements */
            .shakeeb-justify td {
                text-align: justify;
                text-align-last: justify;
                direction: rtl;
                line-height: 1.5em;
                unicode-bidi: plaintext;
            }

            /* Two-column layout widths */
            .shakeeb-justify.sher2 td { width: 46%; }
            .shakeeb-justify.sher2 td.spacer-cell { width: 10%; }

            /* Spacer row for gaps between stanzas */
            .shakeeb-justify tr.spacer td {
                height: 15px;
                padding: 0;
            }

            /* Hidden newline for proper copy behavior - invisible but copyable */
            .shakeeb-justify .sj-nl {
                position: absolute;
                left: -9999px;
                font-size: 0;
                line-height: 0;
                white-space: pre;
            }

            /* -------------------- COPY BUTTON STYLES -------------------- */
            
            /* Container needs relative positioning for button */
            .sj-copy-wrap {
                position: relative;
            }

            /* Copy all button - appears on container hover */
            .sj-copy-btn {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 10;
                background: #333;
                color: #fff;
                border: none;
                border-radius: 4px;
                padding: 6px 8px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s;
                font-size: 14px;
                line-height: 1;
            }

            .sj-copy-wrap:hover .sj-copy-btn,
            .sj-copy-wrap:focus-within .sj-copy-btn {
                opacity: 0.8;
            }

            .sj-copy-btn:hover {
                opacity: 1 !important;
                background: #000;
            }

            .sj-copy-btn.copied {
                background: #22c55e;
            }

            /* Row-level copy button */
            .shakeeb-justify tr {
                position: relative;
            }

            .sj-row-copy {
                position: absolute;
                left: -30px;
                top: 50%;
                transform: translateY(-50%);
                background: #333;
                color: #fff;
                border: none;
                border-radius: 3px;
                padding: 4px 6px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s;
                font-size: 12px;
                line-height: 1;
            }

            .shakeeb-justify tr:hover .sj-row-copy {
                opacity: 0.7;
            }

            .sj-row-copy:hover {
                opacity: 1 !important;
                background: #000;
            }

            .sj-row-copy.copied {
                background: #22c55e;
            }

            /* Hide row copy on spacer rows */
            .shakeeb-justify tr.spacer .sj-row-copy {
                display: none;
            }
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

    /**
     * Wraps line content with hidden newline for proper copy behavior.
     * The \n is hidden visually but included when copying.
     */
    function wrapLine(text) {
        return `${text}<span class="sj-nl">\n</span>`;
    }

    /* -------------------- COPY FUNCTIONALITY -------------------- */

    /**
     * Extracts plain text from a poetry element for copying.
     */
    function getPoetryText(el) {
        const table = el.querySelector('.shakeeb-justify');
        if (!table) return '';

        const lines = [];
        table.querySelectorAll('tr:not(.spacer)').forEach(row => {
            const cells = row.querySelectorAll('td:not(.spacer-cell)');
            cells.forEach(cell => {
                const text = cell.textContent.replace(/\n/g, '').trim();
                if (text) lines.push(text);
            });
        });

        return lines.join('\n');
    }

    /**
     * Extracts text from a single row for copying.
     */
    function getRowText(row) {
        const cells = row.querySelectorAll('td:not(.spacer-cell)');
        const lines = [];
        cells.forEach(cell => {
            const text = cell.textContent.replace(/\n/g, '').trim();
            if (text) lines.push(text);
        });
        return lines.join('\n');
    }

    /**
     * Copies text to clipboard and shows feedback.
     */
    async function copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            button.classList.add('copied');
            const originalHTML = button.innerHTML;
            button.innerHTML = '✓';
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = originalHTML;
            }, 1500);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    }

    /**
     * Adds copy button(s) to a poetry container.
     * @param {HTMLElement} container - The poetry container element
     * @param {string} mode - 'all', 'row', or 'both'
     */
    function addCopyButtons(container, mode) {
        // Wrap container for positioning
        container.classList.add('sj-copy-wrap');

        // Add "copy all" button
        if (mode === 'all' || mode === 'both') {
            const btn = document.createElement('button');
            btn.className = 'sj-copy-btn';
            btn.innerHTML = '📋';
            btn.title = 'Copy poem';
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const text = getPoetryText(container);
                copyToClipboard(text, btn);
            });
            container.insertBefore(btn, container.firstChild);
        }

        // Add per-row copy buttons
        if (mode === 'row' || mode === 'both') {
            const table = container.querySelector('.shakeeb-justify');
            if (table) {
                table.querySelectorAll('tr:not(.spacer)').forEach(row => {
                    const btn = document.createElement('button');
                    btn.className = 'sj-row-copy';
                    btn.innerHTML = '📋';
                    btn.title = 'Copy line';
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const text = getRowText(row);
                        copyToClipboard(text, btn);
                    });
                    row.querySelector('td').appendChild(btn);
                });
            }
        }
    }

    /* -------------------- SINGLE-COLUMN RENDERER -------------------- */

    /**
     * Renders lines into a single-column table with optional spacer rows.
     * @param {string} str - Newline-separated lines
     * @param {number|null} gapEvery - Insert spacer row after every N lines (null = no spacers)
     * @param {string} tableClass - Additional class for the table (e.g., 'sher', 'mukhammas')
     * @returns {string} HTML table string
     */
    function tabulate(str, gapEvery = null, tableClass = 'sher') {
        if (!str) return '';

        const lines = str.split('\n').filter(Boolean);
        let rows = '';

        lines.forEach((line, i) => {
            rows += `<tr><td>${wrapLine(line)}</td></tr>`;

            // Add spacer row after every gapEvery lines
            if (gapEvery && (i + 1) % gapEvery === 0 && i < lines.length - 1) {
                rows += `<tr class="spacer"><td></td></tr>`;
            }
        });

        return `<table class="shakeeb-justify ${tableClass}">${rows}</table>`;
    }

    /* -------------------- TWO-COLUMN RENDERER -------------------- */

    /**
     * Renders lines into a two-column table (pairs of lines side by side).
     * @param {string} str - Newline-separated lines
     * @param {boolean} addFinalSpacer - Whether to add spacer after the last row
     * @returns {string} HTML table string
     */
    function tabulate2(str, addFinalSpacer = false) {
        if (!str) return '';

        const lines = str.split('\n').filter(Boolean);
        let rows = '';

        for (let i = 0; i < lines.length; i += 2) {
            rows += `<tr>
                <td>${wrapLine(lines[i] || '')}</td>
                <td class="spacer-cell"></td>
                <td>${wrapLine(lines[i + 1] || '')}</td>
            </tr>`;

            // Add spacer row after each couplet (except the last, unless explicitly requested)
            if (i + 2 < lines.length || addFinalSpacer) {
                rows += `<tr class="spacer"><td colspan="3"></td></tr>`;
            }
        }

        return `<table class="shakeeb-justify sher2">${rows}</table>`;
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

    /**
     * Renders element with pattern-based grouping (single table with spacer rows).
     * @param {HTMLElement} el - The element to render
     * @param {number[]} pattern - Array of group sizes, e.g., [4, 2] for musaddas
     * @param {string} tableClass - Class name for the table
     */
    function renderPattern(el, pattern, tableClass = 'sher') {
        const text = extractLines(el);
        const lines = text.split('\n').filter(Boolean);
        const groups = groupLines(lines, pattern);

        let rows = '';

        groups.forEach((group, groupIndex) => {
            // Add each line of the group
            group.forEach(line => {
                rows += `<tr><td>${wrapLine(line)}</td></tr>`;
            });

            // Add spacer row after each group (except the last)
            if (groupIndex < groups.length - 1) {
                rows += `<tr class="spacer"><td></td></tr>`;
            }
        });

        el.innerHTML = `<table class="shakeeb-justify ${tableClass}">${rows}</table>`;
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

    /**
     * Renders mixed layout (combining 1-col and 2-col sections).
     * Uses separate tables for different column layouts as they have different structures.
     * Spacer is handled via margin-bottom on tables.
     */
    function renderMixedAdvanced(el, mixedSpec, tableClass = 'mixed') {
        const text = extractLines(el);
        const lines = text.split('\n').filter(Boolean);

        let i = 0;
        let html = '';

        mixedSpec.forEach((spec, specIndex) => {
            const chunk = lines.slice(i, i + spec.count);
            i += spec.count;

            const isLast = specIndex === mixedSpec.length - 1;

            if (spec.mode === '2col') {
                // Two-column layout
                let rows = '';
                for (let j = 0; j < chunk.length; j += 2) {
                    rows += `<tr>
                        <td>${wrapLine(chunk[j] || '')}</td>
                        <td class="spacer-cell"></td>
                        <td>${wrapLine(chunk[j + 1] || '')}</td>
                    </tr>`;

                    // Add spacer between couplets within this 2col section
                    if (j + 2 < chunk.length) {
                        rows += `<tr class="spacer"><td colspan="3"></td></tr>`;
                    }
                }

                html += `<table class="shakeeb-justify sher2"${!isLast ? ' style="margin-bottom: 15px;"' : ''}>${rows}</table>`;
            } else {
                // Single-column layout
                let rows = '';
                chunk.forEach((line, lineIndex) => {
                    rows += `<tr><td>${wrapLine(line)}</td></tr>`;
                });

                html += `<table class="shakeeb-justify ${tableClass}"${!isLast ? ' style="margin-bottom: 15px;"' : ''}>${rows}</table>`;
            }
        });

        el.innerHTML = html;
    }

    /* -------------------- APPLY -------------------- */

    function apply() {
        injectStyles();

        /* Base sher - single column with gap every 2 lines */
        document.querySelectorAll('.sher').forEach(e =>
            e.innerHTML = tabulate(extractLines(e), 2, 'sher')
        );

        /* Base sher2 - two columns */
        document.querySelectorAll('.sher2').forEach(e =>
            e.innerHTML = tabulate2(extractLines(e))
        );

        /* Mukhammas - 5 lines per stanza */
        document.querySelectorAll('.mukhammas').forEach(e =>
            renderPattern(e, [5], 'mukhammas')
        );

        document.querySelectorAll('.mukhammas-3-2').forEach(e =>
            renderPattern(e, [3, 2], 'mukhammas')
        );

        document.querySelectorAll('.mukhammas-mixed').forEach(e =>
            renderMixedAdvanced(e, [
                { count: 4, mode: '2col' },
                { count: 1, mode: '1col' }
            ], 'mukhammas')
        );

        /* Musaddas - 6 lines per stanza */
        document.querySelectorAll('.musaddas').forEach(e =>
            renderPattern(e, [4, 2], 'musaddas')
        );

        document.querySelectorAll('.musaddas-6').forEach(e =>
            renderPattern(e, [6], 'musaddas')
        );

        document.querySelectorAll('.musaddas-mixed').forEach(e =>
            renderMixedAdvanced(e, [
                { count: 4, mode: '2col' },
                { count: 2, mode: '1col' }
            ], 'musaddas')
        );

        /* data-pattern override - custom patterns like data-pattern="4+2" */
        document.querySelectorAll('[data-pattern]').forEach(e => {
            const pattern = parsePattern(e.dataset.pattern);
            if (pattern) renderPattern(e, pattern, 'custom-pattern');
        });

        /* data-mixed override - custom mixed layouts like data-mixed="4:2col,2:1col" */
        document.querySelectorAll('[data-mixed]').forEach(e => {
            const spec = parseMixed(e.dataset.mixed);
            if (spec) renderMixedAdvanced(e, spec, 'custom-mixed');
        });

        /* Apply copy buttons to elements with data-copy attribute */
        document.querySelectorAll('[data-copy]').forEach(e => {
            const mode = e.dataset.copy || 'all';
            // Small delay to ensure table is rendered first
            setTimeout(() => addCopyButtons(e, mode), 0);
        });

        console.log(
            '%cShakeebJustify v1.0.6 applied — https://shakeeb.in',
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
