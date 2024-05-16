const express = require("express");
const { getPosts, setPosts, editPost, deletePost, likePost, dislikePost } = require("../controller/controller");
const router = express.Router(); 

router.get("/",getPosts);

router.post("/",setPosts);

router.put("/:id",editPost );

router.delete("/:id",deletePost );


//La route pour créer les likes des poste
router.patch("/like-post/:id",likePost);
//La route pour créer les likes des poste
router.patch("/dislike-post/:id", dislikePost);


module.exports = router;
