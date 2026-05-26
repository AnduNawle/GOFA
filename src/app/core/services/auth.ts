import { Injectable, signal } from '@angular/core';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from '../firebase-init';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = signal<User | null>(null);
  
  user = this._user.asReadonly();
  
  constructor() {
    onAuthStateChanged(auth, async (user) => {
      this._user.set(user);
      if (user) {
        await this.syncUserToDatabase(user);
      }
    });
  }

  private async syncUserToDatabase(user: User) {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        displayName: user.displayName || 'Utilisateur',
        email: user.email || '',
        photoURL: user.photoURL || '',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Erreur de synchronisation utilisateur:', error);
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await this.syncUserToDatabase(result.user);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
