const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config();
const cookieParser = require("cookie-parser");
const Mongoose = require("mongoose");
const { default: mongoose } = require("mongoose");
const UserRoutes = require("./Routes/UserRoute");
const Search_filter_Route = require("./Routes/Search_filter_Route");
const Bookrouter = require("./Routes/BookRoutes");
const BlogRoute = require("./Routes/BlogRoutes");
const Courserouter = require("./Routes/CourseRoute");
const InstuctorRoute = require("./Routes/InstuctorRoute");
const PaymentRoute = require("./Routes/PaymentRoute");
const AdminRoute = require("./Routes/AdminRoute");
const CategoriesRouter = require("./Routes/Filters");

app.use(cors({
    origin: "*,
    credentials: true,

}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
Mongoose.connect(`${process.env.MONGO_URL}`, { useNewUrlParser: false }).then(() => console.log("connected to Db successfully"));

// app.use("/uploads", express.static(__dirname + "/uploads"));
// app.use("/Images", express.static(__dirname + "/Images"));
//routes
app.use(UserRoutes);
app.use(Search_filter_Route);
app.use(Bookrouter);
app.use(BlogRoute);
app.use(Courserouter);
app.use(InstuctorRoute);
app.use(AdminRoute);
app.use(CategoriesRouter);
app.use(PaymentRoute);



app.listen(5000, () => console.log("server is running on port 5000"));


