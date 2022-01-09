const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();

router.get('/building-management',(req,res)=>{
    res.render('admin/building_management')
});

router.get('/expenses-addition',(req,res)=>{
    res.render('admin/expenses_addition')
});


module.exports = router;