import { IonApp, IonContent, IonPage, IonSpinner, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AuthenticatedTabs } from './components/AuthenticatedTabs';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';

setupIonicReact();

function Routes() {
  const { session, isLoading } = useAuth();
  if (isLoading) {
    return <IonPage><IonContent><div className="loading-shell"><IonSpinner name="crescent" /></div></IonContent></IonPage>;
  }

  return (
    <IonReactRouter>
      <Switch>
        <Route exact path="/login">
          {session ? <Redirect to="/app/register" /> : <LoginPage />}
        </Route>
        <Route path="/app">
          {session ? <AuthenticatedTabs /> : <Redirect to="/login" />}
        </Route>
        <Redirect to={session ? '/app/register' : '/login'} />
      </Switch>
    </IonReactRouter>
  );
}

export default function App() {
  return <IonApp><AuthProvider><Routes /></AuthProvider></IonApp>;
}
