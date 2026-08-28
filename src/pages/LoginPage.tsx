import { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLoading,
  IonPage,
  IonText,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Ingresa un correo válido.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      history.replace('/app/register');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen className="auth-page">
        <div className="auth-shell">
          <IonCard className="auth-card">
            <IonCardHeader>
              <IonCardSubtitle>Gestión comercial</IonCardSubtitle>
              <IonCardTitle>Créditos</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p className="muted-copy">Inicia sesión para registrar y consultar créditos.</p>
              <form onSubmit={handleSubmit} noValidate>
                <IonItem lines="none" className="field-item">
                  <IonInput
                    label="Correo"
                    labelPlacement="stacked"
                    fill="outline"
                    type="email"
                    autocomplete="email"
                    value={email}
                    onIonInput={(event) => setEmail(event.detail.value ?? '')}
                    disabled={submitting}
                  />
                </IonItem>
                <IonItem lines="none" className="field-item">
                  <IonInput
                    label="Contraseña"
                    labelPlacement="stacked"
                    fill="outline"
                    type="password"
                    autocomplete="current-password"
                    value={password}
                    onIonInput={(event) => setPassword(event.detail.value ?? '')}
                    disabled={submitting}
                  />
                </IonItem>
                {error && <IonText color="danger"><p className="form-message">{error}</p></IonText>}
                <IonButton expand="block" type="submit" disabled={submitting} className="primary-action">
                  Iniciar sesión
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
        <IonLoading isOpen={submitting} message="Iniciando sesión..." />
      </IonContent>
    </IonPage>
  );
}
