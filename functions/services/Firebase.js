const admin = require('firebase-admin');

const serviceAccount = require("../config/firebase-permissions.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://purplehw-ed218.firebaseio.com",
});

exports.db = admin.firestore();
