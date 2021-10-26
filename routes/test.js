var express = require('express');
var router = express.Router();
const tokenDecode = require("../middleware/authMiddleware") ;
const admin = require("../firebase-config") ;

router.use(tokenDecode);

router.post('/',(req,res,next)=>{
    console.log("test "+req.get("Authorization")) ;
    console.log(req.body) ;
        console.log("middleware "+req.user.user_id );
    console.log("customclaim admin user "+req.user.customClaims );
    // admin
    //     .auth()
    //     .verifyIdToken(req.get("Authorization"))
    //     .then((claims) => {
    //         if (claims.admin === true) {
    //             console.log("admin ")
    //             // Allow access to requested admin resource.
    //         }
    //     });
    // admin
    //     .auth()
    //     .setCustomUserClaims(req.user.user_id, { admin: true })
    //     .then(() => {
    //         console.log("cus done")
    //         // The new custom claims will propagate to the user's ID token the
    //         // next time a new one is issued.
    //     });


    res.send('post ok');
    var idToken = req.body
}) ;


// router.get('/makemeadmin',(req,res)=>{
//     admin
//         .auth()
//         .setCustomUserClaims(req.user.user_id, { admin: true })
//         .then(() => {
//             res.send({done:"success "+req.user.email})
//             // The new custom claims will propagate to the user's ID token the
//             // next time a new one is issued.
//         });
//
// });

module.exports = router;
