import firebase from 'firebase';
import { auth, db } from './Firebase';
import { SquareColorData } from '../Training';

// *** Auth API ***
export function createUser(
  username: string,
): Promise<firebase.auth.UserCredential> {
  return auth.createUserWithEmailAndPassword(
    `${username}@${username}.com`,
    `${username}@${username}.com`,
  );
}

export function signInWithUsername(
  username: string,
): Promise<firebase.auth.UserCredential> {
  return auth.signInWithEmailAndPassword(
    `${username}@${username}.com`,
    `${username}@${username}.com`,
  );
}

export function signOut(): Promise<void> {
  return auth.signOut();
}

// *** Database API ***
export function putSquareColorData(userId: string, props: SquareColorData) {
  db.ref(`users/${userId}/SquareColors/log`).push({
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    ...props,
  });
}
