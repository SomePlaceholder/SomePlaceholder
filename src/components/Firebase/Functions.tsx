import firebase from 'firebase';
import { auth } from './Firebase';

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

export function signInAnonymous(): Promise<firebase.auth.UserCredential> {
  return auth.signInAnonymously();
}

export function signOut(): Promise<void> {
  return auth.signOut();
}
