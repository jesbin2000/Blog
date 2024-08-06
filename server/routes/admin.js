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


const authMiddleware = ( req, res, next )=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({ message : 'Unauthorized'});
    }
    try{
        const decoded =jwt.verify(token,jwtSecret);
        req.userId = decoded.userId;
        next();
    }catch(error)
    {
        res.status(401).json( {message: 'Unauthorized'} );
    }
}


router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Blog created with NodeJS & Express"
        };
        res.render('admin/index', { locals, layout: adminLayout,message:null });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});


//signIn

router.post('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Blog created with NodeJS & Express"
        };
        const { username, password } = req.body;
        const user = await User.findOne({username});
        if(!user){
            // return res.status(401).json({message: 'Invalid Username'})
            return res.render('admin/index',{locals, layout: adminLayout,message: 'Invalid Username'})
        }
        const isPasswordValid = await bcrypt.compare(password , user.password )
        if(!isPasswordValid){
            // return res.status(401).json({ message: 'Password Incorrect' });
            return res.render('admin/index',{locals, layout: adminLayout,message: 'Password Incorrect' });
        }
        const token = jwt.sign({userId: user._id},jwtSecret)
        res.cookie( 'token' , token,{httpOnly:true});
        res.redirect('/dashboard');


    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});


router.get('/dashboard',authMiddleware, async (req,res) => {
    try{
        const locals = {
            title : 'Dashboard',
            description : 'simple blog  using nodejs '
        }
        const data = await post.find();
        res.render('admin/dashboard',{
            locals,
            data,
            layout: adminLayout
        });
    }
    catch(error){
        console.log(error);
    }
});


/// CREATING POST /admin-post

router.post('/add-post',authMiddleware, async (req,res) => {
    try{
        console.log(req.body);
        try{
            const newPost = new post({
                title : req.body.title,
                body : req.body.body
            });
            await post.create(newPost);
            res.redirect('/dashboard');
            
        }catch(error){
            console.log(error);
        }
    }
    catch(error){
        console.log(error);
    }
});



router.get('/add-post',authMiddleware, async (req,res) => {
    try{
        const locals = {
            title : 'add-post',
            description : 'simple blog  using nodejs '
        }
        const data = await post.find();
        res.render('admin/add-post',{
            locals,
            data,
            layout: adminLayout
        });
    }
    catch(error){
        console.log(error);
    }
});


//GET editing post

router.get('/edit-post/:id',authMiddleware, async (req,res) => {
    try{
        const locals ={
            title : "Edit Post",
            description : "Node js management system"
        }


        const data = await post.findOne({_id: req.params.id});

        res.render('admin/edit-post',{
            locals,
            data,
            layout:adminLayout
        })
    }
    catch(error){
        console.log(error);
    }
});

//EDIT POST/POST

router.put('/edit-post/:id',authMiddleware, async (req,res) => {
    try{
        await post.findByIdAndUpdate(req.params.id,{
            title : req.body.title,
            body : req.body.body,
            updatedAt : Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`);
    }
    catch(error){
        console.log(error);
    }
});


router.get('/signup',async (req, res) => {
    
    res.render('admin/signup', {layout: adminLayout });
});

router.post('/signup',authMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});
        if(user){
            return res.status(401).json({message: 'Username already exist'})
        }
        res.redirect('/admin');
        const hashPassword = await bcrypt.hash(password,10);
        try{
            const user = await User.create({ username , password:hashPassword});
            res.status(201).json({message:'user created',user});
        }catch(error){
            if(error.code === 11000){
                res.status(409).json({message : 'username already exist'})
            }
            res.json(500).json({message:'internal server error'})
        }
    } catch (error) {
        console.log(error);
    }
});



// DELETE //ADMIN post

router.delete('/delete-post/:id',authMiddleware, async (req,res) => { 
try{
    await post.deleteOne({_id : req.params.id});
    res.redirect('/dashboard');
}catch(error){
    console.log(error);
}
})


//GET ADMIIN  LOGOUT

router.get('/logout',(req,res) =>{
    res.clearCookie('token')
    // res.json({message : 'Logout Sucessful'})
    res.redirect('/')
});



module.exports = router;
