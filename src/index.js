const express = require('express');
const morgan = require('morgan');

const app = express();



// Settings
app.set('port', process.env.PORT || 3000);

// Midlewares
app.use(morgan("dev"));
app.use(express.json());



// Routes
app.use( require('./routes/tasks'));

// Static Files
app.use(express.static(__dirname+"/public"))

// Initialize server
app.listen(app.get('port'), () => {
    console.log("Server is running!")
})