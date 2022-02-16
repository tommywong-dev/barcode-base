import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from ".";
import { BarcodeData } from "../interfaces/Barcode.interface";
import { DbUser } from "../interfaces/DbUser.interface";
import { getRandomAvatar } from "../utils/randomAvatar";

export const createUser = async (user: User) => {
  const { displayName, email, photoURL, uid } = user;
  const dbUser: DbUser = {
    displayName: displayName || "",
    email: email || "",
    photoURL: photoURL || getRandomAvatar(uid),
    uid,
  };

  try {
    await setDoc(doc(db, "users", user.uid), dbUser);
  } catch (e) {
    console.error("Error Create User:", e);
  }
};

export const getUsers = async () => {
  const userRef = collection(db, "users");
  const userSnap = await getDocs(userRef);

  const users: DbUser[] = [];
  userSnap.forEach((doc) => {
    users.push(doc.data() as DbUser);
  });
  return users;
};

export const createNewBarcode = async (barcodeData: BarcodeData) => {
  const barcodeRef = doc(db, "barcodes", barcodeData.barcode);
  const barcodeSnap = await getDoc(barcodeRef);

  // guard duplicate barcode
  if (barcodeSnap.exists()) {
    throw new Error("Duplicate Barcode");
  }
  await setDoc(barcodeRef, barcodeData);
};
