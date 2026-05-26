import {bootstrapApplication} from '@angular/platform-browser';
import {App} from './app/app';
import {appConfig} from './app/app.config';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './app/core/firebase-init';

async function testConnection() {
  try {
    console.log('Testing Firestore connection...');
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connection successful');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firestore connection failed: the client is offline. Please check your Firebase configuration.");
    } else {
      console.error("Firestore connection error:", error);
    }
  }
}

console.log('Bootstrapping application...');
bootstrapApplication(App, appConfig)
  .then(async () => {
    console.log('Application bootstrapped successfully');
    await testConnection();
  })
  .catch((err) => console.error('Bootstrap error:', err));
