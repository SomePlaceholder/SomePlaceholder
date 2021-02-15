import { UserProvider, useAuth } from './Context';
import {
  createUser,
  signInWithUsername,
  signOut,
  putSquareColorData,
} from './Functions';

export { auth, db } from './Firebase';

export {
  UserProvider,
  useAuth,
  createUser,
  signInWithUsername,
  signOut,
  putSquareColorData,
};
