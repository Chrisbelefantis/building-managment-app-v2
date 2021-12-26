const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();

router.get('/building-management',(req,res)=>{
    res.render('admin/building_management')
});

module.exports = router;