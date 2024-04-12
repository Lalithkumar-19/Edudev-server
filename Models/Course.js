const { model, Schema, default: mongoose } = require("mongoose");
const CourseSchema = new Schema({
    course_name: { type: String, required: true },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor"
    },
    course_actual_price: { type: Number, required: true },
    course_price: { type: Number, required: true },
    course_intro_video: { type: String, required: false },
    course_duration: { length: { type: Number, required: true }, field: { type: String, required: "true", default: "Weeks" } },
    course_lectures: { type: Number, default: 0 },
    course_language: { type: String, required: true, default: "English" },
    skill_level: { type: String, required: false, default: "Beginner", },
    certificate: { type: Boolean, required: true },
    Deadline: { type: Date, required: true },
    category: {
        type: String,
        required: true,
    },
    Reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews"
    }],
    course_description: {
        type: String,
        required: true,
    },
    learning_objs: [{
        type: String,
        required: true,
    }],
    requirements: [{
        type: String,
        // required: true,
    }],
    curriculm: [
        {
            title: { type: String, required: false },
            curriculum_content: [
                {
                    video_title: { type: String, required: true },
                    video_link: { type: String, required: true }
                },
            ],
        }
    ],
    Tags: [{ type: String, required: true, }],
    noticeboard: { type: String, required: false, },
    assignments: { type: String, required: false, },
    course_thumbnail: { type: String, required: false },
    saved: { type: Boolean, default: false }


}, { timestamps: true })


module.exports = model("Courses", CourseSchema);


