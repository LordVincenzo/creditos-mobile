import { useCallback, useEffect, useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { CreditsTable } from '../components/CreditsTable';
import { PaginationControls } from '../components/PaginationControls';
import type { Credit, CreditQueryParams, PagedResult } from '../models/credit';
import { queryCredits } from '../services/credits';
import { useAuth } from '../context/AuthContext';

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
  const { session } = useAuth();
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [result, setResult] = useState<PagedResult<Credit> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const executeSearch = useCallback(
    async (page: number, nextFilters: FilterState) => {
      const query: CreditQueryParams = {
        ...nextFilters,
        page,
        pageSize: 20,
      };

      try {
        setLoading(true);
        setError('');
        setResult(await queryCredits(query));
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : 'No fue posible consultar los créditos.',
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void executeSearch(1, emptyFilters);
  }, [executeSearch]);

  function update<K extends keyof FilterState>(
    field: K,
    value: FilterState[K],
  ) {
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
      <IonHeader className="main-header">
        <IonToolbar>
          <div className="toolbar-content">
            <div>
              <span className="toolbar-eyebrow">Gestión comercial</span>
              <strong>Créditos</strong>
            </div>

            <span className="toolbar-user">
              {session?.user.displayName}
            </span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="page-background">
        <div className="content-shell query-content">
          <div className="page-intro">
            <span className="section-kicker">Historial</span>
            <h1>Consultar créditos</h1>
            <p>Busca y filtra los créditos registrados.</p>
          </div>

          <IonCard className="form-card query-card">
            <IonCardContent>
              <form onSubmit={submit} className="query-form">
                <div className="query-grid">
                  <div className="form-field">
                    <label className="field-label">Cliente</label>
                    <IonInput
                      className="app-input"
                      fill="outline"
                      placeholder="Nombre del cliente"
                      value={filters.clientName}
                      onIonInput={(e) =>
                        update('clientName', e.detail.value ?? '')
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Cédula / ID</label>
                    <IonInput
                      className="app-input"
                      fill="outline"
                      placeholder="Número de documento"
                      value={filters.clientDocument}
                      onIonInput={(e) =>
                        update('clientDocument', e.detail.value ?? '')
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Comercial</label>
                    <IonInput
                      className="app-input"
                      fill="outline"
                      placeholder="Nombre del comercial"
                      value={filters.commercial}
                      onIonInput={(e) =>
                        update('commercial', e.detail.value ?? '')
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Ordenar por</label>
                    <div className="app-select">
                      <IonSelect
                        value={filters.sortBy}
                        interface="popover"
                        onIonChange={(e) =>
                          update('sortBy', e.detail.value)
                        }
                      >
                        <IonSelectOption value="createdAt">
                          Fecha
                        </IonSelectOption>
                        <IonSelectOption value="amount">
                          Valor del crédito
                        </IonSelectOption>
                      </IonSelect>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Dirección</label>
                    <div className="app-select">
                      <IonSelect
                        value={filters.sortDirection}
                        interface="popover"
                        onIonChange={(e) =>
                          update('sortDirection', e.detail.value)
                        }
                      >
                        <IonSelectOption value="desc">
                          Más recientes
                        </IonSelectOption>
                        <IonSelectOption value="asc">
                          Más antiguos
                        </IonSelectOption>
                      </IonSelect>
                    </div>
                  </div>
                </div>

                <div className="query-actions">
                  <IonButton type="submit" disabled={loading}>
                    Buscar
                  </IonButton>

                  <IonButton
                    type="button"
                    fill="clear"
                    disabled={loading}
                    onClick={clearFilters}
                  >
                    Limpiar
                  </IonButton>
                </div>
              </form>
            </IonCardContent>
          </IonCard>

          <div className="results-heading">
            <div>
              <span className="section-kicker">Resultados</span>
              <h2>Créditos registrados</h2>
            </div>

            {result && (
              <span className="results-count">
                {result.totalItems} registros
              </span>
            )}
          </div>

          <IonCard className="results-card">
            <IonCardContent>
              <CreditsTable items={result?.items ?? []} />

              <PaginationControls
                page={result?.page ?? 1}
                totalPages={result?.totalPages ?? 0}
                disabled={loading}
                onPrevious={() =>
                  result &&
                  void executeSearch(result.page - 1, filters)
                }
                onNext={() =>
                  result &&
                  void executeSearch(result.page + 1, filters)
                }
              />
            </IonCardContent>
          </IonCard>
        </div>

        <IonLoading isOpen={loading} message="Consultando créditos..." />

        <IonToast
          isOpen={Boolean(error)}
          message={error}
          color="danger"
          duration={3000}
          onDidDismiss={() => setError('')}
        />
      </IonContent>
    </IonPage>
  );
}