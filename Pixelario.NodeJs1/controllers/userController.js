﻿var Users = require('../models/user');
var config = require('../config/app');
exports.list = function (req, res) {
    Users.find({}).exec(function (err, users) {
        var _users = [];
        users.forEach(function (item) { 
            _users.push({ user: { id: item._id, email: item.email } });
        });
        res.render('admin/users/list', {
            users: _users,
            helpers: {
                appName: config.name,               
            }, 
            layout: '../../views/admin/layout/CMS',
        });
    });
}
exports.set = function (req, res) {
    res.render('admin/users/new', {
        layout: false       
    });
};
exports.new = function (req, res) {
    var _user = new Users({         
        email: req.body.email,
        password: req.body.password,
        role: 'init'
    });
    _user.save(function (error, documento) {
        if (error) {
            res.send(error);
        }
        else {
            res.redirect('/admin/users');
        }
    });
};
exports.get = function (req, res) {
    Users.findOne({ _id: req.params.id }).exec(function (err, user) {
        var _user = {
            id: user._id,
            firstname: user.first_name,
            lastname: user.last_name
        };
        res.render('admin/users/edit', {
            user: _user,
            appName: config.name,
            layout: '../../views/admin/layout/CMS',
        });
    });
};
exports.update = function (req, res) {
    Users.findById(req.params.id, function (err, user) {
        user.first_name = req.body.firstname;
        user.last_name = req.body.lastname;
        user.save(function (error, documento) {
            if (error) {
                res.send(error);
            }
            else {
                res.redirect('/admin/users');
            }
        });
    });
};
