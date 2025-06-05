const admin = require('firebase-admin');
// const serviceAccount = require('./secrets/astrotravel-auth-firebase-adminsdk-fbsvc-a4afaa77e2.json');

//admin.initializeApp({
//    credential: admin.credential.cert(serviceAccount),
//});

console.log("test process.env.GOOGLE_CREDENTIALS");

const raw = JSON.parse(process.env.GOOGLE_CREDENTIALS);
raw.private_key = raw.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
    credential: admin.credential.cert(raw),
});
//test
module.exports = admin;