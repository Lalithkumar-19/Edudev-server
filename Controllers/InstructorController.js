const multer = require("multer");
const Instructor = require("../Models/Instructor");
const jwt = require("jsonwebtoken");
const { bucket } = require("../firebase");
const path = require("path");


const Instructor_login_controller = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("login calleddmvndkmnv");
        const Instructor_presence = await Instructor.findOne({ email, password });
        if (Instructor_presence) {
            jwt.sign({ email, password }, process.env.SECRET_KEY, (err, token) => {
                if (err) throw err;
                if (token) {
                    res.cookie('token', token, {
                        httpOnly: true,
                        sameSite: 'none',
                    });
                    res.status(200).json(token);
                    console.log(token);
                }

            })
        }
        else {
            res.status(400).json("Instructor not found in our database");
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error  instructor to logged in",
            error,
        });
    }
}




const AppyInstructor_Controller = async (req, res) => {
    try {
        console.log("body is", req.body);
        // Create a new instructor
        const instructor = new Instructor({ ...req.body, instructor_pic:req.downloadURl, Admin_permission: false })
        // Save the instructor to the database
        await instructor.save();
        console.log(instructor);

        // Send a success response
        res.status(200).json({
            success: true,
            message: "Instructor application submitted successfully",
        });
    } catch (error) {
        // Send an error response
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error submitting instructor application",
            error,
        });
    }
}

const get_instructor_applications_controller = async (req, res) => {
    try {
        console.log("called")
        const Applications = await Instructor.find({}).sort({ 'createdAt': 1 });
        res.status(200).json(Applications);


    } catch (error) {
        console.log(error);
        res.status(500).json("Internal server error");
    }
}




const get_single_instructor_applications_controller = async (req, res) => {

    try {
        const id = req.query.id;
        const data = await Instructor.findById(id);
        console.log(data);
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json("Internal server occured")
    }

}


const delete_single_instructor_application_controller = async (req, res) => {
    try {
        const id = req.query.id;
        await Instructor.findByIdAndDelete(id);
        console.log("deletion called")
        res.status(200).json("deleted successfully");
    } catch (error) {
        res.status(500).json("deleted successfully")

    }
}

const grant_single_instructor_application_controller = async (req, res) => {
    try {
        let id = req.query.id;
        const application = Instructor.findByIdAndUpdate(id, { Admin_Permission: true });
        console.log(application);
        res.status(200).json('admin permission granted');

    } catch (error) {
        res.status(500).json("granted successfully")

    }

};

const fetch_all_Permitted_instructors_controller = async (req, res) => {
    try {
        const all = await Instructor.find({ Admin_Permission: true });
        res.status(200).json(all);

    } catch (error) {
        res.status(500).json("internmal server error occured");
    }


}

const Update_instructor_controller = async (req, res) => {
    try {
        const instructorId = req.user;
        const { instructor_name, profession, about_instructor, address, email, phonenumber, website, social_media, years_of_experience, skills } = req.body;
        const instructor = await Instructor.findById(instructorId);
        instructor.instructor_name = instructor_name;
        instructor.profession = profession;
        instructor.about_instructor = about_instructor;
        instructor.address = address;
        instructor.email = email;
        instructor.phonenumber = phonenumber;
        instructor.website = website;
        instructor.skills = [...skills];
        instructor.social_media = social_media;
        instructor.years_of_experience = years_of_experience;
        instructor.save();
        res.status(200).json("updated successfully");
    } catch (error) {
        res.status(500).json("Internal server error occured ");
    }
};


const Update_instructor_dp_controller = async (req, res) => {
    try {
       
        const instructorId = req.user;
        const instructor = await Instructor.findById(instructorId);
       
        if (!req.downloadURl) {
            console.log("link",req.downloadURl);
            return res.status(400).send('No file uploaded');
        }
       
            instructor.instructor_pic = req.downloadURl;
            instructor.save();
            res.status(200).json(instructor);
            console.log('File uploaded successfully');  
    } catch (error) {
        console.log(error,"error infib");
        res.status(500).json("Internal sevrer error occured ");
    }
};

const fetch_instructor_profile_controller = async (req, res) => {
    try {
        const details = await Instructor.findById(req.user).select("-college_name -year_of_passing -board_of_university -college_address -total_Courses -total_students -all_courses -books -Admin_Permission");
        res.status(200).json(details);

    } catch (error) {
        res.status(500).json("Internal sevrer error occured ");

    }
}

const Fetch_one_instructor_controller=async(req,res)=>{
    try {
        const id=req.query.id;
        const instructor=await Instructor.findById(id).select("-password -all_courses -books");
        res.status(200).json(instructor);
    } catch (error) {
        res.status(500).json("Internal sevrer error occured ");   
    }
}

const Fetch_All_instructors_controller=async(req,res)=>{
    try {
        const limit=req.query.limit;
        const instructors=await Instructor.find({}).limit(limit?limit:null).select("instructor_name profession social_media");
        res.status(200).json(instructors);
    } catch (error) {
        res.status(500).json("Internal sevrer error occured ");   
    }
}

module.exports = {
    AppyInstructor_Controller, get_instructor_applications_controller, get_single_instructor_applications_controller, delete_single_instructor_application_controller,
    grant_single_instructor_application_controller,
    fetch_all_Permitted_instructors_controller,
    Update_instructor_controller,
    Update_instructor_dp_controller,
    Instructor_login_controller,
    fetch_instructor_profile_controller,
    Fetch_All_instructors_controller,
    Fetch_one_instructor_controller
}