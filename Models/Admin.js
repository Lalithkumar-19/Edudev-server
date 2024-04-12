const { model, Schema, default: mongoose } = require("mongoose");
const AdminSchema=new Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String},
    profile_pic:{type:String},
});


module.exports=model("admin",AdminSchema);
