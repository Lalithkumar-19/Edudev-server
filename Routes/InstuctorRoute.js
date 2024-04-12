const { AppyInstructor_Controller, get_instructor_applications_controller, get_single_instructor_applications_controller, delete_single_instructor_application_controller, grant_single_instructor_application_controller, fetch_all_Permitted_instructors_controller, Update_instructor_controller, Update_instructor_dp_controller, Instructor_login_controller, fetch_instructor_profile_controller, Fetch_All_instructors_controller, Fetch_one_instructor_controller } = require("../Controllers/InstructorController");
const multer = require("multer");
const { InstructorAuthmiddleware } = require("../Middlewares/Middleware");
const { uploadfileMIddleware } = require("../Middlewares/upload-cloud");
const imageUplpoadMiddleware=multer({storage:multer.memoryStorage()});
const InstuctorRoute=require("express").Router();

InstuctorRoute.post("/login-instructor",Instructor_login_controller);
InstuctorRoute.post("/apply-instructor",[imageUplpoadMiddleware.single("instructor_pic"),uploadfileMIddleware],AppyInstructor_Controller);
InstuctorRoute.get("/get_instructor_applications",get_instructor_applications_controller);
InstuctorRoute.get("/get_single_instructor_application",get_single_instructor_applications_controller);
InstuctorRoute.get("/delete_single_instructor_application",delete_single_instructor_application_controller);
InstuctorRoute.get("/grant_single_instructor_application",grant_single_instructor_application_controller);
InstuctorRoute.get("/fetch_all_permitted_instructor_application",fetch_all_Permitted_instructors_controller);
InstuctorRoute.put("/Update_instructor_profile",InstructorAuthmiddleware,Update_instructor_controller);
InstuctorRoute.put("/Update_instructor_profile_pic",[InstructorAuthmiddleware,imageUplpoadMiddleware.single("dp"),uploadfileMIddleware],Update_instructor_dp_controller);
InstuctorRoute.get("/fetch_instructor_profile",InstructorAuthmiddleware,fetch_instructor_profile_controller);
InstuctorRoute.get("/fetch_all_ins",Fetch_All_instructors_controller);
InstuctorRoute.get("/fetch_one_ins",Fetch_one_instructor_controller);


module.exports=InstuctorRoute;