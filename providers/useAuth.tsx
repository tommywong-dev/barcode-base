import { User } from "firebase/auth";
import React, { ReactNode, useContext } from "react";
import { createContext, useEffect, useState } from "react";
import nookies from "nookies";
import { auth } from "../firebase";

const AuthContext = createContext({} as User);

interface Props {
  children: ReactNode;
}
export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      console.log("uesr", user);
      if (!user) {
        setUser({} as User);
        nookies.set(undefined, "token", "", {});
        return;
      }
      const token = await user.getIdToken();
      setUser(user);
      nookies.set(undefined, "token", token, {});
    });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth: () => User = () => useContext(AuthContext);
