import { FirebaseAuthentication } from "@robingenz/capacitor-firebase-authentication";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from ".";
import { createUser } from "./firestore";

const provider = new GoogleAuthProvider();

export const signInGoogle = async () => {
  try {
    const result = await FirebaseAuthentication.signInWithGoogle();
    await createUser(result.user);
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const signOutGoogle = async () => {
  await signOut(auth);
};

export const newSignOut = async () => {
  console.log("oui");
  await FirebaseAuthentication.signOut();
};
