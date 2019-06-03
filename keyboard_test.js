const { Keyboard } = require('./keyboard');
const fixtures = require('./fixtures.js');

describe('Keyboard', () => {
  const kb = new Keyboard(fixtures.simple);
  it('initializes', () => {
    console.log('kb', kb);
  });
});
