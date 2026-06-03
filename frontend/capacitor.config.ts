import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.expirygo.app',
  appName: 'ExpiryGo',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Uncomment the url property below if you want the APK to load your live deployed website directly
    // url: 'https://your-vercel-frontend-url.vercel.app',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
