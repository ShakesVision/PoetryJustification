/*!
 * ShakeebJustify (Poetry Justification for Urdu/Nastaliq)
 * Author: Shakeeb Ahmad
 * Website: https://shakeeb.in
 * Version: 1.0.0
 * License: MIT
 */

(function (global) {
    function injectStyles() {
        if (document.getElementById('shakeeb-justify-style')) return;
        const style = document.createElement('style');
        style.id = 'shakeeb-justify-style';
        style.textContent = `
        .sher, .sher td, .sher2, .sher2 td { text-align: justify; text-align-last: justify; direction: rtl; line-height: 1.5em; margin: 0 auto;}
        .sher2 td { width: 46%; }
        .sher2 tr td:nth-child(2) { width: 10%; }
        .sher tr td { padding-bottom: 5px; }
        .sher tr:nth-child(2n) td { padding-bottom: 15px; }
      `;
        document.head.appendChild(style);
    }

    function tabulate(str) {
        str = str.replace(/[\r\n]+/g, '\n').trim().replace(/\r?\n|\r/g, '</td></tr>\n<tr><td>');
        return str.length
            ? `<table class="sher"><tr><td>${str}</td></tr></table>`
            : 'یہاں اک شعر ہونا چاہیے تھا۔';
    }

    function tabulate2(str) {
        if (!str.length) return 'یہاں اک شعر ہونا چاہیے تھا۔';
        str = str.replace(/[\r\n]+/g, '\n').trim();
        const lines = str.split('\n').map((line, i) => {
            return (i + 1) % 2 !== 0
                ? `${line}</td><td> </td><td>`
                : `${line}</td></tr>\n<tr><td>`;
        });
        let out = lines.join('');
        out = `<table class="sher2"><tr><td>${out}</td></tr></table>`;
        return out.replace('<tr><td></td></tr>', '').replace('<td></td>', '').trim();
    }

    function apply() {
        injectStyles();
        Array.from(document.getElementsByClassName('sher')).forEach(e => e.innerHTML = tabulate(e.innerText));
        Array.from(document.getElementsByClassName('sher2')).forEach(e => e.innerHTML = tabulate2(e.innerText));
        console.log('%cShakeebJustify applied — by Shakeeb Ahmad (https://shakeeb.in)', 'color: green; font-weight: bold;');
    }

    global.ShakeebJustify = { apply, tabulate, tabulate2 };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply);
    } else {
        apply();
    }
})(window);
