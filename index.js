function run(keyboard) {
  console.log('keyboard', keyboard);
  const matrix = [];
  let matrixStr = '';
  for (let r = 0; r < keyboard.rows.length; r++) {
    for (let c = 0; c < keyboard.cols.length; c++) {
      const key = keyboard.keyAt(c, r);
      matrixStr += `${key.name}, `;
    }
    matrix.push(`  { ${matrixStr.slice(0, -2)} }, `);
    matrixStr = '';
  }

  const layout = [];
  let layoutStr = '';
  keyboard.layout.forEach(row => {
    row.forEach(key => {
      layoutStr += `${key.name}, `;
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

window.onload = () => {
  const convert = document.getElementById('convert');
  const rows = document.getElementById('rows');
  const cols = document.getElementById('cols');
  const layout = document.getElementById('layout');
  const result = document.getElementById('result');

  let keyboard;

  const err = (err) => {
    if (err.stack) {
      result.innerText = err.stack;
    } else {
      result.innerText = err;
    }
  };

  layout.onblur = () => {
    result.innerText = "";
    try {
      keyboard = new Keyboard(layout.value)
      rows.value = Array.from(keyboard.rows).join(', ');
      cols.value = Array.from(keyboard.cols).join(', ');
    } catch (e) {
      err(e);
    }
  };

  convert.onclick = () => {
    result.innerText = "";
    try {
      keyboard.cols = cols.value.split(',').map(v => v.trim());
      keyboard.rows = rows.value.split(',').map(v => v.trim());
      run(keyboard);
    } catch (e) {
      err(e);
    }
  }
};
