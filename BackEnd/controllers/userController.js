

const User=require("../models/userModel")
const bcrypt=require("bcrypt")
const validator=require("validator")
// const jwt=require("jsonwebtoken")
const generateAccessToken=require("../utils/generateToken");


const signup=async(req,res)=>{

    try{
          const {username,email,password}=req.body

          if(username==null || email==null || password==null){
            return res.status(404).json({error:"Bad parameters . Something is missing"})
          }
          
          const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {

            return res.status(409).json({
                error: "User already exists. Please login"
            });
        }
        console.log("Password:", password);

         if(!validator.isStrongPassword(password)){
                return res.status(401).json({message:
                "Password must contains uppercase,lowercase,number and special character"
                });
            }

          const saltrounds=10
          bcrypt.hash(password,saltrounds,async (err,hash)=>{
            console.log(err)

            const signup=await User.create({
             username:username,
              email:email,
             password:hash
            })
            res.status(201).json({message:"Successfully created a User"})
          })

          
        
    }
    catch(err){
        res.status(500).json({err:err.message})
    }
}

// function generateAccessToken(id,username,isPremiumUser){
//     return jwt.sign({userId:id,username:username,isPremiumUser: isPremiumUser},'secretkey')
// }

const login=async(req,res)=>{
    try{
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({error:"Email and Password required"})
        }
        
        const user=await User.findOne({
            where:{email}
        })
        
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        bcrypt.compare(password,user.password,async (err,result)=>{
            if(err){
                throw new Error("Something is wrong")
            }
            if(result==true){
                return res.status(200).json({successs:true,message:"User Logged in Successfully",token:generateAccessToken(user.id,user.username,user.isPremiumUser),isPremiumUser: user.isPremiumUser})
            }
            else{
                return res.status(400).json({err:"Password is incorrect"})
            }
        })


    }
    catch(err){
        res.status(500).json({err:err.message})
        console.log(err.message)
    }

}

module.exports={signup,login}