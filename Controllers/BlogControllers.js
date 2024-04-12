const { default: mongoose } = require("mongoose");
const Blog = require("../Models/Blog");
const User = require("../Models/User");
const fs = require("fs");
const Comments = require("../Models/Comments");

const PostBlog_Controller = async (req, res) => {
    try {
        console.log("user from middleware ", req.user)
       
        if (!req.downloadURl) {
            return res.status(400).send('No file uploaded');
        }
        const {title,Blogcontent,tags,categories}=req.body;
        // const author_Details = await User.findById(req.user);
        const new_blog = await Blog({
            name: title,
            content: Blogcontent,
            Tags: tags,
            author: new mongoose.Types.ObjectId(req.user),
            categories: categories,
            backdrop: req.downloadURl,
        });
        new_blog.save();
        await User.findByIdAndUpdate(req.user, { $push: { Blogs: new mongoose.Types.ObjectId(new_blog._id) } });
        res.status(200).json("posted successfully");

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal server error occured while posting a blog into database" });
    }

};



const GetBlogs_Controller = async (req, res) => {

    try {
        const limits = req.query.limit;
        await Blog.find({}).populate('author').limit(limits).sort({posted_Date:-1}).then((rel) => {
            res.status(200).json(rel);
        }).catch(Err => console.log(Err))


    } catch (error) {
        res.status(500).json({ msg: "error occured" });
    }

}
const Get_one_Blog_Controller = async (req, res) => {

    try {
        const id = req.query.id;
        await Blog.findById(id).populate({ path: 'author', select: "-password -instructor -Blogs -cart -Wishlist -orders -Addresses" }).populate({ path: 'comments', populate: { path: "commenter_details", select: "-password -instructor -Blogs -cart -Wishlist -orders -Addreses" } }).sort({posted_Date:-1}).then((rel) => {
            res.status(200).json(rel);
        }).catch(Err => console.log(Err))
    } catch (error) {
        res.status(500).json({ msg: "error occured" });
    }

}


const Add_comment = async (req, res) => {
    try {
        const comment = await Comments({
            commented_content: req.body.commented_content,
            commenter_details: req.user,

        });
        comment.save();
        console.log(comment)
        const blog = await Blog.findById(req.query.blogId);
        console.log(blog);
        blog.comments.push(comment._id);
        blog.save();
        res.status(201).json("comment added")

    } catch (error) {
        console.log(error)
        res.status(500).json("failed to add comment");
    }
}


const Add_likes_to_comment = async (req, res) => {
    try {

        const id = req.query.id;
        const user_id = req.user;
        let cmt = await Comments.findOne({ _id: id });
        if (!cmt.liked_users.includes(user_id)) {
            cmt.likes = cmt.likes + 1;
            cmt.liked_users.push(user_id);
        } else {
            cmt.likes = cmt.likes - 1;
            cmt.liked_users = cmt.liked_users.filter((x) => x !== user_id);
        }
        cmt.save();
        res.status(201).json("liked successfully");


    } catch (error) {
        console.log(error)
        res.status(500).json("failed to add comment");
    }
}


const Load_all_comments = async (req, res) => {
    try {
        const id = req.query.blogId;
        const Blog_by_id = await Blog.findById(id).populate({path:"comments",populate:{path:"commenter_details"}}).sort({createdAt:-1});
        const comments = Blog_by_id.comments;
        res.status(200).json(comments);
    } catch (error) {
        console.log(error)
        res.status(500).json("failed to add load");
    }
}


const Delete_blog_Controller = async (req, res) => {
    try {
        await Blog.find();


    } catch (error) {
        console.log(error)

    }
}







module.exports = { PostBlog_Controller, GetBlogs_Controller, Delete_blog_Controller, Get_one_Blog_Controller, Add_comment, Add_likes_to_comment,Load_all_comments };