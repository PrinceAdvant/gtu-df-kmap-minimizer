const F = require('./calc.js'), assert = require('assert');
function check(n, m, d, expectSop, expectCount) {
  const r = F.minimize(n, m, d);
  for (let x = 0; x < (1 << n); x++) if (!d.includes(x)) assert.strictEqual(F.evaluate(r.sop, n, x), m.includes(x) ? 1 : 0, 'value at ' + x);
  if (expectSop) assert.strictEqual(r.sop, expectSop);
  if (expectCount) assert.strictEqual(r.terms.length, expectCount);
  return r;
}
let r = check(4, [0, 1, 2, 5, 8, 9, 10], [], null, 3);
assert.deepStrictEqual(r.sop.split(' + ').sort(), ["A'C'D", "B'C'", "B'D'"]);
r = check(4, [1, 3, 7, 11, 15], [0, 2, 5], null, 2);
assert.deepStrictEqual(r.sop.split(' + ').sort(), ["A'B'", 'CD']);
check(3, [0, 2, 4, 6], [], "C'");
check(3, [1, 2, 3, 7], [], null, 3); // A'C + A'B + BC, all essential
check(2, [0, 1, 2, 3], [], '1');
check(4, [], [], '0');
// every 3-variable function: minimized SOP must match the truth table
for (let f = 0; f < 256; f++) { const m = []; for (let x = 0; x < 8; x++) if (f & (1 << x)) m.push(x); check(3, m, []); }
assert.throws(() => F.parseList('16', 4, 'Minterms'));
assert.deepStrictEqual(F.layout(4).cols, [0, 1, 3, 2]);
console.log('All checks passed');
