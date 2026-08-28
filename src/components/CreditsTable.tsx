import type { Credit } from '../models/credit';
import { formatDate, formatMoney } from '../utils/format';

interface CreditsTableProps {
  items: Credit[];
}

export function CreditsTable({ items }: CreditsTableProps) {
  if (items.length === 0) {
    return <div className="empty-state">No se encontraron créditos con los filtros actuales.</div>;
  }

  return (
    <div className="credits-table-wrapper">
      <table className="credits-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Documento</th>
            <th>Valor</th>
            <th>Interés</th>
            <th>Plazo</th>
            <th>Comercial</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {items.map((credit) => (
            <tr key={credit.id}>
              <td>{credit.clientName}</td>
              <td>{credit.clientDocument}</td>
              <td>{formatMoney(credit.amount)}</td>
              <td>{credit.interestRate}%</td>
              <td>{credit.termMonths} meses</td>
              <td>{credit.commercialName}</td>
              <td>{formatDate(credit.createdAtUtc)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
