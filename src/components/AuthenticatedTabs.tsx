import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { addCircleOutline, listOutline, logOutOutline } from 'ionicons/icons';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreditsQueryPage } from '../pages/CreditsQueryPage';
import { RegisterCreditPage } from '../pages/RegisterCreditPage';

export function AuthenticatedTabs() {
  const { logout } = useAuth();

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/register"><RegisterCreditPage /></Route>
        <Route exact path="/app/credits"><CreditsQueryPage /></Route>
        <Redirect exact from="/app" to="/app/register" />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="register" href="/app/register">
          <IonIcon icon={addCircleOutline} />
          <IonLabel>Registrar</IonLabel>
        </IonTabButton>
        <IonTabButton tab="credits" href="/app/credits">
          <IonIcon icon={listOutline} />
          <IonLabel>Consultar</IonLabel>
        </IonTabButton>
        <IonTabButton tab="logout" onClick={() => void logout()}>
          <IonIcon icon={logOutOutline} />
          <IonLabel>Salir</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
