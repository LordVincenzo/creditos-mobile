import { useCallback, useEffect, useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { CreditsTable } from '../components/CreditsTable';
import { PaginationControls } from '../components/PaginationControls';
import type { Credit, CreditQueryParams, PagedResult } from '../models/credit';
import { queryCredits } from '../services/credits';

interface FilterState {
  clientName: string;
  clientDocument: string;
  commercial: string;
  sortBy: 'createdAt' | 'amount';
  sortDirection: 'asc' | 'desc';
}

const emptyFilters: FilterState = {
  clientName: '',
  clientDocument: '',
  commercial: '',
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

export function CreditsQueryPage() {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [result, setResult] = useState<PagedResult<Credit> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const executeSearch = useCallback(async (page: number, nextFilters: FilterState) => {
    const query: CreditQueryParams = { ...nextFilters, page, pageSize: 20 };
    try {
      setLoading(true);
      setError('');
      setResult(await queryCredits(query));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible consultar los créditos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void executeSearch(1, emptyFilters);
  }, [executeSearch]);

  function update<K extends keyof FilterState>(field: K, value: FilterState[K]) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void executeSearch(1, filters);
  }

  function clearFilters() {
    setFilters(emptyFilters);
    void executeSearch(1, emptyFilters);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar><IonTitle>Consultar créditos</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="page-background">
        <div className="content-shell wide">
          <IonCard>
            <IonCardHeader><IonCardTitle>Filtros</IonCardTitle></IonCardHeader>
            <IonCardContent>
              <form onSubmit={submit}>
                <div className="filters-grid">
                  <IonItem lines="none" className="field-item">
                    <IonInput label="Nombre cliente" labelPlacement="stacked" fill="outline" value={filters.clientName} onIonInput={(e) => update('clientName', e.detail.value ?? '')} />
                  </IonItem>
                  <IonItem lines="none" className="field-item">
                    <IonInput label="Cédula / ID" labelPlacement="stacked" fill="outline" value={filters.clientDocument} onIonInput={(e) => update('clientDocument', e.detail.value ?? '')} />
                  </IonItem>
                  <IonItem lines="none" className="field-item">
                    <IonInput label="Comercial" labelPlacement="stacked" fill="outline" value={filters.commercial} onIonInput={(e) => update('commercial', e.detail.value ?? '')} />
                  </IonItem>
                  <IonItem className="select-item">
                    <IonLabel position="stacked">Ordenar por</IonLabel>
                    <IonSelect value={filters.sortBy} onIonChange={(e) => update('sortBy', e.detail.value)} interface="popover">
                      <IonSelectOption value="createdAt">Fecha</IonSelectOption>
                      <IonSelectOption value="amount">Valor del crédito</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem className="select-item">
                    <IonLabel position="stacked">Dirección</IonLabel>
                    <IonSelect value={filters.sortDirection} onIonChange={(e) => update('sortDirection', e.detail.value)} interface="popover">
                      <IonSelectOption value="desc">Descendente</IonSelectOption>
                      <IonSelectOption value="asc">Ascendente</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </div>
                <div className="actions-row">
                  <IonButton type="submit" disabled={loading}>Buscar</IonButton>
                  <IonButton type="button" fill="outline" disabled={loading} onClick={clearFilters}>Limpiar filtros</IonButton>
                </div>
              </form>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader><IonCardTitle>Resultados</IonCardTitle></IonCardHeader>
            <IonCardContent>
              <CreditsTable items={result?.items ?? []} />
              <PaginationControls
                page={result?.page ?? 1}
                totalPages={result?.totalPages ?? 0}
                disabled={loading}
                onPrevious={() => result && void executeSearch(result.page - 1, filters)}
                onNext={() => result && void executeSearch(result.page + 1, filters)}
              />
            </IonCardContent>
          </IonCard>
        </div>
        <IonLoading isOpen={loading} message="Consultando créditos..." />
        <IonToast isOpen={Boolean(error)} message={error} color="danger" duration={3000} onDidDismiss={() => setError('')} />
      </IonContent>
    </IonPage>
  );
}
