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
