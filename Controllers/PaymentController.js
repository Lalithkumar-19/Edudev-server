const Orders = require("../Models/Orders");
const User = require("../Models/User");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);


const payment_controller = async (req, res) => {
    const line_items = req.body.cartItems.map((item) => {
        return {
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.product_details.title,
                    metadata: {
                        id: item.product_details._id,
                    },
                },
                unit_amount: item.product_details.book_price * 100,
            },
            quantity: item.quantity,
        };
    });
    const customer = await stripe.customers.create({
        metadata: {
            userId: req.body.userId,
            cart: JSON.stringify(line_items),
        },
    });
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        shipping_address_collection: {
            allowed_countries: ["US", "IN"],
        },

        phone_number_collection: {
            enabled: true,
        },
        line_items,
        mode: "payment",
        customer: customer.id,
        success_url: "http://localhost:5173/yourcart/checkout/success",
        cancel_url: "http://localhost:5174/yourcart/checkout"
    });

    // res.redirect(303, session.url);
    return res.status(201).json(session);
}


const Buy_a_course_controller = async (req, res) => {
    try {

        const line_items = [{
            price_data: {
                currency: "inr",
                product_data: {
                    name: req.body.name,
                    metadata: {
                        id: req.body.id,
                    },
                },
                unit_amount: req.body.price * 100,
            },
            quantity: 1,
        }]

        const customer = await stripe.customers.create({
            metadata: {
                userId: req.body.userId,
                course_id: req.body.course_id,
                cart: JSON.stringify(line_items),
            },
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            customer: customer.id,
            success_url: "http://localhost:5173/yourcart/checkout/success",
            cancel_url: "http://localhost:5174/"
        });

        // res.redirect(303, session.url);
        return res.status(201).json(session);


    } catch (error) {
        console.log(error, "error")
        res.status(500).json("failed to proceed with payment");
    }
}




const createOrder = async (customer, data) => {
    try {
        const Items = JSON.parse(customer.metadata.cart);
        const products = Items.map((item) => {
            return {
                name: item.price_data.product_data.name,
                product_Id: item.price_data.product_data.metadata.id,
                quantity: item.quantity,
            }
        });
        const newOrder = new Orders({
            userId: customer.metadata.userId,
            customerId: data.customer,
            paymentIntentId: data.payment_intent,
            products: products,
            subtotal: data.amount_subtotal,
            shipping: data.customer_details,
            payment_status: data.payment_status,

        });
        const savedOrder = await newOrder.save();
        const user_details = await User.findById(savedOrder.userId);
        user_details.orders.push(savedOrder._id);
        user_details.save();
        console.log(savedOrder, "saved");
    } catch (error) {
        console.log(error);
    }
}



const Add_buyed_course = async (course_id, user_id) => {
    try {
        console.log("loggeflndvknskmnkjnfkjsnldkqoasafpq[kjenfjrv kjnr");
        const user = await User.findById(user_id);
        console.log(user);
        await user.learnings.push(course_id);
        user.save();
    } catch (error) {
        console.log(error);
    }
}


// const endpointSecret = "whsec_ecc9f52f142d112413a5a36f251299c444b9056d2a9efc40320d6165823ecf78";
const stipe_webhook = async (req, res) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret;
    //webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers["stripe-signature"];

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                webhookSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed:  ${err}`);
            return res.sendStatus(400);
        }
        // Extract the object from the event.
        data = event.data.object;
        eventType = event.type;
    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // retrieve the event data directly from the request body.
        data = req.body.data.object;
        eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
        stripe.customers
            .retrieve(data.customer)
            .then(async (customer) => {
                try {
                    console.log("customer:==>", customer);
                    console.log("data:==>", data);
                    // CREATE ORDER
                    if (data.customer_details.address.city !== null) {
                        createOrder(customer, data);
                    } else {
                        Add_buyed_course(customer.metadata.course_id, customer.metadata.userId);
                    }

                } catch (err) {
                    console.log(err);
                }
            })
            .catch((err) => console.log(err.message));
    }

    res.status(200).end();
}


module.exports = { payment_controller, stipe_webhook, Buy_a_course_controller };