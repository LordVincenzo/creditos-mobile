import type { Credit, CreditQueryParams, CreateCreditPayload, PagedResult } from '../models/credit';
import { apiRequest } from './api';

export function buildCreditQueryString(query: CreditQueryParams): string {
  const params = new URLSearchParams();
  if (query.clientName?.trim()) params.set('clientName', query.clientName.trim());
  if (query.clientDocument?.trim()) params.set('clientDocument', query.clientDocument.trim());
  if (query.commercial?.trim()) params.set('commercial', query.commercial.trim());
  params.set('sortBy', query.sortBy);
  params.set('sortDirection', query.sortDirection);
  params.set('page', String(query.page));
  params.set('pageSize', String(query.pageSize));
  return params.toString();
}

export function createCredit(payload: CreateCreditPayload): Promise<Credit> {
  return apiRequest<Credit>('/api/credits', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function queryCredits(query: CreditQueryParams): Promise<PagedResult<Credit>> {
  return apiRequest<PagedResult<Credit>>(`/api/credits?${buildCreditQueryString(query)}`);
}
