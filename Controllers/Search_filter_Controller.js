const Course = require("../Models/Course");
const Categories = require("../Models/Categories");
const Topinstructors = require("../Models/Topinstructors");


const Courselist_Controller =async (req, res) => {
    try {
        const { category,search, price } = req.query;

        const filter = {};


        if (category) {
            filter.category = category;
        }
        const textSearchQuery = search ? { course_name: { $regex: search, $options: "i" } } : {};
        const pricefilter = price ? { course_price: { $lte: price } } : {};
        // Query the database based on filters and search text
        const courses = await Course.find({ ...filter, ...textSearchQuery, ...pricefilter }).populate({
            path: 'creator',
            select: "instructor_pic instructor_name"
        });
        res.json({ data: courses, leng: courses.length, total: await Course.countDocuments() });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



const Get_all_Categories = async (req, res) => {
    try {
        const categories = await Categories.find({});
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json("Not Fetched successfully");
    }
}

const Add_categories = async (req, res) => {
    try {
        await Categories.insertMany(req.body);
        res.status(200).json("inserted successfully");
    } catch (error) {
        res.status(500).json("Not Fetched successfully");
    }
}
const Add_Top_instructors = async (req, res) => {
    try {
        await Topinstructors.insertMany(req.body);
        res.status(200).json("inserted successfully");
    } catch (error) {
        res.status(500).json("internal server error occured");
    }
}


const Get_all_top_instructors = async (req, res) => {
    try {
        const Top_ins = await Topinstructors.find({});
        res.status(200).json(Top_ins);
    } catch (error) {
        res.status(500).json("internal server");
    }
}

module.exports = { Courselist_Controller, Get_all_Categories,Add_categories,Add_Top_instructors,Get_all_top_instructors };
