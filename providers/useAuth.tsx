import React, { ReactNode, useContext } from "react";
import { createContext, useEffect, useState } from "react";
import {
  AuthStateChange,
  FirebaseAuthentication,
} from "@robingenz/capacitor-firebase-authentication";

interface Props {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthStateChange["user"]);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthStateChange["user"]>(
    {} as AuthStateChange["user"]
  );

  useEffect(() => {
    (async () => {
      const result = await FirebaseAuthentication.getCurrentUser();
      setUser(result.user);
    })();

    FirebaseAuthentication.removeAllListeners().then(() => {
      FirebaseAuthentication.addListener("authStateChange", (change) => {
        setUser(change.user);
      });
    });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth: () => AuthStateChange["user"] = () =>
  useContext(AuthContext);
