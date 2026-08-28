import { IonButton } from '@ionic/react';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function PaginationControls({ page, totalPages, disabled, onPrevious, onNext }: PaginationControlsProps) {
  return (
    <div className="pagination-row">
      <IonButton fill="outline" size="small" disabled={disabled || page <= 1 || totalPages === 0} onClick={onPrevious}>Anterior</IonButton>
      <span>Página {totalPages === 0 ? 0 : page} de {totalPages}</span>
      <IonButton fill="outline" size="small" disabled={disabled || totalPages === 0 || page >= totalPages} onClick={onNext}>Siguiente</IonButton>
    </div>
  );
}
