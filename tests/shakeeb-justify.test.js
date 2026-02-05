/**
 * ShakeebJustify Unit Tests
 * 
 * Run with: npm test
 */

// Load the library
require('../dist/shakeeb-justify.js');

describe('ShakeebJustify', () => {
    
    beforeEach(() => {
        // Clear document body before each test
        document.body.innerHTML = '';
        // Remove injected styles
        const style = document.getElementById('shakeeb-justify-style');
        if (style) style.remove();
    });

    describe('Basic Rendering', () => {

        test('.sher creates single-column table with gaps every 2 lines', () => {
            document.body.innerHTML = `
                <div class="sher">
                    Line 1
                    Line 2
                    Line 3
                    Line 4
                </div>
            `;

            ShakeebJustify.apply();

            const table = document.querySelector('.shakeeb-justify');
            expect(table).not.toBeNull();
            
            // Should have 4 content rows + 1 spacer row (after line 2)
            const allRows = table.querySelectorAll('tr');
            const contentRows = table.querySelectorAll('tr:not(.spacer)');
            const spacerRows = table.querySelectorAll('tr.spacer');
            
            expect(contentRows.length).toBe(4);
            expect(spacerRows.length).toBe(1); // Gap after line 2
        });

        test('.sher2 creates two-column table', () => {
            document.body.innerHTML = `
                <div class="sher2">
                    Line 1
                    Line 2
                    Line 3
                    Line 4
                </div>
            `;

            ShakeebJustify.apply();

            const table = document.querySelector('.shakeeb-justify.sher2');
            expect(table).not.toBeNull();

            // 4 lines = 2 rows (pairs)
            const contentRows = table.querySelectorAll('tr:not(.spacer)');
            expect(contentRows.length).toBe(2);

            // Each row should have 3 cells (left, spacer, right)
            const firstRow = contentRows[0];
            expect(firstRow.querySelectorAll('td').length).toBe(3);
        });

    });

    describe('Pattern-based Rendering', () => {

        test('.mukhammas groups by 5 lines', () => {
            document.body.innerHTML = `
                <div class="mukhammas">
                    Line 1
                    Line 2
                    Line 3
                    Line 4
                    Line 5
                    Line 6
                    Line 7
                    Line 8
                    Line 9
                    Line 10
                </div>
            `;

            ShakeebJustify.apply();

            const table = document.querySelector('.shakeeb-justify');
            const contentRows = table.querySelectorAll('tr:not(.spacer)');
            const spacerRows = table.querySelectorAll('tr.spacer');

            expect(contentRows.length).toBe(10);
            expect(spacerRows.length).toBe(1); // Gap after line 5
        });

        test('.musaddas uses 4+2 pattern', () => {
            document.body.innerHTML = `
                <div class="musaddas">
                    Line 1
                    Line 2
                    Line 3
                    Line 4
                    Line 5
                    Line 6
                    Line 7
                    Line 8
                    Line 9
                    Line 10
                    Line 11
                    Line 12
                </div>
            `;

            ShakeebJustify.apply();

            const table = document.querySelector('.shakeeb-justify');
            const contentRows = table.querySelectorAll('tr:not(.spacer)');
            const spacerRows = table.querySelectorAll('tr.spacer');

            expect(contentRows.length).toBe(12);
            // Pattern: 4, 2, 4, 2 = 3 gaps (after 4, after 6, after 10)
            expect(spacerRows.length).toBe(3);
        });

        test('data-pattern="4" creates gaps every 4 lines', () => {
            document.body.innerHTML = `
                <div data-pattern="4">
                    Line 1
                    Line 2
                    Line 3
                    Line 4
                    Line 5
                    Line 6
                    Line 7
                    Line 8
                </div>
            `;

            ShakeebJustify.apply();

            const table = document.querySelector('.shakeeb-justify');
            const spacerRows = table.querySelectorAll('tr.spacer');

            // 8 lines / 4 = 2 groups, 1 gap between them
            expect(spacerRows.length).toBe(1);
        });

        test('data-pattern="3+2" creates alternating gaps', () => {
            document.body.innerHTML = `
                <div data-pattern="3+2">
                    Line 1
                    Line 2
                    Line 3
                    Line 4
                    Line 5
                    Line 6
                    Line 7
                    Line 8
                    Line 9
                    Line 10
                </div>
            `;

            ShakeebJustify.apply();

            const table = document.querySelector('.shakeeb-justify');
            const spacerRows = table.querySelectorAll('tr.spacer');

            // Groups: 3, 2, 3, 2 = 3 gaps
            expect(spacerRows.length).toBe(3);
        });

    });

    describe('Mixed Layout Rendering', () => {

        test('.musaddas-mixed renders 4 lines 2-col + 2 lines 1-col', () => {
            document.body.innerHTML = `
                <div class="musaddas-mixed">
                    Line 1
                    Line 2
                    Line 3
                    Line 4
                    Line 5
                    Line 6
                </div>
            `;

            ShakeebJustify.apply();

            const tables = document.querySelectorAll('.shakeeb-justify');
            expect(tables.length).toBe(2);

            // First table: 2-col (4 lines = 2 rows)
            expect(tables[0].classList.contains('sher2')).toBe(true);
            expect(tables[0].querySelectorAll('tr:not(.spacer)').length).toBe(2);

            // Second table: 1-col (2 lines = 2 rows)
            expect(tables[1].classList.contains('sher2')).toBe(false);
            expect(tables[1].querySelectorAll('tr:not(.spacer)').length).toBe(2);
        });

        test('CRITICAL: No spacer rows WITHIN 2-col blocks in mixed layouts', () => {
            document.body.innerHTML = `
                <div class="musaddas-mixed">
                    Line 1
                    Line 2
                    Line 3
                    Line 4
                    Line 5
                    Line 6
                </div>
            `;

            ShakeebJustify.apply();

            const tables = document.querySelectorAll('.shakeeb-justify');
            
            // First table (2-col) should have NO spacer rows
            const spacersIn2col = tables[0].querySelectorAll('tr.spacer');
            expect(spacersIn2col.length).toBe(0);
        });

        test('CRITICAL: .musaddas-mixed REPEATS pattern for long poems', () => {
            // This was the bug we fixed!
            document.body.innerHTML = `
                <div class="musaddas-mixed">
                    Line 1
                    Line 2
                    Line 3
                    Line 4
                    Line 5
                    Line 6
                    Line 7
                    Line 8
                    Line 9
                    Line 10
                    Line 11
                    Line 12
                </div>
            `;

            ShakeebJustify.apply();

            // 12 lines with 4+2 pattern = 2 full stanzas = 4 tables
            const tables = document.querySelectorAll('.shakeeb-justify');
            expect(tables.length).toBe(4);

            // All 12 lines should be present
            const allContentRows = document.querySelectorAll('.shakeeb-justify tr:not(.spacer)');
            let totalCells = 0;
            allContentRows.forEach(row => {
                totalCells += row.querySelectorAll('td:not(.spacer-cell)').length;
            });
            // 4 lines (2 rows × 2 cells) + 2 lines (2 rows × 1 cell) = 6 cells per stanza
            // 2 stanzas = 12 total content cells
            expect(totalCells).toBe(12);
        });

        test('CRITICAL: data-mixed REPEATS pattern for long poems', () => {
            document.body.innerHTML = `
                <div data-mixed="4:2col,2:1col">
                    Line 1
                    Line 2
                    Line 3
                    Line 4
                    Line 5
                    Line 6
                    Line 7
                    Line 8
                    Line 9
                    Line 10
                    Line 11
                    Line 12
                    Line 13
                    Line 14
                    Line 15
                    Line 16
                    Line 17
                    Line 18
                </div>
            `;

            ShakeebJustify.apply();

            // 18 lines with 4+2 pattern = 3 full stanzas = 6 tables
            const tables = document.querySelectorAll('.shakeeb-justify');
            expect(tables.length).toBe(6);
        });

        test('data-mixed with invalid mode defaults to 1col', () => {
            // Suppress console.warn for this test
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            document.body.innerHTML = `
                <div data-mixed="2:invalid,2:1col">
                    Line 1
                    Line 2
                    Line 3
                    Line 4
                </div>
            `;

            ShakeebJustify.apply();

            // Should warn about invalid mode
            expect(warnSpy).toHaveBeenCalled();

            // Both tables should render (invalid defaults to 1col)
            const tables = document.querySelectorAll('.shakeeb-justify');
            expect(tables.length).toBe(2);

            warnSpy.mockRestore();
        });

    });

    describe('Line Extraction', () => {

        test('handles <br> tags correctly', () => {
            document.body.innerHTML = `
                <div class="sher">
                    Line 1<br>Line 2<br>Line 3<br>Line 4
                </div>
            `;

            ShakeebJustify.apply();

            const rows = document.querySelectorAll('.shakeeb-justify tr:not(.spacer)');
            expect(rows.length).toBe(4);
        });

        test('handles <p> tags correctly', () => {
            document.body.innerHTML = `
                <div class="sher">
                    <p>Line 1</p>
                    <p>Line 2</p>
                    <p>Line 3</p>
                    <p>Line 4</p>
                </div>
            `;

            ShakeebJustify.apply();

            const rows = document.querySelectorAll('.shakeeb-justify tr:not(.spacer)');
            expect(rows.length).toBe(4);
        });

        test('handles mixed markup correctly', () => {
            document.body.innerHTML = `
                <div class="sher">
                    <p>Line 1</p>
                    Line 2<br>
                    <div>Line 3</div>
                    Line 4
                </div>
            `;

            ShakeebJustify.apply();

            const rows = document.querySelectorAll('.shakeeb-justify tr:not(.spacer)');
            expect(rows.length).toBe(4);
        });

        test('ignores empty lines', () => {
            document.body.innerHTML = `
                <div class="sher">
                    Line 1


                    Line 2

                    Line 3
                    Line 4
                </div>
            `;

            ShakeebJustify.apply();

            const rows = document.querySelectorAll('.shakeeb-justify tr:not(.spacer)');
            expect(rows.length).toBe(4);
        });

    });

    describe('Copy Functionality', () => {

        test('data-copy="all" adds copy button', () => {
            document.body.innerHTML = `
                <div class="sher" data-copy="all">
                    Line 1
                    Line 2
                </div>
            `;

            ShakeebJustify.apply();

            // Need to wait for setTimeout
            return new Promise(resolve => setTimeout(resolve, 10)).then(() => {
                const copyBtn = document.querySelector('.sj-copy-btn');
                expect(copyBtn).not.toBeNull();
            });
        });

        test('data-copy="row" adds row copy buttons', () => {
            document.body.innerHTML = `
                <div class="sher" data-copy="row">
                    Line 1
                    Line 2
                </div>
            `;

            ShakeebJustify.apply();

            return new Promise(resolve => setTimeout(resolve, 10)).then(() => {
                const rowBtns = document.querySelectorAll('.sj-row-copy');
                expect(rowBtns.length).toBe(2);
            });
        });

        test('data-copy="both" adds all and row buttons', () => {
            document.body.innerHTML = `
                <div class="sher" data-copy="both">
                    Line 1
                    Line 2
                </div>
            `;

            ShakeebJustify.apply();

            return new Promise(resolve => setTimeout(resolve, 10)).then(() => {
                const copyBtn = document.querySelector('.sj-copy-btn');
                const rowBtns = document.querySelectorAll('.sj-row-copy');
                expect(copyBtn).not.toBeNull();
                expect(rowBtns.length).toBe(2);
            });
        });

    });

    describe('Hidden Newlines for Copy Behavior', () => {

        test('each line has hidden newline span', () => {
            document.body.innerHTML = `
                <div class="sher">
                    Line 1
                    Line 2
                </div>
            `;

            ShakeebJustify.apply();

            const nlSpans = document.querySelectorAll('.sj-nl');
            expect(nlSpans.length).toBe(2);
        });

    });

    describe('Styles Injection', () => {

        test('injects styles on first apply', () => {
            document.body.innerHTML = '<div class="sher">Test</div>';
            
            expect(document.getElementById('shakeeb-justify-style')).toBeNull();
            
            ShakeebJustify.apply();
            
            expect(document.getElementById('shakeeb-justify-style')).not.toBeNull();
        });

        test('does not duplicate styles on multiple applies', () => {
            document.body.innerHTML = '<div class="sher">Test</div>';
            
            ShakeebJustify.apply();
            ShakeebJustify.apply();
            ShakeebJustify.apply();
            
            const styles = document.querySelectorAll('#shakeeb-justify-style');
            expect(styles.length).toBe(1);
        });

    });

    describe('RTL Direction', () => {

        test('table has RTL direction', () => {
            document.body.innerHTML = '<div class="sher">Test line</div>';
            
            ShakeebJustify.apply();
            
            const style = document.getElementById('shakeeb-justify-style');
            expect(style.textContent).toContain('direction:rtl');
        });

    });

});

