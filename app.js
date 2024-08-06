require('dotenv').config();
const express =  require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const app =express();
const cookieparser = require('cookie-parser');
const adminLayout = "../views/layout/admin";
const mongoStore = require('connect-mongo');
const session = require('express-session');
const {isActiveRoute} = require('./server/helpers/routeHelpers');


connectDB()//connecting DB

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieparser());
app.use(methodOverride('_method'));

app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized: true,
    store:mongoStore.create({
    mongoUrl : process.env.MONGODB_URI
    }),
}));

const PORT = 5000 || process.env.PORT;  // local host port
app.use(express.static('public'));
app.locals.isActiveRoute = isActiveRoute;


//Template Engine
app.use(expressLayout);
app.set('layout' , './layout/main');
app.set('view engine','ejs');


app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));
app.use('/users', require('./server/routes/user'));




app.listen(PORT,()=>{
    console.log(`Server running on port : ${PORT}`);
});


