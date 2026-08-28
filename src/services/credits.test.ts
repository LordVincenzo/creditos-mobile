import { describe, expect, it } from 'vitest';
import { buildCreditQueryString } from './credits';

describe('buildCreditQueryString', () => {
  it('sends filters, sort and pagination without empty filters', () => {
    const query = buildCreditQueryString({
      clientName: 'pepito', clientDocument: '', commercial: 'juan', sortBy: 'amount', sortDirection: 'asc', page: 2, pageSize: 20,
    });
    expect(query).toContain('clientName=pepito');
    expect(query).not.toContain('clientDocument=');
    expect(query).toContain('commercial=juan');
    expect(query).toContain('sortBy=amount');
    expect(query).toContain('sortDirection=asc');
    expect(query).toContain('page=2');
  });
});
