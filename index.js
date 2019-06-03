class Key {
  constructor(x, y, col, row) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.row = row;
    this.name = `k${row.toString(16)}${col.toString(16)}`;
  }
}

class Keyboard {
  constructor(kleStr) {
    this.kleLayout = parseKle(kleStr);
    this._rows = new Set();
    this._cols = new Set();
    this.keys = [];

    this.parse();
  }

  get rows() {
    return Array.from(this._rows);
  }

  get cols() {
    return Array.from(this._cols);
  }

  keyAt(x, y) {
    return this.keys.find(k => k.x === x && k.y === y);
  }

  parse() {
    this.layout = [];
    for (let r = 0; r < this.kleLayout.length; r++) {
      const rowArr = [];
      const line = this.kleLayout[r];
      console.log('line', line);
      for (let c = 0; c < line.length; c++) {
        const keyStr = line[c];
        if (typeof keyStr === 'object') {
          continue;
        }
        const [col, row] = keyStr.split('\n');
        this._cols.add(col);
        this._rows.add(row);

        const x = this.cols.indexOf(col);
        const y = this.rows.indexOf(row);
        const key = new Key(x, y, col, row);
        this.keys.push(key);
        rowArr.push(key);
      }
      this.layout.push(rowArr);
    }
  }
}

function parseKle(layout) {
  return JSON.parse('[' + layout.replace(/([a-z]):/g, '"$1":') + ']');
}

function run(keyboard) {
  const matrix = [];
  let matrixStr = '';
  for (let r = 0; r < keyboard.rows.length; r++) {
    for (let c = 0; c < keyboard.cols.length; c++) {
      const key = keyboard.keyAt(c, r);
      if (key) {
        key.name = `k${key.row.toString(16)}${key.col.toString(16)}`;
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
  // data.forEach((r, y) => {
  //   r.forEach((key, x) => {
  //     const k = keys.find(k => k.posCol === x && k.posRow === y);
  //     if (k) {
  //       layoutStr += k.name + ', ';
  //     }
  //   });
  //   layout.push(`  ${layoutStr}`);
  //   layoutStr = '';
  // });

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

window.onload = () => {
  const convert = document.getElementById('convert');
  const rows = document.getElementById('rows');
  const cols = document.getElementById('cols');
  const layout = document.getElementById('layout');

  let keyboard;

  layout.onblur = () => {
    keyboard = new Keyboard(layout.value)
    rows.value = Array.from(keyboard.rows).join(', ');
    cols.value = Array.from(keyboard.cols).join(', ');
  };

  convert.onclick = () => run(keyboard);
};
