const Course = require("../Models/Course");
const Categories = require("../Models/Categories");
const Topinstructors = require("../Models/Topinstructors");


const Courselist_Controller = async (req, res) => {
    try {
        const limit = 5;
        const searchQuery = req.query.search;
        const categoriesFilter = req.query.categories ? req.query.categories.split(",") : [];
        const TagFilter = req.query.tags ? req.query.tags.split(",") : [];

        const query = {};
        if (searchQuery!==null) {
            query.name = { $regex: searchQuery, $options: "i" };
        }
        if (categoriesFilter.length > 0) {
            query.categories = { $in: categoriesFilter };
        }
        if (TagFilter.length > 0) {
            query.Tags = { $in: TagFilter };
        }
        const blogs = await Course.find(query);
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ msg: "Internal server error occurred" });
        console.log(error);
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
