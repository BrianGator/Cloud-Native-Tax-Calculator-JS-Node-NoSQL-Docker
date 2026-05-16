/**
 * Tax calculation logic based on provided brackets
 * Cloud Native Final Project - Written by Brian McCarthy
 */

/**
 * Tax calculation logic
 * @param {number} income 
 * @param {Array} brackets
 * @returns {number}
 */
export function calculateTax(income, brackets) {
  if (income <= 0 || isNaN(income) || !brackets || !Array.isArray(brackets)) return 0;

  let tax = 0;
  let remainingIncome = income;
  let previousLimit = 0;

  for (const bracket of brackets) {
    const limit = bracket.limit === null ? Infinity : bracket.limit;
    const range = limit - previousLimit;
    const taxableAmount = Math.min(remainingIncome, range);
    
    tax += taxableAmount * bracket.rate;
    remainingIncome -= taxableAmount;
    previousLimit = limit;

    if (remainingIncome <= 0) break;
  }

  return Math.round(tax * 100) / 100;
}
