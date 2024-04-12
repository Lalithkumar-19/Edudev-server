const multer = require("multer");
const Courserouter = require("express").Router();
const upload = multer({ storage:multer.memoryStorage()});
const { Create_Course_Controller, AddCourse_content_Controller, Add_course_Noticeboard, Get_course_details, Course_course_details, Course_update_details, Get_all_courses, Get_single_course, Add_course_review, Get_Courses_by_ins_controller, Delete_Course_controller } = require("../Controllers/CourseController");
const { InstructorAuthmiddleware, UserAuthmiddleware } = require("../Middlewares/Middleware");
const {uploadMultiple_Vids_MiddlewareForcourse, uploadfileMIddleware } = require("../Middlewares/upload-cloud");


Courserouter.post("/create-course", InstructorAuthmiddleware, Create_Course_Controller);
Courserouter.post("/upload-course-thumbnail", InstructorAuthmiddleware,upload.single("file"),uploadfileMIddleware,Create_Course_Controller);
Courserouter.post("/coursecontent", InstructorAuthmiddleware,upload.array("file"),uploadMultiple_Vids_MiddlewareForcourse, AddCourse_content_Controller);
Courserouter.post("/Add-noticeboard",[upload.single("file"),uploadfileMIddleware],Add_course_Noticeboard);
Courserouter.get("/get_course_details", Get_course_details);
Courserouter.post("/update-course", Course_update_details);
Courserouter.get("/get_all_courses", Get_all_courses);
Courserouter.get("/get_single_course", Get_single_course);
Courserouter.post("/add_course_review",UserAuthmiddleware,Add_course_review);
//admin route to access instructor courses created by him/her
Courserouter.get('/get_all_courses_by_ins',InstructorAuthmiddleware ,Get_Courses_by_ins_controller);
Courserouter.put('/delete_course',InstructorAuthmiddleware ,Delete_Course_controller);

module.exports = Courserouter;
