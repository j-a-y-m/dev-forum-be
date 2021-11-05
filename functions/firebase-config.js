const admin = require("firebase-admin");

const serviceAccount = require("./forum-3463f-firebase-adminsdk-gzy1u-29ae107b55.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin ;
