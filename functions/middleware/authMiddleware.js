const admin = require("../firebase-config") ;

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
            console.log("middleware "+user)
            if(user.isBanned)
            {
                return res.status(400).send({
                    error: 'user banned'
                });
            }
            req.user = user ;
            return next();
        }catch (e) {
            return res.json({error : e});
        }


    }else
    {
        return res.json({error : "not authenticated"});
    }

}

module.exports = tokenDecode
