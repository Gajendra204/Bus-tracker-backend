import admin from 'firebase-admin';

const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://schoolbustracker-22fdb-default-rtdb.firebaseio.com"
});

export const db = admin.database();
export default admin;