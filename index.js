class Key {
  constructor(x, y, data) {
    const [col, row] = data.split('\n');

    this.posCol = x;
    this.posRow = y;
    this.matCol = Array.from(Key.cols).indexOf(col);
    this.matRow = Array.from(Key.rows).indexOf(row);
  }
}

function kleToJSON(layout) {
  return JSON.parse('[' + layout.replace(/([a-z]):/g, '"$1":') + ']');
}

function parseKeys(kleStr) {
  const layout = kleToJSON(kleStr);
  const keys = [];
  layout.forEach((r, y) => {
    r.forEach((key, x) => {
      if (!key || (typeof key !== 'object')) {
        keys.push(new Key(x, y, key));
      }
    });
  });
  return keys;
}

function run(_rows, _cols, kleStr) {
  const cols = _cols.split(',').map(x => x.trim());
  const rows = _rows.split(',').map(x => x.trim());

  Key.cols = cols;
  Key.rows = rows;

  const data = kleToJSON(kleStr);
  const keys = parseKeys(data);

  const matrix = [];
  let matrixStr = '';
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < cols.length; c++) {
      const key = keys.find(k => k.matCol === c && k.matRow === r);
      if (key) {
        key.name = `k${r.toString(16)}${c.toString(16)}`;
        matrixStr += `${key.name}, `;
      } else {
        matrixStr += `___, `;
      }
    }
    matrix.push(`  { ${matrixStr.slice(0, -2)} }, `);
    matrixStr = '';
  }

  const layout = [];
  let layoutStr = '';
  data.forEach((r, y) => {
    r.forEach((key, x) => {
      const k = keys.find(k => k.posCol === x && k.posRow === y);
      if (k) {
        layoutStr += k.name + ', ';
      }
    });
    layout.push(`  ${layoutStr}`);
    layoutStr = '';
  });

  const res = `#pragma once

#include "quantum.h"

#define ___ KC_NO

#define LAYOUT( \\
  ${layout.join(` \\\n  `)}
){ \\
  ${matrix.join(` \\\n  `)}
}
`;

  document.getElementById('result').innerText = res;
}

function calcRowsCols(kleStr) {
  const keys = [];
}

(function() {
  const convertEl = document.getElementById('convert');
  const rows = document.getElementById('rows');
  const cols = document.getElementById('cols');
  const layout = document.getElementById('layout');

  convertEl.onclick = () => run(rows.value, cols.value, layout.value);
  layout.onblur = () => calcRowsCols(layout.value);
})();
