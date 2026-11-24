# GTU Digital Fundamentals 3130704 K-map minimizer: 2 to 4 variables, don't cares, minimal SOP

K-map sums are free marks if your groups are right, and a silent zero if one minterm is left out. Minterms aur don't cares daalo, the page draws the map in Gray code order, lists the prime implicants, marks the essential ones and gives one minimal SOP. Use it to check your hand answer, not to skip the map. Practice values are my own.

Live page: https://princeadvant.github.io/gtu-df-kmap-minimizer/

## Facts used

- Rows and columns go in Gray code order 00, 01, 11, 10, so neighbours differ in one bit. That is why the edges wrap around.
- A group must have 1, 2, 4, 8 or 16 cells, and must be a rectangle (wrap-around allowed).
- A prime implicant is a group that cannot be made bigger. An essential prime implicant is the only one covering some minterm. Essentials always go in the answer.
- Don't cares (d) may be used to make groups bigger but never need to be covered.
- Bigger group means fewer literals: an 8-cell group in 4 variables is a single literal.
- Default practice set: F(A, B, C, D) = sum m(0, 1, 2, 5, 8, 9, 10) minimizes to B'C' + B'D' + A'C'D.

## Test

`node test.js` checks the minimized SOP against the truth table for all 256 functions of 3 variables, plus 4-variable cases with don't cares, and prints `All checks passed`.

## Tips

- Write the cell numbers inside the map first (for 4 variables the third column is 3, 7, 15, 11 and the fourth is 2, 6, 14, 10). Most wrong answers come from a wrongly numbered map.
- The four corners (0, 2, 8, 10) are one group of 4. Very easy to miss.
- Some functions have two equally small answers. If yours has the same number of terms and literals and covers every 1, it is also correct.
- For POS, group the 0s and write each group as a sum term, then AND them.

## Practice with the real paper

GTU Hero has the Winter 2025 Digital Fundamentals (3130704) paper page: 70 marks, 25 questions extracted, with links to the Winter 2024 and Winter 2022 papers and the new scheme code BE03000071. Open it here: [GTUHero](https://gtuhero.com/gtu-papers/gujarat-technological-university-3130704-digital-fundamentals-winter-2025) (GTU Hero is my project).

## Licence

MIT
