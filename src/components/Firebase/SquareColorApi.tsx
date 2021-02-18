import firebase from 'firebase';
import { db } from './Firebase';

import type { answerData, fromDataSettings } from '../Training';

import { defaultFromDataSettings } from '../Training';

export interface SquareColorMetaData {
  amount: number;
  correct: number;
  timestamp: number;
  avgTimeCorrect: number;
  avgTimeWrong: number;
}

export function SquareColorMetaRef(
  userId: string,
): firebase.database.Reference {
  return db.ref(`users/${userId}/SquareColors/log`);
}

export function SquareColorMetaOrdered(
  userId: string,
): firebase.database.Query {
  return SquareColorMetaRef(userId).orderByChild('timestamp');
}

export function putSquareColorMetaData(
  ref: firebase.database.Reference,
  props: SquareColorMetaData,
): string | null {
  return ref.push({
    ...props,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
  }).key;
}

export function transformSquareColorMetaData(
  snapshot: firebase.database.DataSnapshot,
): [SquareColorMetaData[], (string | null)[]] {
  const data: SquareColorMetaData[] = [];
  const keys: (string | null)[] = [];
  snapshot.forEach((children) => {
    data.push({
      amount: children.child('amount').val(),
      correct: children.child('correct').val(),
      timestamp: children.child('timestamp').val(),
      avgTimeCorrect: children.child('avgTimeCorrect').val(),
      avgTimeWrong: children.child('avgTimeWrong').val(),
    });
    keys.push(children.key);
  });

  return [data, keys];
}

export interface SquareColorData {
  timestamp: number;
  answers: answerData[];
}

export function SquareColorDataRef(userId: string) {
  return db.ref(`users/${userId}/SquareColors/logData`);
}

export function SquareColorDataOrdered(
  userId: string,
): firebase.database.Query {
  return SquareColorDataRef(userId).orderByChild('timestamp');
}

export function SquareColorDataRefFromKey(userId: string, key: string | null) {
  return db.ref(`users/${userId}/SquareColors/logData/${key}`);
}

export function putSquareColorData(
  dataRef: firebase.database.Reference,
  data: SquareColorData,
) {
  dataRef.set({
    ...data,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
  });
}

export function transformSquareColorData(
  snapshot: firebase.database.DataSnapshot,
): [SquareColorData[], (string | null)[]] {
  const data: SquareColorData[] = [];
  const keys: (string | null)[] = [];
  snapshot.forEach((children) => {
    data.push(transformSquareColorDataFromNode(children)[0]);
    keys.push(children.key);
  });

  return [data, keys];
}

export function transformSquareColorDataFromNode(
  snapshot: firebase.database.DataSnapshot,
): [SquareColorData, string | null] {
  const data = {
    timestamp: snapshot.child('timestamp').val(),
    answers: snapshot.child('answers').val(),
  };
  const { key } = snapshot;

  return [data, key];
}

export function SquareColorFromDataSettingsRef(userId: string) {
  return db.ref(`users/${userId}/SquareColors/settings/fromData`);
}

export function transformSquareColorFromDataSettings(
  snapshot: firebase.database.DataSnapshot,
): fromDataSettings {
  return { ...defaultFromDataSettings, ...snapshot.val() };
}
