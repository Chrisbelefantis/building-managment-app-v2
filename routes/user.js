const express = require('express');
const mysql = require('mysql2');
const config = require('../config');

const router = express.Router();

const connection = mysql.createConnection({
    host: config.database.host,
    user: 'root',
    database: config.database.dbName
});


router.get('/dept',(req,res)=>{

    connection.query(`SELECT * FROM dept INNER JOIN expenses on dept.expense = expenses.expense_id WHERE user='${req.userData.email}'`,

    (err1,results) =>{
        if(err1){
            console.log(err1);
            res.render('user/dept',{
                userData: req.userData, 
                dept_records: null,
                sum: null, 
                message: 'Σφάλμα κατά την φόρτωση των χρεών: '+err1.sqlMessage
            })
        }
        else{
            console.log(results);

            //Data preprocessimg
            let sum = 0
            let owners_sum = 0
            let tenants_sum = 0
            for(let i=0; i<results.length; i++){
                sum+= results[i].dept_amount

                if(results[i].is_owner_expense){
                    owners_sum+=results[i].dept_amount
                }
                else{
                    tenants_sum+=results[i].dept_amount
                }

                let date_splitted = results[i].date.toString().split(/[- :]/);
                results[i].date = date_splitted[0] + ' ' + date_splitted[2] + ' ' + date_splitted[1] + ' ' + date_splitted[3]

            }

            res.render('user/dept',{
                userData: req.userData,
                dept_records: results,
                sum: sum,
                tenants_sum: tenants_sum,
                owners_sum: owners_sum
            })
        }
    });
 

});

router.get('/announcements',(req,res)=>{
    res.render('user/announcements',{userData: req.userData})
});

router.get('/expenses-addition',(req,res)=>{
    if(req.userData.isAppartmentBuildingAdmin){
        res.render('user/expenses_addition',{userData: req.userData,message:''})
    }
    else{
        res.send("You don't have access here");
    }
});

router.post('/expenses-addition/add',(req,res)=>{

    //Sanitization is needed here
    let amount = req.body.amount
    let is_owner_expense = req.body.expenseType === 'ownersExpense' ? 1 : 0
    let appartment_building_id = req.userData.appartmentBuilding
    let description = req.body.expenseCategory

    connection.query(
        `INSERT INTO expenses (expense_id, expense_amount, description, date, is_owner_expense, appartment_building) VALUES (NULL, '${amount}','${description}', NOW(), b'${is_owner_expense}', '${appartment_building_id}'); `,
        (err1, results)=>{
            if(err1){
                console.log(err1);
                res.render('user/expenses_addition',{userData: req.userData,message: 'Σφάλμα κάτα την προσθήκη εξόδου: '+err1.sqlMessage})
            }
            else{
                let expenseId = results.insertId;
                //Add dept to all owners
                if(is_owner_expense){

                    //Fetches all owners
                    connection.query(
                        `SELECT user.email FROM user
                        INNER JOIN apartment_building ON
                        apartment_building.appartment_building_id = user.appartmentBuilding
                        INNER JOIN user_appartment ON
                        user.email = user_appartment.user_email
                        AND user_appartment.relation_type = 'owner'
                        WHERE user.appartmentBuilding = ${appartment_building_id}`
                    ,
                    (err2,results)=>{

                        if(err2){
                            console.log(err2);
                            res.render('user/expenses_addition',{userData: req.userData,message: 'Σφάλμα κάτα την προσθήκη εξόδου: '+err2.sqlMessage})
                        }
                        else{
                            
                            //Adding the dept

                            let values = []
                            let per_user_amount = amount/results.length
                            for(let i=0; i< results.length; i++){
                                values.push([null,per_user_amount,description,results[i].email,expenseId])
                            }

                            var sql = "INSERT INTO dept (dept_id, dept_amount, description, user, expense) VALUES ?";

                            connection.query(sql, [values], (err3,results)=> {
                                if(err3){
                                    res.render('user/expenses_addition',{userData: req.userData,message: 'Σφάλμα κάτα την προσθήκη εξόδου: '+err3.sqlMessage})
                                }
                                else{
                                    res.render('user/expenses_addition',{userData: req.userData,message: 'Η προσθήκη ολοκληρώθηκε με επιτυχία'})
                                }
                            });
                        }
                        

                    });


                }
                //Add dept to all teanants
                else{
                  
                    //Fetches all teanants
                    connection.query(
                        `SELECT user.email FROM user
                        INNER JOIN apartment_building ON
                        apartment_building.appartment_building_id = user.appartmentBuilding
                        INNER JOIN user_appartment ON
                        user.email = user_appartment.user_email
                        AND user_appartment.relation_type = 'tenant'
                        WHERE user.appartmentBuilding = ${appartment_building_id}`
                    ,
                    (err2,results)=>{
                        if(err2){
                            console.log(err2);
                            res.render('user/expenses_addition',{userData: req.userData,message: 'Σφάλμα κάτα την προσθήκη εξόδου: '+err2.sqlMessage})
                        }
                        else{

                            //Adding the dept

                            let values = []
                            let per_user_amount = amount/results.length
                            for(let i=0; i< results.length; i++){
                                values.push([null,per_user_amount,description,results[i].email,expenseId])
                            }

                            var sql = "INSERT INTO dept (dept_id, dept_amount, description, user, expense) VALUES ?";

                            connection.query(sql, [values], (err3,results)=> {
                                if(err3){
                                    res.render('user/expenses_addition',{userData: req.userData,message: 'Σφάλμα κάτα την προσθήκη εξόδου: '+err3.sqlMessage})
                                }
                                else{
                                    res.render('user/expenses_addition',{userData: req.userData,message: 'Η προσθήκη ολοκληρώθηκε με επιτυχία'})
                                }
                            });
                        }

                    });
                }
                
            }
        }
    )

});


module.exports = router;