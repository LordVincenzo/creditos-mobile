import type { CreateCreditPayload } from '../models/credit';

export interface CreditFormValues {
  clientName: string;
  clientDocument: string;
  amount: string;
  interestRate: string;
  termMonths: string;
}

export type CreditFormErrors = Partial<Record<keyof CreditFormValues, string>>;

function parseDecimal(value: string): number {
  return Number(value.trim().replace(',', '.'));
}

export function validateCreditForm(values: CreditFormValues): CreditFormErrors {
  const errors: CreditFormErrors = {};
  const clientName = values.clientName.trim();
  const clientDocument = values.clientDocument.trim();
  const amount = parseDecimal(values.amount);
  const interestRate = parseDecimal(values.interestRate);
  const termMonths = Number(values.termMonths.trim());

  if (clientName.length < 2 || clientName.length > 150) {
    errors.clientName = 'Ingresa un nombre válido.';
  }
  if (clientDocument.length < 3 || clientDocument.length > 50) {
    errors.clientDocument = 'Ingresa una cédula o ID válido.';
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = 'El valor debe ser mayor que cero.';
  }
  if (values.interestRate.trim() === '' || !Number.isFinite(interestRate) || interestRate < 0 || interestRate > 100) {
    errors.interestRate = 'La tasa debe estar entre 0 y 100.';
  }
  if (!Number.isInteger(termMonths) || termMonths < 1 || termMonths > 600) {
    errors.termMonths = 'El plazo debe estar entre 1 y 600 meses.';
  }

  return errors;
}

export function normalizeCreditPayload(values: CreditFormValues): CreateCreditPayload {
  return {
    clientName: values.clientName.trim(),
    clientDocument: values.clientDocument.trim(),
    amount: parseDecimal(values.amount),
    interestRate: parseDecimal(values.interestRate),
    termMonths: Number(values.termMonths.trim()),
  };
}
