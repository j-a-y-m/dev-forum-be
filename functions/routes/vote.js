var express = require('express');
var router = express.Router();
const tokenDecode = require("../middleware/authMiddleware") ;
const admin = require("../firebase-config") ;

router.use(tokenDecode);
const firestore = admin.firestore() ;

router.post('/',async (req, res, next) => {

    console.log(req.body);

    const uid = req.user.user_id;
    const contentType = req.body.contentType ;
    const contentId = req.body.id ;
    console.log("contentId "+contentId);
    const vote = req.body.vote ;
    //const displayName = req.user.email.split("@")[0];

    if(!((contentType==="answers")||(contentType==="questions")))
    {
        return res.json({error : "wrong content type"})
    }
    let document = await firestore.collection(contentType)
        .doc(contentId)
        .get();
    let currVotes = document.get("votes");
    let upvotes = document.get("upvotes");
    let downvotes = document.get("downvotes")
    if (!upvotes)
    {
        upvotes = [];
    }
    if (!downvotes)
    {
        downvotes = [];
    }

    if (vote>0)
    {
        if(upvotes.includes(uid))
        {
            currVotes = currVotes-1 ;
            let index = upvotes.indexOf(uid);
            upvotes.splice(index, 1);

            //return res.send({error : "already upvoted!"})

        }else
        if(downvotes.includes(uid))
        {
            currVotes = currVotes+2 ;
            let index = downvotes.indexOf(uid);
            downvotes.splice(index, 1);
            upvotes.push(uid)
        }else
        {
            currVotes = currVotes+1 ;
            upvotes.push(uid)
        }

    }else {
        if(downvotes.includes(uid))
        {
            currVotes = currVotes+1;
            let index = downvotes.indexOf(uid);
            downvotes.splice(index, 1);
            //return res.send({error : "already downvoted!"})
        }else
        if(upvotes.includes(uid))
        {
            currVotes = currVotes-2 ;
            let index = upvotes.indexOf(uid);
            upvotes.splice(index, 1);
            downvotes.push(uid);
        }else {
            currVotes = currVotes-1;
            downvotes.push(uid);
        }

    }

    await firestore.collection(contentType)
        .doc(contentId)
        .update(
            {
                votes : currVotes ,
                upvotes : upvotes,
                downvotes : downvotes
            }
        );

    res.send('post ok');
}) ;

module.exports = router;
