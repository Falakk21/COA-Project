import { describe, expect, it } from 'vitest';
import { generateInstructionSets, validateExpression } from './iss';

describe('validateExpression', () => {
  it('accepts a valid arithmetic expression and returns postfix', () => {
    const result = validateExpression('(A+B)*(C-D)/E');

    expect(result.isValid).toBe(true);
    expect(result.postfix).toBe('AB+CD-*E/');
  });

  it('rejects malformed expressions', () => {
    expect(validateExpression('A++').isValid).toBe(false);
    expect(validateExpression('(A+B').isValid).toBe(false);
    expect(validateExpression('A+*B').isValid).toBe(false);
    expect(validateExpression(')( ').isValid).toBe(false);
  });
});

describe('generateInstructionSets', () => {
  it('builds all four instruction formats for the supplied expression', () => {
    const result = generateInstructionSets('(A+B)*(C-D)/E');

    expect(result.postfix).toBe('AB+CD-*E/');
    expect(result.threeAddress.instructions[0]).toBe('T1 = A + B');
    expect(result.twoAddress.instructions[0]).toBe('MOV R1, A');
    expect(result.oneAddress.instructions[0]).toBe('LOAD A');
    expect(result.zeroAddress.instructions[0]).toBe('PUSH A');

    expect(result.counts.threeAddress).toBe(4);
    expect(result.counts.twoAddress).toBe(8);
    expect(result.counts.oneAddress).toBe(12);
    expect(result.counts.zeroAddress).toBe(9);
  });
});
