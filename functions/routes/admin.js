var express = require('express');
var router = express.Router();
const tokenDecode = require("../middleware/authMiddleware") ;
const admin = require("../firebase-config") ;

router.use(tokenDecode);
const firestore = admin.firestore() ;

router.post('/delete',async (req, res, next) => {
    if (!( (await admin
        .auth()
        .verifyIdToken(req.get("Authorization"))).admin === true))
    {
                return res.status(403).send({
                    message: 'not an admin'
                });
            }



    console.log(req.body);

    let uid = req.user.user_id;
    const contentType = req.body.contentType;
    const contentId = req.body.contentId;
    const reason = req.body.reason;
    console.log("contentId " + contentId);
    const vote = req.body.vote;
    let inboxMsg = "";
    //const displayName = req.user.email.split("@")[0];

    if (!((contentType === "answers") || (contentType === "questions"))) {
        return res.status(400).json({error: "wrong content type"})
    }


    if (contentType==="answers")
    {
        uid = (await firestore.collection(contentType)
            .doc(contentId).get()).get("postedBy");
        const answer = (await firestore.collection("answers")
            .doc(contentId).get()).get("content");
        inboxMsg = "your answer "+ limitContent(answer)+ " was deleted. reason : "+reason;
    }else
    {
        uid = (await firestore.collection(contentType)
            .doc(contentId).get()).get("createdBy");
        const questionTitle = (await firestore.collection("questions")
            .doc(contentId).get()).get("title");
        inboxMsg = "your question "+ limitContent(questionTitle)+ " was deleted. reason : "+reason;
    }



    await firestore.collection(contentType)
        .doc(contentId)
        .delete();

    await firestore.collection("users")
        .doc(uid)
        .collection("inbox")
        .add({
            type: "deletion",
            message: inboxMsg,
            time: admin.firestore.Timestamp.now()
        })
    ;

    // let currVotes = document.get("votes");
    // let upvotes = document.get("upvotes");
    // let downvotes = document.get("downvotes")
    // if (!upvotes) {
    //     upvotes = [];
    // }
    // if (!downvotes) {
    //     downvotes = [];
    // }

    return res.json({message:'deleted'});
}) ;


router.post('/ban',async (req, res, next) => {
    if (!( (await admin
        .auth()
        .verifyIdToken(req.get("Authorization"))).admin === true))
    {
        return res.status(403).json({
            error: 'not an admin'
        });
    }
    const uid = req.body.uid;
    const reason = req.body.reason ;
    admin
        .auth()
        .setCustomUserClaims(uid, { isBanned: true })
        .then(() => {
            console.log("user banned")
            // The new custom claims will propagate to the user's ID token the
            // next time a new one is issued.
        });
    await firestore.collection("users")
        .doc(uid)
        .collection("inbox")
        .add({
            type: "ban",
            message: "your are now banned from participating on this forum. reason : "+reason,
            time: admin.firestore.Timestamp.now()
        })
    ;
    return res.json({message:'user banned'});
}) ;

function limitContent(content){
    if(content.length > 50)
    {
        return content.substring(0,50).concat(" ...");
    }else return content ;
}

module.exports = router;
