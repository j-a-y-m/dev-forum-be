var express = require('express');
var router = express.Router();
const tokenDecode = require("../middleware/authMiddleware") ;
const admin = require("../firebase-config") ;

router.use(tokenDecode);
const firestore = admin.firestore() ;

router.post('/',async (req, res, next) => {

    console.log(req.body);
    try{
    const uid = req.user.user_id;
    const displayName = req.user.email.split("@")[0];
    console.log(req.body.content);
    let tags = [];
    if(req.body.tags)
    {
        let reqtags = req.body.tags.split(",");
        for (tag of reqtags)
        {
            tags.push(tag);
        }
    }



    await firestore.collection("questions")
        .doc()
        .set(
            {
                title : req.body.title,
                content : req.body.content ,
                tags : tags,
                createdBy : uid,
                votes : 0 ,
                upvotes : [],
                downvotes : [],
                createdAt : admin.firestore.Timestamp.now(),

            }
        );

    return res.json({message:"Question submitted"});
    }
    catch(err)
    {
        console.log("err-submit question",err);
        return res.sendStatus(500).json({error:"Error occured"});
    }


}) ;

module.exports = router;
