import { Injectable, signal } from '@angular/core';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../firebase-init';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = signal<User | null>(null);
  
  user = this._user.asReadonly();
  
  constructor() {
    onAuthStateChanged(auth, (user) => {
      this._user.set(user);
    });
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
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
