

const jwt=require("jsonwebtoken")
const User=require('../models/userModel')

function authentication(req,res,next){
    try{
        const token=req.headers.authorization
        console.log("Authorization Header:",token)

       
        if(!token){
            return res.status(401).json({success:false,message:"No token provided"})
        }

        const authToken=token.startsWith("Bearer ")
          ? token.split(" ")[1]
          :token;
         

          console.log("Autal Token",token)
        const decoded=jwt.verify(authToken,'secretkey')
        console.log('userID >>>>>',decoded.userId)

        User.findByPk(decoded.userId).then(user=>{
            console.log(JSON.stringify(user))
            // req.user=decoded
            req.user = {
                 userId: user.id,
                username: user.username,
               isPremiumUser: user.isPremiumUser
             };

            next();
        })
        .catch(err => { 
            return res.status(401).json({ success: false, message: "User not found" });
        })

        
        
    }
    catch(err){
          return res.status(401).json({success:false,message:"Invalid token provided"})
    }
}

module.exports={authentication}