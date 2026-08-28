export interface CreateCreditPayload {
  clientName: string;
  clientDocument: string;
  amount: number;
  interestRate: number;
  termMonths: number;
}

export interface Credit {
  id: string;
  clientName: string;
  clientDocument: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  registeredByUserId: string;
  commercialName: string;
  createdAtUtc: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CreditQueryParams {
  clientName?: string;
  clientDocument?: string;
  commercial?: string;
  sortBy: 'createdAt' | 'amount';
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
