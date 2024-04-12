const multer = require("multer");
const Bookrouter = require("express").Router();
const Images_upload = multer({ storage:multer.memoryStorage()});
const { Addnew_book_Controller, Update_book_Controller, Get_All_books_controller, Get_single_book_controller, Get_instrutor_books_controller } = require("../Controllers/BookControllers");
const { InstructorAuthmiddleware } = require("../Middlewares/Middleware");
const { uploadMultipleFilesMiddleware } = require("../Middlewares/upload-cloud");

Bookrouter.post("/addnew_book",InstructorAuthmiddleware,Images_upload.array("book_pics"),uploadMultipleFilesMiddleware, Addnew_book_Controller);
Bookrouter.post("/update_book", InstructorAuthmiddleware,Update_book_Controller)
Bookrouter.get("/Get_all_books", Get_All_books_controller);
Bookrouter.get("/Get_single_book", Get_single_book_controller);
Bookrouter.get("/Get_instrutor_books",InstructorAuthmiddleware, Get_instrutor_books_controller);



module.exports = Bookrouter;
