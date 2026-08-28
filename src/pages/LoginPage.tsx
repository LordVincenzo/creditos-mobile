import { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonInput,
  IonLoading,
  IonPage,
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
            <IonCardContent>
              <div className="auth-eyebrow">Gestión comercial</div>
              <h1 className="auth-title">Créditos</h1>
              <p className="auth-description">
                Inicia sesión para registrar y consultar créditos.
              </p>

              <form onSubmit={handleSubmit} noValidate className="auth-form">
                <div className="form-field">
                  <label htmlFor="login-email" className="field-label">
                    Correo
                  </label>
                  <IonInput
                    id="login-email"
                    className="auth-input"
                    fill="outline"
                    type="email"
                    inputmode="email"
                    autocomplete="email"
                    placeholder="comercial1@demo.local"
                    value={email}
                    onIonInput={(event) => setEmail(event.detail.value ?? '')}
                    disabled={submitting}
                    clearInput
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="login-password" className="field-label">
                    Contraseña
                  </label>
                  <IonInput
                    id="login-password"
                    className="auth-input"
                    fill="outline"
                    type="password"
                    autocomplete="current-password"
                    placeholder="Tu contraseña"
                    value={password}
                    onIonInput={(event) => setPassword(event.detail.value ?? '')}
                    disabled={submitting}
                  />
                </div>

                {error && (
                  <p className="form-message error-message" role="alert">
                    {error}
                  </p>
                )}

                <IonButton
                  expand="block"
                  type="submit"
                  disabled={submitting}
                  className="primary-action"
                >
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