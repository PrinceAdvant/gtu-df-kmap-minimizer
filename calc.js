// GTU Digital Fundamentals: K-map (2 to 4 variables) minimal SOP via Quine-McCluskey + exact cover. MIT licence.
const F = {
  parseList(s, n, name) {
    const v = (s.match(/\d+/g) || []).map(Number);
    if (v.some(x => x >= (1 << n))) throw new Error(name + ' must be between 0 and ' + ((1 << n) - 1) + ' for ' + n + ' variables');
    return [...new Set(v)].sort((a, b) => a - b);
  },
  // implicant = { bits: string of 0/1/-, terms: [...] }
  primeImplicants(n, terms) {
    let groups = terms.map(t => ({ bits: t.toString(2).padStart(n, '0'), terms: [t] }));
    const primes = [];
    while (groups.length) {
      const used = new Set(), next = new Map();
      for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) {
        const a = groups[i].bits, b = groups[j].bits;
        let diff = -1, count = 0;
        for (let k = 0; k < n; k++) if (a[k] !== b[k]) { count++; diff = k; }
        if (count === 1 && a[diff] !== '-' && b[diff] !== '-') {
          const bits = a.slice(0, diff) + '-' + a.slice(diff + 1);
          used.add(i); used.add(j);
          if (!next.has(bits)) next.set(bits, { bits, terms: [...new Set(groups[i].terms.concat(groups[j].terms))].sort((x, y) => x - y) });
        }
      }
      groups.forEach((g, i) => { if (!used.has(i) && !primes.some(p => p.bits === g.bits)) primes.push(g); });
      groups = [...next.values()];
    }
    return primes;
  },
  literal(bits, names) {
    let s = '';
    for (let i = 0; i < bits.length; i++) if (bits[i] !== '-') s += names[i] + (bits[i] === '0' ? "'" : '');
    return s || '1';
  },
  cost(set) { return [set.length, set.reduce((a, p) => a + p.bits.replace(/-/g, '').length, 0)]; },
  minimize(n, minterms, dontcares) {
    const names = 'ABCD'.slice(0, n).split('');
    if (minterms.some(m => dontcares.includes(m))) throw new Error('a term cannot be both a minterm and a don\'t care');
    if (!minterms.length) return { sop: '0', terms: [], primes: [], essential: [] };
    const primes = F.primeImplicants(n, minterms.concat(dontcares).sort((a, b) => a - b));
    const essential = [];
    for (const m of minterms) {
      const cov = primes.filter(p => p.terms.includes(m));
      if (cov.length === 1 && !essential.includes(cov[0])) essential.push(cov[0]);
    }
    const left = minterms.filter(m => !essential.some(p => p.terms.includes(m)));
    const others = primes.filter(p => !essential.includes(p));
    let best = null;
    // exact search over the remaining primes (small for 4 variables)
    for (let mask = 0; mask < (1 << others.length); mask++) {
      const pick = others.filter((_, i) => mask & (1 << i));
      if (!left.every(m => pick.some(p => p.terms.includes(m)))) continue;
      const c = F.cost(pick);
      if (!best || c[0] < best.c[0] || (c[0] === best.c[0] && c[1] < best.c[1])) best = { pick, c };
    }
    const chosen = essential.concat(best.pick).sort((a, b) => a.bits < b.bits ? 1 : -1);
    const sop = chosen.map(p => F.literal(p.bits, names)).join(' + ');
    return { sop, terms: chosen, primes, essential, names };
  },
  // Gray order layout of the map, rows x cols
  layout(n) {
    const g = [[0], [0, 1], [0, 1, 3, 2]];
    const rb = Math.floor(n / 2), cb = n - rb;
    const rows = rb === 0 ? [0] : g[rb], cols = g[cb];
    return { rb, cb, rows, cols, cell: (r, c) => (r << cb) | c };
  },
  evaluate(sop, n, x) { // used by tests: value of minimized SOP at minterm x
    if (sop === '0') return 0; if (sop === '1') return 1;
    return sop.split(' + ').some(t => {
      const lits = t.match(/[A-D]'?/g);
      return lits.every(l => { const bit = (x >> (n - 1 - 'ABCD'.indexOf(l[0]))) & 1; return l.length === 2 ? bit === 0 : bit === 1; });
    }) ? 1 : 0;
  }
};
if (typeof module !== 'undefined') module.exports = F;
