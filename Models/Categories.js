const {Schema,model} =require("mongoose");



const CategoriesSchema=new Schema({
    name:{type:String},
});


module.exports=model("Categories",CategoriesSchema);
