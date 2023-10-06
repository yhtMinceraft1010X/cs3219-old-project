import admin from 'firebase-admin';
import {Auth, getAuth} from 'firebase-admin/auth';
import path from "path";
import process from "process";
import dotenv from "dotenv";
import {App} from "firebase-admin/lib/app";

const serviceAccount : object = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);

const firebaseApp : App = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firebaseAuth : Auth = getAuth(firebaseApp);

export function promiseVerifyIsLoggedIn(idToken : string) {
  return firebaseAuth.verifyIdToken(idToken, true)
    .then(() => {
      return true;
    }).catch(() => {
      return false;
    });
}

export function promiseVerifyIsCorrectUser(idToken : string, paramUid : string) {
  return firebaseAuth.verifyIdToken(idToken, true)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      return uid === paramUid;
    }).catch(() => {
      return false;
    });
}

export function promiseVerifyIsAdmin(idToken : string) {
  return firebaseAuth.verifyIdToken(idToken, true)
    .then((claims) => {
      return !!claims.admin;
    })
    .catch((error) => {
      // Handle error
      console.log(error);
      return false;
    });
}