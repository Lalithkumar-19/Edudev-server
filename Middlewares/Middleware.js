const jwt = require("jsonwebtoken");
const Instructor = require("../Models/Instructor");
const Admin = require("../Models/Admin");


const UserAuthmiddleware = async (req, res, next) => {

    try {
        const token =req.query.token;
        console.log("token",token);
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        else {
            jwt.verify(token, process.env.SECRET_KEY, (err, details) => {
                if (err) console.log(err);
                req.user = details.id;
                console.log("details are ", details)
            });
        }
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();

};



const InstructorAuthmiddleware = async (req, res, next) => {

    try {
        const token = req.body.token || req.cookies.token || req.query.token;
        if (!token) {
            console.log("no token ",token);
            return res.status(403).send("A token is required for authentication");
        }
        else {
            jwt.verify(token, process.env.SECRET_KEY, async (err, details) => {
                if (err) {
                    console.error(err);
                    return res.status(403).json("Authentication failed");
                }
                console.log("details", details)
                const instructor = await Instructor.findOne({ email: details.email });
                if (instructor) {
                    req.user = instructor._id;
                    return next();

                }
                else {
                    res.status(401).json("unauthorized access of modifying");
                }
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(401).send("Invalid Token");
    }

};


const AdminAuthmiddleware = async (req, res, next) => {

    try {
        const token = req.body.token || req.cookies.token || req.query.token;
        if (!token) {
            console.log("no token ")
            return res.status(403).send("A token is required for authentication");
        }
        else {
            jwt.verify(token, process.env.SECRET_KEY, async (err, details) => {
                if (err) {
                    console.error(err);
                    return res.status(403).json("Authentication failed");
                }
                console.log("details", details)
                const admin = await Admin.findOne({ email: details.email });
                if (admin) {
                    req.user = admin._id;
                    return next();

                }
                else {
                    res.status(401).json("unauthorized access of modifying");
                }
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(401).send("Invalid Token");
    }

};







module.exports = {
    UserAuthmiddleware,
    InstructorAuthmiddleware,
    AdminAuthmiddleware,
}