import { UserProvider, useAuth } from './Context';
import {
  createUser,
  signInWithUsername,
  signInAnonymous,
  signOut,
} from './Functions';

export { auth } from './Firebase';

export {
  UserProvider,
  useAuth,
  createUser,
  signInWithUsername,
  signInAnonymous,
  signOut,
};
