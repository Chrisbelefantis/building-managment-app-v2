const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();

router.get('/dept',(req,res)=>{
    res.render('user/dept')
});

router.get('/announcements',(req,res)=>{
    res.render('user/announcements')
});

module.exports = router;