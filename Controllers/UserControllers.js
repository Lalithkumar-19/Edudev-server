const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const GoogleUsers = require("../Models/GoogleUsers");
const { bucket } = require("../firebase");

const signupController = async (req, res) => {
    //sig up
    console.log("signup route is called");
    try {
        const { name, email, password, profession, Addresses } = req.body;
        console.log(req.body);
        const userpresence = await User.findOne({ email: email });
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
            if (profession !== "" && Addresses !== "") {
                var newUser = new User({ name: name, email: email, password: hashedPassword, profession: profession, Addresses: Addresses });
                newUser.save();
                res.status(201).json({ msg: "created successfully" });
            }
            else {
                await User.create({ name: name, email: email, password: hashedPassword, }).then((response) => {
                    console.log(response);
                    res.status(201).json({ msg: "created successfully" });

                })
            }
        }

    } catch (error) {
        res.status(500).json({ msg: "Internal server error occured" })

    }
}

const LoginController = async (req, res) => {
    console.log("Login route is called");
    try {
        const { email, password } = req.body || req.query;
        console.log(req.body);
        let userpresence = await User.findOne({ email: email });
        console.log(userpresence)
        if (userpresence) {
            let passok = await bcrypt.compareSync(password, userpresence.password);
            if (!passok) return res.status(400).send({ msg: "password is incorrect" });
            if (passok) {
                jwt.sign({ email, password, id: userpresence._id }, process.env.SECRET_KEY, (err, token) => {
                    if (err) throw err;
                    console.log(token);
                    res.status(200).json({ msg: "Logged in successfully ", data: userpresence.name, token: token, id: userpresence._id });
                })
            }

        }
        else {
            console.log("failed")
            res.status(400).json({ msg: "user is not signed up" })
        }
    } catch (error) {
        console.log("failed erroe")

        res.status(500).json({ msg: "Login failed due to errors may be internal server errors" });

    }
}

const AddtocartController = async (req, res) => {
    try {
        const user = await User.findById(req.user).populate({ path: "cart", populate: { path: "product_details" } });
        if (!user.cart.includes({ product_details: req.body.id })) {
            user.cart.push({ product_details: new mongoose.Types.ObjectId(req.body.id), quantity: req.body.quantity || 1 });
            user.save();
        } else {
            let index = user.cart.indexOf({ product_details: req.body.id });
            user.cart[index].quantity = req.body.quantity;
        }
        console.log(user.cart + "and" + req.body.id);
        console.log("data of cart", user.cart);
        res.status(200).json("successfully added to cart");

    } catch (error) {
        res.status(500).json({ msg: "internal server occured!!" });
        console.log(error);

    }
}

const Remove_from_cart = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        user.cart = user.cart.filter((item) => item._id != req.body.id);
        user.save();
        res.status(200).json("removed from cart");

    } catch (error) {
        res.status(500).json({ msg: "internal server occured!!" });
        console.log(error);
    }
}

const AddtowishlistController = async (req, res) => {
    try {
        const User_details = await User.findById(req.user);
        //checking whether the product is already in wishlist or not
        if (User_details.Wishlist.includes(req.body.id)) {
            return res.status(400).json('This Product Is Already In Your Wishlist');
        } else {
            User_details.Wishlist.push(req.body.id);
            User_details.save();
            return res.status(200).json("Added successfully");
        }
    } catch (error) {
        res.status(500).json({ msg: "internal server occured!!" });
        console.log(error);

    }
}

const Remove_from_wishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        user.Wishlist = user.Wishlist.filter((item) => item._id != req.body.id);
        user.save();
        res.status(200).json("removed from wishlist");

    } catch (error) {
        res.status(500).json({ msg: "internal server occured!!" });
        console.log(error);
    }
}


const Get_User_Details = async (req, res) => {
    try {

        const user = await User.findById(req.user).select("-password -cart -orders -Wishlist -Blogs")
        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal server occured!!" });

    }
}

const Update_User_controller = async (req, res) => {
    try {
        console.log(req.body.name);
        const { name, email, profession, Addresses } = req.body;
        const user = await User.findById(req.user || req.query.id);
        user.name = name;
        user.email = email;
        user.profession = profession;
        user.Addresses = Addresses;
        user.save();
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal server occured!!" });

    }
}
const Update_User_dp_controller = async (req, res) => {
    try {
       
        if (!req.downloadURl) {
            return res.status(400).send('No file uploaded');
        }
       
            const user = await User.findById(req.user || req.query.id);
            user.dp = req.downloadURl;
            user.save();
            res.status(200).json(user);
            console.log('File uploaded successfully');  

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal server occured!!" });
    }
}


const Get_user_cart_wishlist = async (req, res) => {
    try {
        const details = await User.findById(req.user).select("Wishlist cart orders learnings").populate({ path: "cart", populate: { path: "product_details", select: "title book_price In_stock book_pics" } }).populate({ path: "Wishlist" }).populate({ path: "learnings" }).populate({ path: "orders" });
        res.status(200).json(details);
    } catch (error) {
        console.log(error);
        res.status(500).json("internaal error occured")
    }
}




module.exports = {
    signupController,
    LoginController,
    AddtocartController,
    AddtowishlistController,
    Get_User_Details,
    Update_User_controller,
    Update_User_dp_controller,
    Get_user_cart_wishlist,
    Remove_from_cart,
    Remove_from_wishlist,
}