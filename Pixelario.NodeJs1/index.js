﻿'use strict'
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var router = express.Router();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));


// passport config
var User = require('./models/user');




var hbs = require('express-hbs');
app.engine('hbs', hbs.express4({    
    partialsDir: [        
        'views/admin/partials/'
    ]
}));


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

var config = require('./config/app');

var mongoose = require('mongoose');



var db = mongoose.connection;
mongoose.connect(config.connectionString, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + config.connectionString + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + config.connectionString);
    }
});

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use(function (req, res, next) {    
    next();
});
var homeController = require('./controllers/admin/homeController.js');
var userController = require('./controllers/admin/userController.js');
var roleController = require('./controllers/admin/roleController.js');

//Rutas para login
app.get('/admin/', homeController.login);
app.post('/admin/login', passport.authenticate('local'), homeController.logon);

//Rutas para usuarios
app.get('/admin/users/', userController.list);
app.get('/admin/users/new', userController.set);
app.post('/admin/users/new', userController.new);
app.get('/admin/users/edit/:id', userController.get);
app.post('/admin/users/edit/:id', userController.update);
app.post('/admin/users/delete/', userController.delete);
app.get('/admin/users/roles/:id', userController.getRoles);
app.post('/admin/users/roles/:id', userController.setRoles);
//Rutas para roles
app.get('/admin/roles/', roleController.list);
app.get('/admin/roles/new', roleController.set);
app.post('/admin/roles/new', roleController.new);
app.get('/admin/roles/edit/:id', roleController.get);
app.post('/admin/roles/edit/:id', roleController.update);
app.post('/admin/roles/delete/', roleController.delete);


app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.listen(3001, function () {
    console.log(__dirname + '/');
    console.log('API REST corriendo en http://localhost:3001');
});