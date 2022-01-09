const express = require('express');
const router = express.Router();

router.get('/dept',(req,res)=>{
    res.render('user/dept',{userData: req.userData})
});

router.get('/announcements',(req,res)=>{
    res.render('user/announcements',{userData: req.userData})
});

router.get('/expenses-addition',(req,res)=>{
    if(req.userData.isAppartmentBuildingAdmin){
        res.render('user/expenses_addition',{userData: req.userData})
    }
    else{
        res.send("You don't have access here");
    }
});

module.exports = router;