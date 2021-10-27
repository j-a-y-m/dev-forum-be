var express = require('express');
var router = express.Router();
const tokenDecode = require("../middleware/authMiddleware") ;
const admin = require("../firebase-config") ;

router.use(tokenDecode);
const firestore = admin.firestore() ;

router.post('/',async (req, res, next) => {
    console.log("Frfrfr");
    console.log(req.body);
    res.send('post ok');
    const uid = req.user.user_id;
    const displayName = req.user.email.split("@")[0];
    admin.auth()
        .updateUser(uid, {
            displayName: displayName,
            photoURL: 'https://i.ibb.co/C6hSmMg/user.png',
        })
        .then((userRecord) => {
            console.log(displayName);
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully updated user', userRecord.toJSON());
        })
        .catch((error) => {
            console.log('Error updating u:', error);
        });

    await firestore.collection("users")
        .doc(uid)
        .set(
            {
                displayName : displayName,
                votes : 0 ,
                createdAt : admin.firestore.Timestamp.now()
            }
        );


}) ;

module.exports = router;
