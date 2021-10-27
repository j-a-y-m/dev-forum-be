var express = require('express');
var router = express.Router();
const tokenDecode = require("../middleware/authMiddleware") ;
const admin = require("../firebase-config") ;

router.use(tokenDecode);
const firestore = admin.firestore() ;

router.post('/',async (req, res, next) => {

    console.log(req.body);

    const uid = req.user.user_id;
    const questionId = req.body.questionId ;
    const questionUid = (await firestore.collection("questions")
        .doc(questionId).get()).get("createdBy");
    const questionTitle = (await firestore.collection("questions")
        .doc(questionId).get()).get("title");

    //const displayName = req.user.email.split("@")[0];


    await firestore.collection("answers")
        .doc()
        .set(
            {
                questionId : questionId,
                content : req.body.content ,
                postedBy : uid,
                votes : 0 ,
                upvotes : [],
                downvotes : [],
                createdAt : admin.firestore.Timestamp.now(),

            }
        );

    await firestore.collection("users")
        .doc(questionUid)
        .collection("inbox")
        .add({
            type: "reply",
            message: "new reply to your question :"+limitContent(questionTitle),
            time: admin.firestore.Timestamp.now()
        })
    ;
    return res.json({status:'post ok'});
}) ;


function limitContent(content){
    if(content.length > 100)
    {
        return content.substring(0,100).concat(" ...");
    }else return content ;
}

module.exports = router;
