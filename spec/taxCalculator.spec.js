/**
 * Jasmine Unit Tests for Tax Calculator
 * Written by Brian McCarthy
 */
import { calculateTax } from '../src/taxCalculator.js';

describe('Tax Calculator Logic', () => {
  const mockBrackets = [
    { limit: 10000, rate: 0.10 },
    { limit: 40000, rate: 0.15 },
    { limit: 80000, rate: 0.25 },
    { limit: null, rate: 0.35 }
  ];

  it('should return 0 for zero or negative income', () => {
    expect(calculateTax(0, mockBrackets)).toBe(0);
    expect(calculateTax(-500, mockBrackets)).toBe(0);
  });

  it('should calculate 10% for the first $10,000', () => {
    expect(calculateTax(5000, mockBrackets)).toBe(500);
    expect(calculateTax(10000, mockBrackets)).toBe(1000);
  });

  it('should apply 15% for income between $10,001 and $40,000', () => {
    // 10000 * 0.10 + 10000 * 0.15 = 1000 + 1500 = 2500
    expect(calculateTax(20000, mockBrackets)).toBe(2500);
  });

  it('should apply 25% for income between $40,001 and $80,000', () => {
    // 1000 (1st) + 4500 (2nd: 30000 * 0.15) + 2500 (3rd: 10000 * 0.25) = 8000
    expect(calculateTax(50000, mockBrackets)).toBe(8000);
  });

  it('should apply 35% for income above $80,000', () => {
    // 10000*0.1 + 30000*0.15 + 40000*0.25 + 20000*0.35 = 1000 + 4500 + 10000 + 7000 = 22500
    expect(calculateTax(100000, mockBrackets)).toBe(22500);
  });

  it('should handle non-numeric inputs gracefully', () => {
    expect(calculateTax('abc', mockBrackets)).toBe(0);
    expect(calculateTax(null, mockBrackets)).toBe(0);
  });

  it('should return rounded values to 2 decimal places', () => {
    expect(calculateTax(12345.67, mockBrackets)).toBe(1351.85);
  });
});
