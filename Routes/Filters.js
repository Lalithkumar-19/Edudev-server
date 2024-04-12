const { Get_all_Categories, Add_categories, Add_Top_instructors, Get_all_top_instructors } = require("../Controllers/Search_filter_Controller");

const CategoriesRouter=require("express").Router();


CategoriesRouter.post("/Add_new_categories",Add_categories);
CategoriesRouter.get("/Get_all_categories",Get_all_Categories);
CategoriesRouter.post("/Add_new_top_instructor",Add_Top_instructors);
CategoriesRouter.get("/Get_all_top_instructor",Get_all_top_instructors);




module.exports=CategoriesRouter;