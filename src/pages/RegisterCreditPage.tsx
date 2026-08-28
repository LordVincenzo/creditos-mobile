import { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { useAuth } from '../context/AuthContext';
import { createCredit } from '../services/credits';
import {
  normalizeCreditPayload,
  validateCreditForm,
  type CreditFormErrors,
  type CreditFormValues,
} from '../validation/creditValidation';

const emptyForm: CreditFormValues = {
  clientName: '',
  clientDocument: '',
  amount: '',
  interestRate: '',
  termMonths: '',
};

export function RegisterCreditPage() {
  const { session } = useAuth();
  const [form, setForm] = useState<CreditFormValues>(emptyForm);
  const [errors, setErrors] = useState<CreditFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    color: 'success' | 'danger';
  } | null>(null);

  function update<K extends keyof CreditFormValues>(
    field: K,
    value: CreditFormValues[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    const nextErrors = validateCreditForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);
      await createCredit(normalizeCreditPayload(form));
      setForm(emptyForm);

      setToast({
        message: 'Crédito registrado correctamente.',
        color: 'success',
      });
    } catch (cause) {
      setToast({
        message:
          cause instanceof Error
            ? cause.message
            : 'No fue posible registrar el crédito.',
        color: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
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
        <div className="content-shell register-content">
          <div className="page-intro">
            <span className="section-kicker">Nuevo registro</span>

            <h1>Registrar crédito</h1>

            <p>
              Ingresa la información del cliente y las condiciones del crédito.
            </p>
          </div>

          <IonCard className="form-card">
            <IonCardContent>
              <form
                onSubmit={handleSubmit}
                noValidate
                className="credit-form"
              >
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">
                      Nombre del cliente
                    </label>

                    <IonInput
                      className="app-input"
                      fill="outline"
                      placeholder="Ej. Pepito Pérez"
                      value={form.clientName}
                      onIonInput={(e) =>
                        update('clientName', e.detail.value ?? '')
                      }
                      disabled={submitting}
                    />

                    {errors.clientName && (
                      <p className="field-error">
                        {errors.clientName}
                      </p>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="field-label">
                      Cédula / ID
                    </label>

                    <IonInput
                      className="app-input"
                      fill="outline"
                      inputmode="numeric"
                      placeholder="Número de documento"
                      value={form.clientDocument}
                      onIonInput={(e) =>
                        update('clientDocument', e.detail.value ?? '')
                      }
                      disabled={submitting}
                    />

                    {errors.clientDocument && (
                      <p className="field-error">
                        {errors.clientDocument}
                      </p>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="field-label">
                      Valor del crédito
                    </label>

                    <IonInput
                      className="app-input"
                      fill="outline"
                      type="number"
                      inputmode="decimal"
                      placeholder="0"
                      value={form.amount}
                      onIonInput={(e) =>
                        update('amount', e.detail.value ?? '')
                      }
                      disabled={submitting}
                    />

                    {errors.amount && (
                      <p className="field-error">
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="field-label">
                      Tasa de interés (%)
                    </label>

                    <IonInput
                      className="app-input"
                      fill="outline"
                      type="number"
                      inputmode="decimal"
                      placeholder="0.00"
                      value={form.interestRate}
                      onIonInput={(e) =>
                        update('interestRate', e.detail.value ?? '')
                      }
                      disabled={submitting}
                    />

                    {errors.interestRate && (
                      <p className="field-error">
                        {errors.interestRate}
                      </p>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="field-label">
                      Plazo
                    </label>

                    <IonInput
                      className="app-input"
                      fill="outline"
                      type="number"
                      inputmode="numeric"
                      placeholder="Meses"
                      value={form.termMonths}
                      onIonInput={(e) =>
                        update('termMonths', e.detail.value ?? '')
                      }
                      disabled={submitting}
                    />

                    {errors.termMonths && (
                      <p className="field-error">
                        {errors.termMonths}
                      </p>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="field-label">
                      Comercial
                    </label>

                    <div className="readonly-field">
                      <span>Asignado automáticamente</span>
                      <strong>
                        {session?.user.displayName ?? ''}
                      </strong>
                    </div>
                  </div>
                </div>

                <IonButton
                  expand="block"
                  type="submit"
                  disabled={submitting}
                  className="register-action"
                >
                  Registrar crédito
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>

        <IonLoading
          isOpen={submitting}
          message="Registrando crédito..."
        />

        <IonToast
          isOpen={toast !== null}
          message={toast?.message}
          color={toast?.color}
          duration={2600}
          onDidDismiss={() => setToast(null)}
        />
      </IonContent>
    </IonPage>
  );
}