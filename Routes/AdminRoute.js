const multer = require("multer");
const { Get_all_Users_controller, Get_single_User_controller, Delete_single_User, delete_book_controller, Get_all_instructors, Get_all_new_joined_users_controller, Get_all_orders_Admin, Change_order_status, Get_Users_per_month, Total_Revenue_fetch, Login_admin_controller } = require("../Controllers/AdminControllers");
const { Update_User_controller, Update_User_dp_controller, signupController } = require("../Controllers/UserControllers");
const { AdminAuthmiddleware } = require("../Middlewares/Middleware");
const { uploadfileMIddleware } = require("../Middlewares/upload-cloud");
const Admin = require("../Models/Admin");
const bcrypt = require("bcrypt");
const upload=multer({storage:multer.memoryStorage()});



const AdminRoute = require("express").Router();

AdminRoute.post("/create-admin", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);
        const userpresence = await Admin.findOne({ email: email });
        if (userpresence) {
            res.status(403).send({
                message: "User email was already used"
            })
        }
        else {
            let hashedPassword = await bcrypt.hashSync(password, 10, (err, hash) => {
                console.log(err);
                if (err) throw err;
                return hash;
            })
            await Admin.create({ name: name, email: email, password: hashedPassword, }).then((response) => {
                console.log(response);
                res.status(201).json({ msg: "created successfully" });

            })
        }

    } catch (error) {
        res.status(500).json({ msg: "Internal server error occured" })

    }

})




AdminRoute.post("/admin_login",Login_admin_controller);
AdminRoute.get("/get_all_users",AdminAuthmiddleware, Get_all_Users_controller);
AdminRoute.get("/get_single_user",AdminAuthmiddleware, Get_single_User_controller);
AdminRoute.put("/update_single_user",AdminAuthmiddleware, Update_User_controller);
// AdminRoute.put("/update_single_user_dp",upload.single("dp"),Update_User_dp_controller);
AdminRoute.put("/update_single_user_dp", upload.single("dp"),uploadfileMIddleware,Update_User_dp_controller);

AdminRoute.put("/delete_single_user",AdminAuthmiddleware, Delete_single_User);
AdminRoute.get("/Fetch_all_instructors",AdminAuthmiddleware, Get_all_instructors);
AdminRoute.post("/create_new_user",AdminAuthmiddleware, signupController);
AdminRoute.put("/delete_book", AdminAuthmiddleware,delete_book_controller);
AdminRoute.get("/get_all_new_joined_users", AdminAuthmiddleware,Get_all_new_joined_users_controller);
AdminRoute.get("/Get_all_orders_Admin", Get_all_orders_Admin);
AdminRoute.put("/Change_order_status",AdminAuthmiddleware, Change_order_status);
AdminRoute.get("/Get_Users_per_month",AdminAuthmiddleware, Get_Users_per_month);
AdminRoute.get("/Get_Total_revenue", Total_Revenue_fetch);
// AdminRoute.get("/delete_single_instructor",get_all_instructors_controller);


module.exports = AdminRoute;