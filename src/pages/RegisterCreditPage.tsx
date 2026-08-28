import { useState } from 'react';
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
  IonLoading,
  IonPage,
  IonText,
  IonTitle,
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
  const [toast, setToast] = useState<{ message: string; color: 'success' | 'danger' } | null>(null);

  function update<K extends keyof CreditFormValues>(field: K, value: CreditFormValues[K]) {
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
      setToast({ message: 'Crédito registrado correctamente.', color: 'success' });
    } catch (cause) {
      setToast({ message: cause instanceof Error ? cause.message : 'No fue posible registrar el crédito.', color: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registrar crédito</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="page-background">
        <div className="content-shell">
          <IonCard>
            <IonCardHeader><IonCardTitle>Datos del crédito</IonCardTitle></IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                  <div>
                    <IonItem lines="none" className="field-item">
                      <IonInput label="Nombre del cliente" labelPlacement="stacked" fill="outline" value={form.clientName} onIonInput={(e) => update('clientName', e.detail.value ?? '')} disabled={submitting} />
                    </IonItem>
                    {errors.clientName && <IonText color="danger"><p className="field-error">{errors.clientName}</p></IonText>}
                  </div>
                  <div>
                    <IonItem lines="none" className="field-item">
                      <IonInput label="Cédula / ID" labelPlacement="stacked" fill="outline" value={form.clientDocument} onIonInput={(e) => update('clientDocument', e.detail.value ?? '')} disabled={submitting} />
                    </IonItem>
                    {errors.clientDocument && <IonText color="danger"><p className="field-error">{errors.clientDocument}</p></IonText>}
                  </div>
                  <div>
                    <IonItem lines="none" className="field-item">
                      <IonInput label="Valor del crédito" labelPlacement="stacked" fill="outline" type="number" inputmode="decimal" value={form.amount} onIonInput={(e) => update('amount', e.detail.value ?? '')} disabled={submitting} />
                    </IonItem>
                    {errors.amount && <IonText color="danger"><p className="field-error">{errors.amount}</p></IonText>}
                  </div>
                  <div>
                    <IonItem lines="none" className="field-item">
                      <IonInput label="Tasa de interés (%)" labelPlacement="stacked" fill="outline" type="number" inputmode="decimal" value={form.interestRate} onIonInput={(e) => update('interestRate', e.detail.value ?? '')} disabled={submitting} />
                    </IonItem>
                    {errors.interestRate && <IonText color="danger"><p className="field-error">{errors.interestRate}</p></IonText>}
                  </div>
                  <div>
                    <IonItem lines="none" className="field-item">
                      <IonInput label="Plazo en meses" labelPlacement="stacked" fill="outline" type="number" inputmode="numeric" value={form.termMonths} onIonInput={(e) => update('termMonths', e.detail.value ?? '')} disabled={submitting} />
                    </IonItem>
                    {errors.termMonths && <IonText color="danger"><p className="field-error">{errors.termMonths}</p></IonText>}
                  </div>
                  <div>
                    <IonItem lines="none" className="field-item">
                      <IonInput label="Comercial" labelPlacement="stacked" fill="outline" value={session?.user.displayName ?? ''} readonly />
                    </IonItem>
                    <p className="helper-copy">Se obtiene automáticamente de tu sesión.</p>
                  </div>
                </div>
                <IonButton expand="block" type="submit" disabled={submitting} className="primary-action">Registrar crédito</IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
        <IonLoading isOpen={submitting} message="Registrando crédito..." />
        <IonToast isOpen={toast !== null} message={toast?.message} color={toast?.color} duration={2600} onDidDismiss={() => setToast(null)} />
      </IonContent>
    </IonPage>
  );
}
