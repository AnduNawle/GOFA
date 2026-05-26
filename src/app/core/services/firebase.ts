import { Injectable } from '@angular/core';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  onSnapshot,
  FirestoreError,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { auth, db } from '../firebase-init';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      },
      operationType,
      path
    }
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }

  async getCollection<T = DocumentData>(path: string, constraints: QueryConstraint[] = []) {
    try {
      const q = query(collection(db, path), ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }));
    } catch (error) {
      this.handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }

  async getDocument<T = DocumentData>(path: string, id: string) {
    try {
      const docRef = doc(db, path, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as T & { id: string };
      }
      return null;
    } catch (error) {
      this.handleFirestoreError(error, OperationType.GET, `${path}/${id}`);
      return null;
    }
  }

  async createDocument(path: string, data: unknown) {
    try {
      const docRef = await addDoc(collection(db, path), data);
      return docRef.id;
    } catch (error) {
      this.handleFirestoreError(error, OperationType.CREATE, path);
      return null;
    }
  }

  async deleteDocument(path: string, id: string) {
    try {
      await deleteDoc(doc(db, path, id));
    } catch (error) {
      this.handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
      throw error; // Re-throw to handle it in UI
    }
  }

  // Real-time listener helper
  watchCollection<T = DocumentData>(path: string, callback: (data: (T & { id: string })[]) => void, constraints: QueryConstraint[] = []) {
    const q = query(collection(db, path), ...constraints);
    return onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }));
        callback(data);
      },
      (error: FirestoreError) => {
        this.handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  }
}
