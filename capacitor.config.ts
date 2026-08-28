import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.creditos.app',
  appName: 'Creditos',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
