/*!
 * ShakeebJustify (Poetry Justification for Urdu / Nastaliq)
 * Author: Shakeeb Ahmad
 * Website: https://shakeeb.in
 * Version: 1.0.9
 * License: MIT
 */

(function (global) {

    // CSS is minified since it's just a string - doesn't need to be readable
    var CSS = '.shakeeb-justify{border-collapse:collapse;margin:0 auto;position:relative;direction:rtl}' +
        '.shakeeb-justify td{text-align:justify;text-align-last:justify;direction:rtl;line-height:1.5em;unicode-bidi:plaintext}' +
        '.shakeeb-justify.sher2 td{width:46%}.shakeeb-justify.sher2 td.spacer-cell{width:10%}' +
        '.shakeeb-justify tr.spacer td{height:15px;padding:0}' +
        '.shakeeb-justify .sj-nl{position:absolute;left:-9999px;font-size:0;white-space:pre}' +
        '.sj-copy-wrap{position:relative}' +
        '.sj-copy-btn{position:absolute;top:0;left:0;z-index:10;background:#333;color:#fff;border:0;border-radius:4px;padding:6px 8px;cursor:pointer;opacity:0;transition:opacity .2s;font-size:14px;line-height:1}' +
        '.sj-copy-wrap:hover .sj-copy-btn,.sj-copy-wrap:focus-within .sj-copy-btn{opacity:.8}' +
        '.sj-copy-btn:hover{opacity:1!important;background:#000}' +
        '.sj-copy-btn.copied{background:#22c55e}' +
        '.shakeeb-justify tr{position:relative;direction:rtl}' +
        '.sj-row-copy{position:absolute;left:-30px;top:50%;transform:translateY(-50%);background:#333;color:#fff;border:0;border-radius:3px;padding:4px 6px;cursor:pointer;opacity:0;transition:opacity .2s;font-size:12px;line-height:1}' +
        '.shakeeb-justify tr:hover .sj-row-copy{opacity:.7}' +
        '.sj-row-copy:hover{opacity:1!important;background:#000}' +
        '.sj-row-copy.copied{background:#22c55e}' +
        '.shakeeb-justify tr.spacer .sj-row-copy{display:none}';

    var VALID_MODES = ['1col', '2col'];

    /**
     * Inject styles into document head
     */
    function injectStyles() {
        if (document.getElementById('shakeeb-justify-style')) return;
        var style = document.createElement('style');
        style.id = 'shakeeb-justify-style';
        style.textContent = CSS;
        document.head.appendChild(style);
    }

    /**
     * Extract lines from element, normalizing various HTML structures
     */
    function getLines(element) {
        var clone = element.cloneNode(true);
        clone.querySelectorAll('br').forEach(function (br) { br.replaceWith('\n'); });
        clone.querySelectorAll('p, div, li').forEach(function (el) { el.append('\n'); });
        return clone.textContent.replace(/\n\s*\n+/g, '\n').trim().split('\n').filter(Boolean);
    }

    /**
     * Wrap text with hidden newline for copy behavior
     */
    function wrapLine(text) {
        return text + '<span class="sj-nl">\n</span>';
    }

    // HTML generation helpers
    function singleRow(line) {
        return '<tr><td>' + wrapLine(line) + '</td></tr>';
    }

    function doubleRow(line1, line2) {
        return '<tr><td>' + wrapLine(line1 || '') + '</td><td class="spacer-cell"></td><td>' + wrapLine(line2 || '') + '</td></tr>';
    }

    function spacerRow(colspan) {
        return colspan ? '<tr class="spacer"><td colspan="3"></td></tr>' : '<tr class="spacer"><td></td></tr>';
    }

    function wrapTable(className, rows) {
        return '<table class="shakeeb-justify ' + className + '">' + rows + '</table>';
    }

    /**
     * Render single-column layout with gaps
     */
    function tabulate(lines, gapEvery, tableClass) {
        if (!lines.length) return '';
        var rows = '';
        lines.forEach(function (line, i) {
            rows += singleRow(line);
            if (gapEvery && (i + 1) % gapEvery === 0 && i < lines.length - 1) {
                rows += spacerRow();
            }
        });
        return wrapTable(tableClass || 'sher', rows);
    }

    /**
     * Render two-column layout
     */
    function tabulate2(lines, addFinalSpacer) {
        if (!lines.length) return '';
        var rows = '';
        for (var i = 0; i < lines.length; i += 2) {
            rows += doubleRow(lines[i], lines[i + 1]);
            if (i + 2 < lines.length || addFinalSpacer) {
                rows += spacerRow(true);
            }
        }
        return wrapTable('sher2', rows);
    }

    /**
     * Group lines according to pattern (e.g., [4, 2] for musaddas)
     */
    function groupLines(lines, pattern) {
        var groups = [], i = 0;
        while (i < lines.length) {
            for (var p = 0; p < pattern.length && i < lines.length; p++) {
                groups.push(lines.slice(i, i + pattern[p]));
                i += pattern[p];
            }
        }
        return groups;
    }

    /**
     * Render with pattern-based grouping
     */
    function renderPattern(element, pattern, tableClass) {
        var lines = getLines(element);
        var groups = groupLines(lines, pattern);
        var rows = '';

        groups.forEach(function (group, index) {
            group.forEach(function (line) { rows += singleRow(line); });
            if (index < groups.length - 1) rows += spacerRow();
        });

        element.innerHTML = wrapTable(tableClass || 'sher', rows);
    }

    /**
     * Parse data-mixed attribute
     */
    function parseMixed(str, element) {
        return str.split(',').map(function (part) {
            var pieces = part.split(':');
            var mode = (pieces[1] || '1col').trim();

            if (VALID_MODES.indexOf(mode) < 0) {
                console.warn('[ShakeebJustify] Invalid mode "' + mode + '". Valid: ' + VALID_MODES.join(', '));
                mode = '1col';
            }

            return { count: parseInt(pieces[0], 10) || 0, mode: mode };
        });
    }

    /**
     * Render mixed layout (combining 1-col and 2-col sections)
     * Pattern repeats for all lines in the poem
     */
    function renderMixed(element, specs, tableClass) {
        var lines = getLines(element);
        var patternSize = specs.reduce(function (sum, s) { return sum + s.count; }, 0);

        // Warn if lines don't divide evenly into pattern
        if (lines.length % patternSize !== 0) {
            console.warn('[ShakeebJustify] Line count (' + lines.length + ') is not a multiple of pattern size (' + patternSize + ')', element);
        }

        var lineIndex = 0;
        var html = '';
        var stanzaCount = 0;

        // Loop through ALL lines, repeating the pattern
        while (lineIndex < lines.length) {
            // Process each spec in the pattern
            for (var specIndex = 0; specIndex < specs.length && lineIndex < lines.length; specIndex++) {
                var spec = specs[specIndex];
                var chunk = lines.slice(lineIndex, lineIndex + spec.count);
                var rows = '';
                lineIndex += spec.count;

                // Check if this is the very last chunk
                var isLastChunk = lineIndex >= lines.length && specIndex === specs.length - 1;

                if (spec.mode === '2col') {
                    // No spacers between pairs within a mixed block - gap is handled by margin-bottom between tables
                    for (var j = 0; j < chunk.length; j += 2) {
                        rows += doubleRow(chunk[j], chunk[j + 1]);
                    }
                    html += '<table class="shakeeb-justify sher2"' + (isLastChunk ? '' : ' style="margin-bottom:15px"') + '>' + rows + '</table>';
                } else {
                    chunk.forEach(function (line) { rows += singleRow(line); });
                    html += '<table class="shakeeb-justify ' + (tableClass || 'mixed') + '"' + (isLastChunk ? '' : ' style="margin-bottom:15px"') + '>' + rows + '</table>';
                }
            }
            stanzaCount++;
        }

        element.innerHTML = html;
    }

    /**
     * Get text content for copying
     */
    function getPoetryText(container) {
        var table = container.querySelector('.shakeeb-justify');
        if (!table) return '';
        var lines = [];
        table.querySelectorAll('tr:not(.spacer)').forEach(function (row) {
            row.querySelectorAll('td:not(.spacer-cell)').forEach(function (cell) {
                var text = cell.textContent.replace(/\n/g, '').trim();
                if (text) lines.push(text);
            });
        });
        return lines.join('\n');
    }

    function getRowText(row) {
        var lines = [];
        row.querySelectorAll('td:not(.spacer-cell)').forEach(function (cell) {
            var text = cell.textContent.replace(/\n/g, '').trim();
            if (text) lines.push(text);
        });
        return lines.join('\n');
    }

    /**
     * Copy to clipboard with visual feedback
     */
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(function () {
            button.classList.add('copied');
            var original = button.innerHTML;
            button.innerHTML = '✓';
            setTimeout(function () {
                button.classList.remove('copied');
                button.innerHTML = original;
            }, 1500);
        }).catch(function (err) {
            console.error('Copy failed:', err);
        });
    }

    /**
     * Add copy buttons to container
     */
    function addCopyButtons(container, mode) {
        container.classList.add('sj-copy-wrap');

        if (mode === 'all' || mode === 'both') {
            var btn = document.createElement('button');
            btn.className = 'sj-copy-btn';
            btn.innerHTML = '📋';
            btn.title = 'Copy poem';
            btn.onclick = function (e) {
                e.stopPropagation();
                copyToClipboard(getPoetryText(container), btn);
            };
            container.insertBefore(btn, container.firstChild);
        }

        if (mode === 'row' || mode === 'both') {
            var table = container.querySelector('.shakeeb-justify');
            if (table) {
                table.querySelectorAll('tr:not(.spacer)').forEach(function (row) {
                    var btn = document.createElement('button');
                    btn.className = 'sj-row-copy';
                    btn.innerHTML = '📋';
                    btn.title = 'Copy line';
                    btn.onclick = function (e) {
                        e.stopPropagation();
                        copyToClipboard(getRowText(row), btn);
                    };
                    row.querySelector('td').appendChild(btn);
                });
            }
        }
    }

    /**
     * Main apply function
     */
    function apply() {
        injectStyles();

        // Basic layouts
        document.querySelectorAll('.sher').forEach(function (el) {
            el.innerHTML = tabulate(getLines(el), 2, 'sher');
        });

        document.querySelectorAll('.sher2').forEach(function (el) {
            el.innerHTML = tabulate2(getLines(el));
        });

        // Mukhammas variants
        document.querySelectorAll('.mukhammas').forEach(function (el) {
            renderPattern(el, [5], 'mukhammas');
        });

        document.querySelectorAll('.mukhammas-3-2').forEach(function (el) {
            renderPattern(el, [3, 2], 'mukhammas');
        });

        document.querySelectorAll('.mukhammas-mixed').forEach(function (el) {
            renderMixed(el, [{ count: 4, mode: '2col' }, { count: 1, mode: '1col' }], 'mukhammas');
        });

        // Musaddas variants
        document.querySelectorAll('.musaddas').forEach(function (el) {
            renderPattern(el, [4, 2], 'musaddas');
        });

        document.querySelectorAll('.musaddas-6').forEach(function (el) {
            renderPattern(el, [6], 'musaddas');
        });

        document.querySelectorAll('.musaddas-mixed').forEach(function (el) {
            renderMixed(el, [{ count: 4, mode: '2col' }, { count: 2, mode: '1col' }], 'musaddas');
        });

        // Custom patterns
        document.querySelectorAll('[data-pattern]').forEach(function (el) {
            var pattern = el.dataset.pattern.split('+').map(function (n) {
                return parseInt(n, 10);
            }).filter(Boolean);
            if (pattern.length) renderPattern(el, pattern, 'custom-pattern');
        });

        document.querySelectorAll('[data-mixed]').forEach(function (el) {
            var specs = parseMixed(el.dataset.mixed, el);
            if (specs) renderMixed(el, specs, 'custom-mixed');
        });

        // Copy buttons (opt-in)
        document.querySelectorAll('[data-copy]').forEach(function (el) {
            setTimeout(function () {
                addCopyButtons(el, el.dataset.copy || 'all');
            }, 0);
        });

        console.log('%cShakeebJustify v1.0.9 — https://shakeeb.in', 'color: green; font-weight: bold');
    }

    // Export
    global.ShakeebJustify = { apply: apply };

    // Auto-run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply);
    } else {
        apply();
    }

})(window);
