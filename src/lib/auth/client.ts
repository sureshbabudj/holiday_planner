import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut as emailSignOut,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/lib/firebase/client";

export async function signInEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user.getIdToken();
}

export async function signUpEmail(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user.getIdToken();
}

export async function signInGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return cred.user.getIdToken();
}

export async function signOut() {
  await emailSignOut(auth);
}

export async function sendVerifyEmail() {
  const user = auth.currentUser;
  if (!user) throw new Error("no user");
  await sendEmailVerification(user);
}
