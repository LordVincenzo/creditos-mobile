import { describe, expect, it } from 'vitest';
import { normalizeCreditPayload, validateCreditForm } from './creditValidation';

describe('creditValidation', () => {
  it('rejects missing and invalid values', () => {
    const errors = validateCreditForm({
      clientName: '', clientDocument: '', amount: '0', interestRate: '101', termMonths: '0',
    });
    expect(errors.clientName).toBeTruthy();
    expect(errors.clientDocument).toBeTruthy();
    expect(errors.amount).toBeTruthy();
    expect(errors.interestRate).toBeTruthy();
    expect(errors.termMonths).toBeTruthy();
  });

  it('normalizes valid numeric values', () => {
    const payload = normalizeCreditPayload({
      clientName: ' Pepito Perez ', clientDocument: ' 00123 ', amount: '7800000', interestRate: '2', termMonths: '10',
    });
    expect(payload).toEqual({
      clientName: 'Pepito Perez', clientDocument: '00123', amount: 7800000, interestRate: 2, termMonths: 10,
    });
  });
});
