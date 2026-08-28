import type { CapacitorConfig } from '@capacitor/cli';

const localAndroid = process.env.CAPACITOR_LOCAL_HTTP === 'true';

const config: CapacitorConfig = {
  appId: 'com.creditos.app',
  appName: 'Creditos',
  webDir: 'dist',
  server: {
    androidScheme: localAndroid ? 'http' : 'https',
    cleartext: localAndroid,
  },
};

export default config;