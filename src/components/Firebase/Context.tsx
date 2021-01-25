import React, { ReactElement, useContext, useState, useEffect } from 'react';
import type firebase from 'firebase';
import { auth } from './Firebase';

interface UserProviderState {
  currentUser: firebase.User | null;
}

const AuthContext = React.createContext<UserProviderState>({
  currentUser: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

interface UserProviderProps {
  children: ReactElement;
}

export function UserProvider(props: UserProviderProps) {
  const { children } = props;
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
