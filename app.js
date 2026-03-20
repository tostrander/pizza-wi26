import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import {validateForm} from './validation.js';

// Load environment variables from .env
dotenv.config();
// console.log(process.env.DB_HOST);

const app = express();
const PORT = 3000;
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// "Middleware" that allows express to read
// form data and store it in req.body
app.use(express.urlencoded({ extended: true }));

// Create a pool (bucket) of database connections
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

// Database test route
app.get('/db-test', async(req, res) => {

    try {
        const pizza_orders = await pool.query('SELECT * FROM orders');
        res.send(pizza_orders[0]);
    } catch(err) {
        console.error('Database error: ', err);
    }
});

// Default route
app.get('/', (req, res) => {
    res.render('home', { errors: null });
});

// Contact route
app.get('/contact-us', (req, res) => {
    res.render('contact');
});

// Confirmation route
app.get('/thank-you', (req, res) => {
    res.render('confirmation');
});

// Admin route
app.get('/admin', async(req, res) => {

    // Read all orders from the database
    // newest first
    let sql = "SELECT * FROM orders ORDER BY timestamp DESC";
    const orders = await pool.query(sql);
    console.log(orders);

    res.render('admin', { orders: orders[0] });
});

// Submit order route
// {"fname":"a","lname":"aa","email":"a",
// "method":"delivery","toppings":["artichokes"],
// "size":"small","comment":"","discount":"on"}
app.post('/submit-order', async(req, res) => {
    
    const order = req.body;

    const valid = validateForm(order);
    if (!valid.isValid) {
        console.log(valid);
        res.render('home', {errors: valid.errors});
        return;
    }
    

    // Create an array of order data
    // (fname, lname, email, size, method, toppings)
    const params = [
        order.fname,
        order.lname,
        order.email,
        order.size,
        order.method,
        Array.isArray(order.toppings) ? order.toppings.join(", ") : "none"
    ];

    // Insert a new order into the database
    const sql = `INSERT INTO orders (fname, lname, email, 
                 size, method, toppings)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    const result = await pool.execute(sql, params);
    console.log("Order inserted with ID: ", result[0].insertId);

    res.render('confirmation', { order });
});

// Listen on the designated port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});