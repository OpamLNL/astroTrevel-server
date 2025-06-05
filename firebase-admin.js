const admin = require('firebase-admin');
// const serviceAccount = require('./secrets/astrotravel-auth-firebase-adminsdk-fbsvc-a4afaa77e2.json');

//admin.initializeApp({
//    credential: admin.credential.cert(serviceAccount),
//});

console.log("test process.env.GOOGLE_CREDENTIALS");

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.GOOGLE_CREDENTIALS)),
});
//test
module.exports = admin;