const jwt = require('jsonwebtoken');
const config = require('../config');

const checkAuth = (route) =>{
    return (req, res, next) => {
        try {
            const token = req.cookies['AuthToken'];
            const decoded = jwt.verify(token, config.JWTKey);
            req.userData = decoded;
            
            console.log(req.userData)
            if(route==='admin' && req.userData.isAdmin===true){
                next()
            }
            else if (route==='user' && req.userData.isAppartmentBuildingAdmin===1 && req.userData.isAdmin===false){
                next()
            }
            else if (route==='user' && req.userData.isAppartmentBuildingAdmin===0 && req.userData.isAdmin===false){
                next()
            }
            else{
                res.send("You don't have access here");
            }

        } catch (error) {
            res.redirect('/?auth=failed');
        }
    }
}

module.exports = checkAuth
