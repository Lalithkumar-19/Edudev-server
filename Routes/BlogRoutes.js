
const { UserAuthmiddleware } = require("../Middlewares/Middleware");
const { PostBlog_Controller, GetBlogs_Controller, Delete_blog_Controller, Get_one_Blog_Controller, Add_comment, Add_likes_to_comment, Load_all_comments } = require("../Controllers/BlogControllers");
const multer = require("multer");
const { uploadfileMIddleware } = require("../Middlewares/upload-cloud");
const upload = multer({ storage:multer.memoryStorage()});

const BlogRoute = require("express").Router();

BlogRoute.post("/postblog",[UserAuthmiddleware, upload.single("backdrop_img"),uploadfileMIddleware], PostBlog_Controller);


BlogRoute.get("/blogs", GetBlogs_Controller);
BlogRoute.get("/fetchOneblog", Get_one_Blog_Controller);
BlogRoute.post("/writeComment", UserAuthmiddleware, Add_comment);
BlogRoute.patch("/add_like_to_comment", UserAuthmiddleware, Add_likes_to_comment);
BlogRoute.get("/load_comments", Load_all_comments);


BlogRoute.get("/delpost", Delete_blog_Controller);




module.exports = BlogRoute;