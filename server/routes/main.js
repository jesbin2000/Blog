const express = require('express');
const router = express.Router();
const post = require('../models/post'); 

// Routes
router.get('', async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 3;

        const data = await post.aggregate([
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit }
        ]);

        const count = await post.countDocuments();
        const nextPage = page + 1;
        const hasNextPage = nextPage <= Math.ceil(count / limit);

        const locals = {
            title: "Nodejs Blog",
            description: "Blog created NodeJS & Express"
            // currentRoute: '/'
        };

        res.render('index', { locals, data, nextPage: hasNextPage ? nextPage : null });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;

        const locals = {
            title: "Nodejs Blog",
            description: "Blog created NodeJS & Express",
            // currentRoute: `/post/${slug}`
        };

        const data = await post.findById(slug); 
        res.render('post', { locals, data });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Blog created NodeJS & Express"
        };
        
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, ""); // Fixed regex to remove special characters
        
        const data = await post.find({
            $or:[
                {title:{$regex:new RegExp(searchNoSpecialChar,'i')}},
                {body:{$regex:new RegExp(searchNoSpecialChar,'i')}}
            ]
        });

        res.render('search', { data, locals });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/about', (req, res) => {
    const locals = {
        title: "About",
        description: "About Page",
        // currentRoute: '/about'
    };

    res.render('about', { locals });
});

module.exports = router;
