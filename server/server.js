const express = require('express');
const dotenv = require('dotenv');
const colors  = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./conifg/db');
const path  = require('path')
const passport = require("passport");
// dotenv config
dotenv.config();

connectDB();
// rest object
const app = express(); //app now has all functionalities of express
//port
const session = require('express-session');
const PORT  = process.env.PORT || 8080;
//middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'bla bla bla' 
  }));
  
app.use(passport.initialize())
app.use(passport.session());

//route
//saare routes ko apna ek link mil  gaya hai server par
app.use('/api/v1/test',require('./routes/testroutes'))
app.use('/api/v1/auth',require('./routes/authRoutes'))
app.use('/api/v1/inventory', require('./routes/inventoryRoutes'))
app.use('/api/v1/admin', require('./routes/adminRoutes'))
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'))
//listen
app.use(express.static(path.join(__dirname,'./client/build')))

app.get("*",function(req,res){
    res.sendFile(path.resolve(__dirname,"./client/build/index.html"))
})
app.listen(PORT, () =>{
    console.log('Node server running In ${process.env.DEV_MODE} mode on PORT ${process.env.PORT}');
});