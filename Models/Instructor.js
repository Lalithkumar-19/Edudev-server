const { Schema, model, default: mongoose } = require("mongoose");

const InstructorSchema = new Schema({
    Admin_Permission: { type: Boolean, deafult: false, required: false },
    instructor_name: {
        type: String,
        required: true,
    },
    profession:{type:String,default:"Edudev Instructor"},
    about_instructor: {
        type: String
    },
    instructor_pic: {
        type: String,
        required: false,
        default:""
    },
    gender: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: String,
        required: true,
    },
    website: {
        type: String,
    },
    social_media: {
        facebook: { type: String },
        twitter: { type: String },
        Linkedin: { type: String },
    },
    college_name: { type: String, required: true },
    year_of_passing: { type: String, required: true },
    board_of_university: { type: String, required: true },
    college_address: { type: String, required: false },
    skills: [{ skillname: { type: String, required: false }, percent: { type: Number, required: true } }],
    total_Courses: { type: Number, default: 1 },
    years_of_experience: { type: Number, deafult: 2, required: true },
    total_students: { type: Number, default: 2 },
    all_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Courses" }],
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],

});



module.exports = model("Instructor", InstructorSchema);