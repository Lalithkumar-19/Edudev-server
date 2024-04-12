const Admin = require("../Models/Admin");
const Books = require("../Models/Books");
const Instructor = require("../Models/Instructor");
const Orders = require("../Models/Orders");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const Login_admin_controller = async (req, res) => {
    console.log("Login route is called");
    try {
        const { email, password } = req.body || req.query;
        console.log(req.body);
        let Adminpresence = await Admin.findOne({ email: email });
        console.log(Adminpresence)
        if (Adminpresence) {
            let passok = await bcrypt.compareSync(password, Adminpresence.password);
            if (!passok) return res.status(400).send({ msg: "password is incorrect" });
            if (passok) {
                jwt.sign({ email, password, id: Adminpresence._id }, process.env.SECRET_KEY, (err, token) => {
                    if (err) throw err;
                    console.log(token);
                    res.status(200).json({ msg: "Logged in successfully ", data: Adminpresence.name, token: token, id: Adminpresence._id });
                })
            }

        }
        else {
            console.log("failed")
            res.status(400).json({ msg: "admin was not signed up" })
        }
    } catch (error) {
        console.log("failed erroe", error);

        res.status(500).json({ msg: "Login failed due to errors may be internal server errors" });

    }
}


const Get_all_Users_controller = async (req, res) => {
    try {
        const response = await User.find({}).select(" _id name email profession dp Addresses");
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal server error occured");

    }
}

const Get_single_User_controller = async (req, res) => {
    try {
        const id = req.query.id;
        const response = await User.findById(id).select("_id name email profession dp Addresses");
        if (response) {
            res.status(200).json(response);
            console.log("caalled");
        }
        else {
            res.status(402).json("no user found");
        }

    } catch (error) {
        console.log(error);
        res.status(500).json("Internal server error occured");

    }
}

const Update_single_User = async (req, res) => {
    try {
        const id = req.query.id;

    } catch (error) {
        console.log(error);
        res.status(500).json("Internal server error occured");

    }
}

const Delete_single_User = async (req, res) => {
    try {
        const id = req.query.id;
        await User.deleteOne({ _id: id }).then(() => {
            res.status(200).json("deleted successfully");
        }).catch(() => {
            res.status(500).json("deletion is failed");
        })


    } catch (error) {
        res.status(500).json("Internal server error occured");
    }
}



const delete_book_controller = async (req, res) => {
    try {
        await Books.findByIdAndDelete(req.query.id).then(() => {
            res.status(200).json("deleted_successfully")
        });

    } catch (error) {
        res.status(500).json("Internal server error occured");
    }
}
const Get_all_instructors = async (req, res) => {
    try {
        console.log("entered")
        const response = await Instructor.find({});
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json("Internal server error occured");
    }
}

const Get_all_new_joined_users_controller = async (req, res) => {
    try {
        console.log("entered")
        const response = await User.find({}).limit(5).sort({ Created_At: -1 });
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json("Internal server error occured");
    }
}

const Get_all_orders_Admin = async (req, res) => {
    try {
        const orders = await Orders.find({}).populate({ path: "userId", select: "dp" });
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json("Internal server error occured");
    }
}

const Change_order_status = async (req, res) => {
    try {
        const order = await Orders.findById(req.body.id);
        order.delivery_status = req.body.delivery_status;
        order.save();
        res.status(200).json("successfully changed")
    }
    catch (error) {
        res.status(500).json("Internal server error occured");
    }
}



const Get_Users_per_month = async (req, res) => {
    try {

        const currentYear = 2023;

        const users = await User.find({
            createdAt: {
                $gte: new Date(currentYear, 0, 1),
                $lt: new Date(currentYear + 1, 0, 1),
            },
        });

        // Initialize an empty object to store the results
        const registeredUsersPerMonth = {};

        for (let month = 1; month <= 12; month++) {
            const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(currentYear, month - 1, 1));

            registeredUsersPerMonth[monthName] = (registeredUsersPerMonth[monthName] || 0) + (users.find(user => user.createdAt.getMonth() === month - 1) ? 1 : 0);
        }

        const result = Object.entries(registeredUsersPerMonth).map(([monthName, registeredUsers]) => ({ monthName, registeredUsers }));
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json("failed")
    }
};

const Total_Revenue_fetch = async (req, res) => {
    try {
        const AllOrders = await Orders.find({});
        let sum = 0;
        AllOrders.forEach((item) => {
            sum = sum + item.subtotal;
        });
        res.status(200).json(sum);

    } catch (error) {
        res.status(500).json("internal server error")
    }
}

module.exports = {
    Get_all_Users_controller,
    Get_single_User_controller,
    Delete_single_User,
    Get_all_instructors,
    delete_book_controller,
    Get_all_new_joined_users_controller,
    Get_all_orders_Admin,
    Change_order_status,
    Get_Users_per_month,
    Total_Revenue_fetch,
    Login_admin_controller
}