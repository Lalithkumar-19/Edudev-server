const fs = require("fs");
const Course = require("../Models/Course");
const Mongoose = require("mongoose");
const Instructor = require("../Models/Instructor");
const Reviews = require("../Models/Reviews");
const User = require("../Models/User");


const Create_Course_Controller = async (req, res) => {

    try {
        console.log(req.user);
        const instructor = await Instructor.findById(req.user);
        const creator = new Mongoose.Types.ObjectId(req.user);
        const course = new Course(
            {
                ...req.body,
                course_thumbnail: req.downloadUrl,
                creator: creator,
            });
        course.save();
        instructor.all_courses.push(course._id);
        await instructor.save();
        console.log(course);
        res.status(200).json({
            success: true,
            data: course._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};


const AddCourse_content_Controller = async (req, res) => {
    try {
        const course = await Course.findById(req.query.id);
        const formattedCurriculumContent = req.downloadUrls.map((content) => ({
            video_title: content.video_title,
            video_link: content.video_link,
        }));

        // Push formatted curriculum content to course
        await course.curriculm.push({ title: req.body.title, curriculum_content: formattedCurriculumContent });

        // Save the updated course
        await course.save();
        console.log(course);

        res.status(200).json("successfull");
    } catch (err) {
        res.status(500).json({ msg: "failed to upload videos", error: err })
    }
};






const Add_course_Noticeboard = async (req, res) => {

    try {
        console.log(req.query.id, "id");
        console.log("content called");
        if (req.query.id !== null) {
            // const uploadedpath = req.file.path;
            // const format = req.file.originalname.split(".")[1];
            // const filename = req.file.originalname.split(".")[0];
            // const new_path = 'uploads/' + filename + Date.now() + "." + format;
            // fs.renameSync(uploadedpath, new_path, (err) => {
            //     if (err) throw err;
            //     console.log("uploaded successfully");
            // });

            const course_id = req.query.id;
            const { noticeboard, assignments } = req.body;
            const course = await Course.findById(course_id);
            course.noticeboard = noticeboard;
            course.assignments = assignments;
            const course_lectures = course.curriculm.length;
            course.course_lectures = course_lectures;
            course.course_intro_video = req.downloadUrl;
            course.saved = true;
            course.save();
            console.log(course);
            res.status(200).json("Updated noticeboard and assignments ");
        }
        else {
            res.status(401).json("course creation failed due to lost of Course in your locaal storage");
        }
    } catch (error) {
        res.status(500).json("Uploading noticebord and assignments failed");
    }
}


const Get_course_details = async (req, res) => {

    try {
        console.log("called successfully")
        const id = req.query.id;
        const details = await Course.findById(id);
        console.log(details);
        res.status(200).json(details);

    } catch (error) {
        res.status(500).json("failed to get details");

    }
}


const Course_update_details = async (req, res) => {
    try {
        const id = req.query.id;
        console.log("updation is called");
        await Course.findByIdAndUpdate(id, { ...req.body });
        res.status(200).json("Course updated successfully!!")

    } catch (error) {
        res.status(500).json("Uploading noticebord and assignments failed");

    }
}



const Get_all_courses = async (req, res) => {
    try {
        const allcourses = await Course.find({ saved: true }).populate("creator");
        res.status(200).json(allcourses);

    } catch (error) {
        res.status(500).json("internal server error ");

    }
}

const Get_single_course = async (req, res) => {
    console.log("course is called ")
    try {
        // const course = await Course.find({ _id: req.query.id, saved: true }).populate({path:"Reviews",populate:{path:"Reviews.reviwer_details",}});
        const course = await Course.find({ _id: req.query.id, saved: true }).populate({
            path: 'Reviews',
            populate: {
                path: 'reviwer_details',
                model: 'Users',
            },
        }).populate({
            path: 'creator',
            model: "Instructor"
        }).select("-password -phonenumber")
        console.log(course);
        res.status(200).json(course);

    }
    catch (err) {
        res.status(500).json("Uploading noticebord and assignments failed");

    }
}


const Add_course_review = async (req, res) => {
    try {
        console.log("review")
        console.log(req.body);
        const course = await Course.findById(req.query.id);
        const user = await User.findById(req.user);
        const Review = await Reviews.create({ reviwer_details: user._id, ...req.body });
        course.Reviews.push(Review._id);
        course.save();
        console.log(course);
        res.status(200).json(course);

    }
    catch (err) {
        console.log(err);
        res.status(500).json("Added Review successfully ...");

    }
}


const Get_Courses_by_ins_controller = async (req, res) => {
    try {
        const ins_id = req.user;
        const courses = await Course.find({ creator: ins_id });
        res.status(200).json(courses);
    } catch (error) {
        console.log(err);
        res.status(500).json("Added Review successfully ...");

    }
}
const Delete_Course_controller = async (req, res) => {
    try {
        const id = req.query.id;
        await Course.deleteOne({ _id: id, creator: req.user }).then(() => {
            res.status(200).json("deleted course successfully");
        }).catch(() => {
            res.status(401).json("you are not the owner of this course or it doesnot exist");
        })
    } catch (error) {
        console.log(error);
        res.status(500).json("Added Review successfully ...");

    }
}
module.exports = {
    Create_Course_Controller,
    AddCourse_content_Controller,
    Add_course_Noticeboard,
    Get_course_details,
    Course_update_details,
    Get_all_courses,
    Get_single_course,
    Add_course_review,
    Get_Courses_by_ins_controller,
    Delete_Course_controller
}