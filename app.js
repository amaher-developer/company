var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var maher = require('express-handlebars');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
const fileUpload = require('express-fileupload');
var passport = require('passport');
var flash = require('connect-flash');
var session;
var MongoStore = require('connect-mongo')(expressSession);
var operateRouter = require('./routes/operate');
var frontRouter = require('./routes/front');
var routes = require('./routes/index');
var userRoutes = require('./routes/user');


var app = express();

mongoose.connect('localhost:27017/internet');
require('./config/passport');

//
// app.use('/front', frontRouter);
// app.engine('maher', maher({extname: 'maher', defaultLayout:'index', layoutsDir:path.join(__dirname, "views/front"), layout:'index'}));
//
//



// view engine setup

app.engine('maher', maher({extname: 'maher', defaultLayout:'index', layoutsDir:path.join(__dirname, "views/admin"), layout:'admin'}));
app.engine('maher', maher({extname: 'maher', defaultLayout: 'index', layoutsDir:(__dirname + '/views/front/'), layout:'front'}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'maher');


// app.set('view options', { layout: 'other' });

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'maher');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(expressSession({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180*60*1000} // 3 hours
}));
// app.use(expressSession({secret: 'max', cookie: {maxAge: 60000}}));
// app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false, cookie: {maxAge: 60000}}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(fileUpload());


app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

// app.get('/login', function (req, res, next) {
//     session = req.session;
//     if(session.uniqueID){
//         res.redirect('/redirects');
//     }
//     res.render('./login', {title: 'Login', page_name:'login', layout: '../login'});
// });
//
// app.post('/login', function (req, res, next) {
//     session = req.session;
//     if(req.body.name == 'admin' && (req.body.password == 'admin')){
//         session.uniqueID = req.body.name;
//     }
//     res.redirect('./redirects');
// });
//
// app.get('/redirects', function (req, res, next) {
//     session = req.session;
//
//     if(session.uniqueID){
//         res.redirect('/operate');
//     }else{
//         req.session.errors = 'Wrong username or password.';
//
//         res.render('./login', {title: 'Login', errors: req.session.errors, layout: '../login'});
//         req.session.errors = null;
//     }
// });
//
// app.get('/logout', function (req, res, next) {
//     req.session.destroy(function (err) {
//         res.redirect('/login');
//     });
//
// });

app.use('/', frontRouter);
app.use('/operate', operateRouter);
app.use('/user', userRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;















