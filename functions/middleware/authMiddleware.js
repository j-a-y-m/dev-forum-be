const admin = require("../firebase-config") ;
const firebaseUtils = require("../util/firebase") ;
//
// class AuthMiddleware{
//
//
//
// }

const tokenDecode = async (req,res,next)=> {

    const idToken = req.get("Authorization") ;
    if (idToken)
    {

        try{
            const user = await admin.auth().verifyIdToken(idToken) ;
            console.log("middleware "+JSON.stringify(user))
            if(user.isBanned)
            {
                return res.status(400).send({
                    error: 'user banned'
                });
            }
            req.user = user ;
            return next();
        }catch (e) {
            if(e.code)
            {
                return res.status(400).json({error : firebaseUtils.sliceFbErrCode(e.code),e});
            }
            return res.json({e});
        }


    }else
    {
        return res.status(401).json({error : "please login"});
    }

}

module.exports = tokenDecode
