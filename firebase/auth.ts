import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from ".";
import { createUser } from "./firestore";

const provider = new GoogleAuthProvider();

export const signInGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, provider);
    await createUser(res.user);
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const signOutGoogle = async () => {
  await signOut(auth);
};
