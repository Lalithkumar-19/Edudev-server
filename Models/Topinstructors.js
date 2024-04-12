const { Schema, model } = require("mongoose");

const TopinstructorsSchema = new Schema({
    name: { type: String },
})

module.exports=model('TopInstructors',TopinstructorsSchema);