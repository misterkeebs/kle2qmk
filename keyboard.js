class Key {
  constructor(x, y, col, row) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.row = row;
    this.name = `k${y.toString(16)}${x.toString(16)}`;
  }
}

class NullKey extends Key {
  constructor(x, y, col, row) {
    super(0, 0, 0, 0);
    this.name = '___';
  }
}

const NULL_KEY = new NullKey();

class Keyboard {
  constructor(kleStr) {
    this.kleLayout = parseKle(kleStr);
    this._rows = new Set();
    this._cols = new Set();
    this.keys = [];

    this.parse();
  }

  set rows(rows) {
    this._rows = new Set(rows);
  }

  get rows() {
    return Array.from(this._rows);
  }

  set cols(cols) {
    this._cols = new Set(cols);
  }

  get cols() {
    return Array.from(this._cols);
  }

  keyAt(x, y) {
    const key = this.keys.find(k => k.x === x && k.y === y)
      || NULL_KEY;
    return key;
  }

  parse() {
    this.layout = [];
    const errors = new Set();
    for (let r = 0; r < this.kleLayout.length; r++) {
      const line = this.kleLayout[r];
      const keyStr = line.find(el => typeof el !== 'object');
      if (!keyStr || !keyStr.length) {
        errors.add(`Missing data for row ${r}`);
        continue;
      }
      const [col, row] = keyStr.split('\n');
      this._cols.add(col);
      this._rows.add(row);
    }

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
        console.log('col', col);
        console.log('row', row);
        if (!col || !col.length) {
          errors.add(`Missing col info at ${c}, ${r}`);
        }
        if (!row || !row.length) {
          errors.add(`Missing row info at ${c}, ${r}`);
        }
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

  console.log('errors', errors);
    if (errors.size > 0) {
      throw Array.from(errors).join(`\n`);
    }
  }
}

function parseKle(layout) {
  console.log('layout', layout);
  return JSON.parse('[' + layout.replace(/([a-z]):/g, '"$1":') + ']');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Keyboard };
}
