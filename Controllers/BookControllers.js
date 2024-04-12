const Books = require("../Models/Books");
const fs = require("fs");
const Instructor = require("../Models/Instructor");

const Addnew_book_Controller = async (req, res) => {
    try {
        // const new_files = [];

        // req.files.forEach((file) => {
        //     const uploadedpath = file.path;
        //     const format = file.originalname.split(".")[1];
        //     const new_path = 'Images/' + file.filename + Date.now() + "." + format;
        //     fs.renameSync(uploadedpath, new_path, (err) => {
        //         if (err) throw err;
        //         console.log("uploaded successfully");
        //     })
        //     new_files.push(new_path);

        // })
       if(!req.downloadUrls){
        res.status(400).json("Please upload at least one image for the book.");
       }
        // console.log(req.body || req.fields);
        const instructor = await Instructor.findById(req.user);
        const book = new Books({ ...req.body, tags: req.body.tags.split(","), book_pics: req.downloadUrls, seller: instructor._id });
        await book.save();
        instructor.books.push(book._id);
        instructor.save();
        res.status(200).json("created");
        console.log(book);
    }
    catch (err) {
        console.log(err);
        res.status(500).json("Adding new book failed due to internal server error")
    }
}



const Update_book_Controller = async (req, res) => {
    try {
        const { id } = req.query;
        const {title,Author,description,Additional_info,book_price,book_actual_price,In_stock,tags}=req.body;
        const book=await Books.findById(id);
        book.title=title;
        book.Author=Author;
        book.description=description;
        book.Additional_info=Additional_info;
        book.book_price=book_price;
        book.book_actual_price=book_actual_price;
        book.In_stock=In_stock;
        book.save();
        res.status(200).json("updated successfully");



    } catch (error) {
        res.status(500).json("updatation is failed")
    }

}


const Get_All_books_controller = async (req, res) => {
    try {
        const All_Books = await Books.find();
        res.status(200).json(All_Books);

    } catch (error) {
        res.status(500).json("internal server is failed")

    }
}



const Get_single_book_controller = async (req, res) => {
    try {
        const Book = await Books.findById(req.query.id);
        res.status(200).json(Book);

    } catch (error) {

        res.status(500).json("internal server error")

    }
}
const Get_instrutor_books_controller = async (req, res) => {
    try {
        const books = await Instructor.findById(req.user).populate("books");
        console.log(books);
        res.status(200).json(books.books);

    } catch (error) {
        console.log(error);
        res.status(500).json("internal server error")

    }
}
module.exports = {
    Addnew_book_Controller,
    Update_book_Controller,
    Get_All_books_controller,
    Get_single_book_controller,
    Get_instrutor_books_controller
}