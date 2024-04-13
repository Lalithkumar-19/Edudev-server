const Course = require("../Models/Course");
const { Courselist_Controller } = require("../Controllers/Search_filter_Controller");
const Search_filter_Route = require("express").Router();



Search_filter_Route.get("/api/course_list",Courselist_Controller);

module.exports = Search_filter_Route;
