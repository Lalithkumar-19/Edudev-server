const UserRoutes = require("express").Router();
const multer = require("multer");
const { signupController, LoginController, AddtocartController, AddtowishlistController, Get_User_Details, Update_User_controller, Update_User_dp_controller,Get_user_cart_wishlist, Remove_from_cart, Remove_from_wishlist } = require("../Controllers/UserControllers");
const { UserAuthmiddleware } = require("../Middlewares/Middleware");
const { uploadfileMIddleware } = require("../Middlewares/upload-cloud");
const upload=multer({storage:multer.memoryStorage()});

UserRoutes.post("/signup",signupController);
UserRoutes.post("/login",LoginController );
UserRoutes.put("/addtocart",UserAuthmiddleware, AddtocartController);
UserRoutes.put("/Remove_cart_item",UserAuthmiddleware, Remove_from_cart);
UserRoutes.put("/Remove_widhlist_item",UserAuthmiddleware, Remove_from_wishlist);
UserRoutes.put("/addtowishlist",UserAuthmiddleware,AddtowishlistController);
UserRoutes.get("/user_profile",UserAuthmiddleware,Get_User_Details);
UserRoutes.put("/update_profile",UserAuthmiddleware,Update_User_controller);
UserRoutes.put("/update_profile_pic",[UserAuthmiddleware,upload.single("dp"),uploadfileMIddleware],Update_User_dp_controller);
UserRoutes.get("/get_user_cart_wishlist",UserAuthmiddleware,Get_user_cart_wishlist);
module.exports=UserRoutes;
