const express = require('express');
const router = express.Router();
const post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { create } = require('connect-mongo');
const { render } = require('ejs');

const adminLayout = "../views/layout/admin";
const jwtSecret = process.env.JWT_SECRET;



router.get('/' ,(req ,res) => 
    {
        const  locals = {
            title: "User",
            description: "Blog created with NodeJS & Express"
        };
        res.render('admin/index', { locals, layout: adminLayout,message:null })
    })
    

    module.exports = router;