const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const config = require('./config');
const jwt = require('jsonwebtoken');
const checkAuth = require('./middleware/checkAuth');

const port = 3000

const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')

const app = express()

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/',(req, res) => {
    res.render("login")
})

app.post('/login',(req,res)=>{
     
    // create the connection to database
    const connection = mysql.createConnection({
        host: config.database.host,
        user: 'root',
        database: config.database.dbName
    });
    
    let isAdmin = false;
    let userData;
    connection.query(
        `SELECT * FROM 	apartment_building WHERE admin_email = '${req.body.email}' `,
        (err1, results)=>{
            if(results.length>0){
                isAdmin = true;
            }
            connection.query(
                `SELECT * FROM 	user WHERE email = '${req.body.email}' `,
                (err2, results)=>{
                    if(results.length>0){
                        userData ={
                            'username':results[0].username,
                            'email': results[0].email,
                            'isAppartmentBuildingAdmin': results[0].isAppartmentBuildingAdmin,
                            'appartmentBuilding': results[0].appartmentBuilding,
                            'isAdmin' : isAdmin
                        }
                    }
                    
                    //Final Logic Here
                    if(userData){
                        const token = jwt.sign(
                            userData,
                            config.JWTKey, {
                            expiresIn: "1h"
                        })
                        console.log(token);
                        res.cookie('AuthToken', token);
                        
                        if(userData.isAppartmentBuildingAdmin){
                            res.redirect('/admin/building-management')
                        }
                        else{
                            res.redirect('/user/dept')
                        }

                    }
                    else{
                        res.redirect('/?auth=failed');
                    }

                }
            );
            
        }
    );
})

app.get('/logout',(req,res)=>{
    res.clearCookie("AuthToken");
    res.redirect("/");
})

app.use('/user',checkAuth('user'),userRoutes)

app.use('/admin',checkAuth('admin'),adminRoutes)

app.get('*',(req,res)=>{
    res.send("Error 404: Page Not Found")
})

app.listen(port, () => {
    console.log(`Server is running and listening at ${port}`)
})