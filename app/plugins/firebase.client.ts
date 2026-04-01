import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { FirebaseOptions } from "firebase/app";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const firebaseConfig = config.public.firebase as {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };

  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig as FirebaseOptions);
    const auth = getAuth(app);
    return {
      provide: {
        firebaseApp: app,
        firebaseAuth: auth,
      },
    };
  }

  return {
    provide: {
      firebaseApp: nuxtApp.$firebaseApp,
      firebaseAuth: nuxtApp.$firebaseAuth,
    },
  };
});
