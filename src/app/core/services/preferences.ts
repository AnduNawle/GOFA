import { Injectable, signal, effect, inject } from '@angular/core';
import { AuthService } from './auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-init';

export interface SavedPrefs {
  language?: string;
  emailAlerts?: boolean;
  smsAlerts?: boolean;
  compactMode?: boolean;
  preferredPosition?: string;
  notificationType?: 'immediate' | 'daily';
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Preferences {
  private authService = inject(AuthService);

  // Core personalization signals
  language = signal<string>('fr');
  emailAlerts = signal<boolean>(true);
  smsAlerts = signal<boolean>(false);
  compactMode = signal<boolean>(false);
  preferredPosition = signal<string>('all');
  notificationType = signal<'immediate' | 'daily'>('immediate');
  
  // Status indicator
  isSaving = signal<boolean>(false);

  constructor() {
    // Whenever auth state changes, load user-specific preferences
    effect(() => {
      const user = this.authService.user();
      if (user) {
        this.loadPreferences(user.uid);
      } else {
        // Fallback to anonymous local storage or default
        this.loadGuestPreferences();
      }
    });
  }

  /**
   * Translates / handles bilingual display based on active language.
   */
  t(fr: string, en: string): string {
    return this.language() === 'fr' ? fr : en;
  }

  private loadGuestPreferences() {
    try {
      const data = localStorage.getItem('gofa_pref_guest');
      if (data) {
        this.applyParsedPreferences(JSON.parse(data));
      } else {
        this.resetToDefaults();
      }
    } catch (e) {
      console.error('Error loading guest preferences:', e);
    }
  }

  private async loadPreferences(userId: string) {
    // First, try loading from localStorage for quick/instant initial render
    try {
      const localData = localStorage.getItem(`gofa_pref_${userId}`);
      if (localData) {
        this.applyParsedPreferences(JSON.parse(localData));
      }
    } catch (e) {
      console.error('Error loading local preferences:', e);
    }

    // Then, attempt to backup / sync from Firestore for cloud persistence
    try {
      const docRef = doc(db, 'user_preferences', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        this.applyParsedPreferences(firestoreData);
        // Sync back to local storage
        localStorage.setItem(`gofa_pref_${userId}`, JSON.stringify(firestoreData));
      }
    } catch (e) {
      console.warn('Could not sync preferences from Firestore (offline or rule-restricted):', e);
    }
  }

  private applyParsedPreferences(parsed: SavedPrefs | null | undefined) {
    if (!parsed) return;
    if (parsed.language) this.language.set(parsed.language);
    if (parsed.emailAlerts !== undefined) this.emailAlerts.set(parsed.emailAlerts);
    if (parsed.smsAlerts !== undefined) this.smsAlerts.set(parsed.smsAlerts);
    if (parsed.compactMode !== undefined) this.compactMode.set(parsed.compactMode);
    if (parsed.preferredPosition) this.preferredPosition.set(parsed.preferredPosition);
    if (parsed.notificationType) this.notificationType.set(parsed.notificationType);
  }

  private resetToDefaults() {
    this.language.set('fr');
    this.emailAlerts.set(true);
    this.smsAlerts.set(false);
    this.compactMode.set(false);
    this.preferredPosition.set('all');
    this.notificationType.set('immediate');
  }

  /**
   * Save settings locally and in the cloud
   */
  async save() {
    this.isSaving.set(true);
    const payload = {
      language: this.language(),
      emailAlerts: this.emailAlerts(),
      smsAlerts: this.smsAlerts(),
      compactMode: this.compactMode(),
      preferredPosition: this.preferredPosition(),
      notificationType: this.notificationType(),
      updatedAt: new Date().toISOString()
    };

    const user = this.authService.user();
    const storageKey = user ? `gofa_pref_${user.uid}` : 'gofa_pref_guest';

    try {
      // 1. Save locally
      localStorage.setItem(storageKey, JSON.stringify(payload));

      // 2. Save to Firestore if logged in
      if (user) {
        const docRef = doc(db, 'user_preferences', user.uid);
        await setDoc(docRef, payload, { merge: true });
      }
    } catch (e) {
      console.error('Error saving preferences:', e);
    } finally {
      this.isSaving.set(false);
    }
  }
}
