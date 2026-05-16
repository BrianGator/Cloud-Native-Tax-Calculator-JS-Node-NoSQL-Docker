/**
 * Tax Service for Firestore Operations
 * Written by Brian McCarthy
 */
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import initialBrackets from '../config/taxBrackets.json' with { type: 'json' };

const COLLECTION_NAME = 'taxBrackets';

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Fetch tax brackets from Firestore
 */
export async function getTaxBrackets() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    // If no brackets found, return null to trigger seeding
    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

/**
 * Seed Firestore with initial tax brackets if it's empty
 */
export async function seedBrackets() {
  try {
    const brackets = initialBrackets.brackets;
    const promises = brackets.map((bracket, index) => {
      return addDoc(collection(db, COLLECTION_NAME), {
        ...bracket,
        order: index,
        createdAt: serverTimestamp()
      });
    });
    await Promise.all(promises);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
  }
}
