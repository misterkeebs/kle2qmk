const fs = require('fs');
const data = JSON.parse('[' + fs.readFileSync('data.json', 'utf8').replace(/([a-z]):/g, '"$1":') + ']');

const rows = ['B0', 'B1', 'B2', 'B3', 'B7'];
const cols = ['D0', 'D1', 'D2', 'D3', 'D5', 'D4', 'D6', 'D7', 'B4', 'F7', 'F6', 'F5', 'F4', 'F1', 'F0'];

class Key {
  constructor(x, y, data) {
    const [col, row] = data.split('\n');

    this.posCol = x;
    this.posRow = y;
    this.matCol = Array.from(cols).indexOf(col);
    this.matRow = Array.from(rows).indexOf(row);
  }
}

const keys = [];
data.forEach((r, y) => {
  r.forEach((key, x) => {
    if (!key || (typeof key !== 'object')) {
      keys.push(new Key(x, y, key));
    }
  });
});

const matrix = [];
let matrixStr = '';
for (let r = 0; r < rows.length; r++) {
  for (let c = 0; c < cols.length; c++) {
    const key = keys.find(k => k.matCol === c && k.matRow === r);
    if (key) {
      key.name = `k${r.toString(16)}${c.toString(16)}`;
      matrixStr += `${key.name}, `;
    } else {
      matrixStr += `_x_, `;
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

console.log(`#pragma once

#include "quantum.h"

#define _x_ KC_NO

#define LAYOUT( \\
${layout.join(` \\\n`)}
){ \\
${matrix.join(` \\\n`)}
}
`);
