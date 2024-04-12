// const Courselist_Controller  = require("../Controllers/Search_filter_Controller");
const Course = require("../Models/Course");
const Search_filter_Route = require("express").Router();



Search_filter_Route.get("/api/course_list", async (req, res) => {
    try {
        const { category, instructor, search, price } = req.query;

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
});

module.exports = Search_filter_Route;